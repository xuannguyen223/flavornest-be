import crypto from "crypto";
import url from "url";
import type { Request, Response } from "express";
import UserService from "../service/user.service.js";
import type { Profile, User } from "../generated/prisma/client.js";
import type authSchema from "../validation/auth.schema.js";
import type z from "zod";
import Send from "../utils/response.utils.js";
import GoogleIdentityService from "../service/googleIdentity.service.js";
import authConfig from "../config/auth.config.js";
import CachingService from "../service/caching.service.js";

class AuthController {
  static register = async (req: Request, res: Response) => {
    // Destructure the request body into the expected fields
    const { email, password, fullname } = req.body as z.infer<
      typeof authSchema.register.shape.body
    >;

    try {
      // 1. Check if the email already exists in the database
      const existingUser = await UserService.getUserByEmail(email);
      console.log(existingUser);
      // If a user with the same email exists, return an error response
      if (existingUser) {
        return Send.badRequest(res, null, "Email is already in use.");
      }

      // 2. Create a new user in the database with hashed password
      const newUser = await UserService.createUser({
        email,
        password,
      } as User);

      // 3. Create user profile
      if (newUser && newUser.id) {
        await UserService.createOrUpdateProfile({
          userId: newUser.id,
          name: fullname,
        } as Profile);
      }

      // 4. Return a success response with the new user data (excluding password for security)
      return Send.success(
        res,
        {
          id: newUser.id,
          email: newUser.email,
        },
        "User successfully registered."
      );
    } catch (error) {
      // Handle any unexpected errors (e.g., DB errors, network issues)
      console.error("Registration failed:", error); // Log the error for debugging
      return Send.error(res, null, "Registration failed.");
    }
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body as z.infer<
      typeof authSchema.login.shape.body
    >;
    try {
      const user = await UserService.loginUser(email, password);
      if (!user) {
        return Send.notFound(res, null, "Invalid email or password.");
      }

      const { accessToken, refreshToken } = await UserService.generateJwtTokens(
        user.id
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true, // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
        secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS-only cookies
        maxAge: authConfig.access_token_expires_in_ms, // 15 minutes in mileseconds
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Ensures the cookie is sent only with requests from the same site
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: authConfig.refresh_token_expires_in_ms, // 24 hours is mileseconds
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });

      return Send.success(
        res,
        {
          id: user.id,
          email: user.email,
        },
        "Login successful."
      );
    } catch (error) {
      console.error("Login failed:", error);
      return Send.error(res, null, "Login failed.");
    }
  };

  static logout = async (req: Request, res: Response) => {
    try {
      // 1. We will ensure the user is authenticated before running this controller
      //    The authentication check will be done in the middleware (see auth.routes.ts).
      //    The middleware will check the presence of a valid access token in the cookies.
      const userId = req.cookierUserId as string;
      // 2. Remove the refresh token from the database (optional, if using refresh tokens)
      await UserService.revokeRefreshToken(userId);

      // 3. Remove the access and refresh token cookies
      // We clear both cookies here (accessToken and refreshToken)
      res.clearCookie("accessToken", {
        httpOnly: true, // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
        secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS-only cookies
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Ensures the cookie is sent only with requests from the same site
        path: "/",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true, // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
        secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS-only cookies
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Ensures the cookie is sent only with requests from the same site
        path: "/",
      });

      if (await UserService.isUserLoginGoogle(userId)) {
        await GoogleIdentityService.revokeToken(userId);
      }

      // 4. Send success response after logout
      return Send.success(res, null, "Logged out successfully.");
    } catch (error) {
      // 5. If an error occurs, return an error response
      console.error("Logout failed:", error); // Log the error for debugging
      return Send.error(res, null, "Logout failed.");
    }
  };

  static refreshToken = async (req: Request, res: Response) => {
    try {
      const userId = req.cookierUserId as string; // Get userId from the refreshTokenValidation middleware
      const refreshToken = req.cookies.refreshToken; // Get the refresh token from cookies

      // Check if the refresh token has been revoked
      const user = await UserService.getUserById(userId);
      const storedRefreshToken = await UserService.getRefreshToken(userId);

      if (!user || !storedRefreshToken) {
        return Send.unauthorized(res, "Refresh token not found");
      }

      // Check if the refresh token in the database matches the one from the client
      if (storedRefreshToken !== refreshToken) {
        return Send.unauthorized(res, { message: "Invalid refresh token" });
      }

      // Generate a new access token
      const newAccessToken = UserService.generateAccessToken(userId);

      // Send the new access token in the response
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: authConfig.access_token_expires_in_ms, // 15 minutes
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });

      return Send.success(res, {
        message: "Access token refreshed successfully",
      });
    } catch (error) {
      console.error("Refresh Token failed:", error);
      return Send.error(res, null, "Failed to refresh token");
    }
  };

  static googleOAuthAuthorize = async (req: Request, res: Response) => {
    // Generate a secure random state value.
    const state = crypto.randomBytes(32).toString("hex");

    // Store it in Redis to verify later
    await CachingService.saveGoogleOauthState(state);

    // Generate a url that asks permissions for the Drive activity and Google Calendar scope
    const authorizationUrl = await GoogleIdentityService.generateAuthUrl(state);

    console.log("Authorization URL:", authorizationUrl); // Log the URL for debugging
    Send.success(
      res,
      authorizationUrl,
      "Google OAuth authorization URL generated."
    );
  };

  static googleOAuthCallback = async (req: Request, res: Response) => {
    // Handle the OAuth 2.0 server response
    let q = url.parse(req.url, true).query;
    const isStateExist = await CachingService.googleOauthStateExists(
      q.state as string
    );

    if (q.error) {
      // An error response e.g. error=access_denied
      console.log("Error:" + q.error);
    } else if (!isStateExist) {
      //check state value
      console.log("State mismatch. Possible CSRF attack");
      return Send.badRequest(res, {}, "State mismatch. Possible CSRF attack");
    } else {
      console.log("Code:" + q.code);
      if (typeof q.code === "string") {
        const user = await GoogleIdentityService.handleGoogleAuthorzationCode(
          q.code
        );
        if (!user || !user.id) {
          return Send.error(res, {}, "Failed to retrieve user profile.");
        }
        const { accessToken, refreshToken } =
          await UserService.generateJwtTokens(user.id);

        res.cookie("accessToken", accessToken, {
          httpOnly: true, // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
          secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS-only cookies
          maxAge: authConfig.access_token_expires_in_ms, // 15 minutes in mileseconds
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: authConfig.refresh_token_expires_in_ms, // 24 hours is mileseconds
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return Send.redirect(res, process.env.FRONTEND_URL + "/");
      } else {
        Send.badRequest(res, {}, "Invalid or missing authorization code.");
      }
    }
  };

  static googleOAuthRevoke = async (req: Request, res: Response) => {
    // // Build the string for the POST request
    // let postData = "token=" + userCredential.access_token;
    // // Options for POST request to Google's OAuth 2.0 server to revoke a token
    // let postOptions = {
    //   host: "oauth2.googleapis.com",
    //   port: "443",
    //   path: "/revoke",
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     "Content-Length": Buffer.byteLength(postData),
    //   },
    // };
    // // Set up the request
    // const postReq = https.request(postOptions, function (res) {
    //   res.setEncoding("utf8");
    //   res.on("data", (d) => {
    //     console.log("Response: " + d);
    //   });
    // });
    // postReq.on("error", (error) => {
    //   console.log(error);
    // });
    // // Post the request with data
    // postReq.write(postData);
    // postReq.end();
  };
}
export default AuthController;
