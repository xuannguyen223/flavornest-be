import { google } from "googleapis";
import UserService from "./user.service.js";
import { Gender } from "../generated/prisma/enums.js";
import { getAgeFromBirthday } from "../utils/constants.utils.js";
import type { Profile, User } from "../generated/prisma/client.js";
import { randomBytes } from "crypto";
import CachingService from "./caching.service.js";

class GoogleIdentityService {
  /**
   * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.
   * To get these credentials for your application, visit
   * https://console.cloud.google.com/apis/credentials.
   */
  private static oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URI
  );

  // Access scopes for two non-Sign-In scopes: Read-only Drive activity and Google Calendar.
  private static SCOPES = (process.env.GOOGLE_OAUTH_SCOPES ?? "").split(",");

  private static verifyScopes = (scopes: string) => {
    for (const scope of GoogleIdentityService.SCOPES) {
      if (!scopes.includes(scope)) {
        return false;
      }
    }
    return true;
  };

  /* Google Developer Guide
   * Global variable that stores user credential in this code example.
   * ACTION ITEM for developers:
   *   Store user's refresh token in your data store if
   *   incorporating this code into your real app.
   *   For more information on handling refresh tokens,
   *   see https://github.com/googleapis/google-api-nodejs-client#handling-refresh-tokens
   */
  static generateAuthUrl = async (state: string) => {
    return this.oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: this.SCOPES,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
      // Include the state parameter to reduce the risk of CSRF attacks.
      state: state,
    });
  };

  static handleGoogleAuthorzationCode = async (code: string) => {
    // Get access and refresh tokens (if access_type is offline)
    let { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    // User authorized the request. Now, check which scopes were granted.
    console.log("Granted scopes: " + tokens.scope);
    if (tokens.scope && this.verifyScopes(tokens.scope)) {
      const peopleAPI = google.people({
        version: "v1",
        auth: this.oauth2Client,
      });
      const response = await peopleAPI.people.get({
        resourceName: "people/me",
        personFields:
          "emailAddresses,names,genders,birthdays,phoneNumbers,photos",
      });
      const userEmail = response.data.emailAddresses?.[0]?.value;
      if (!userEmail || userEmail.length === 0) {
        console.log("No email found for user.");
        return null;
      }
      let user = await UserService.getUserByEmail(userEmail);
      if (!user) {
        user = await UserService.createUser({
          email: userEmail,
          password: randomBytes(16).toString("hex"),
        } as User);
        const birthDate = response.data.birthdays?.find(
          (b) => b.metadata?.source?.type === "ACCOUNT"
        )?.date;
        UserService.createOrUpdateProfile({
          userId: user.id,
          name: response.data.names?.[0]?.displayName || "",
          age: getAgeFromBirthday(
            birthDate?.year,
            birthDate?.month,
            birthDate?.day
          ),
          gender:
            (response.data.genders?.[0]?.value as Gender) || Gender.FEMALE,
          avatarUrl: response.data.photos?.[0]?.url || "",
        } as Profile);
      }

      // Save refresh token to refresh in case access token was refreshed.
      if (tokens.refresh_token && tokens.access_token) {
        await CachingService.saveUserGoogleAuthToken(
          user.id,
          tokens.refresh_token,
          tokens.access_token
        );
      }

      return {
        id: user.id,
        email: userEmail,
      };
    } else {
      console.log("Missing or invalid scopes");
      return null;
    }
  };

  // Uncomment this when need to refresh access token
  // private static refreshAccessToken = async (userId: string) => {
  //   return await CachingService.getUserGoogleRefreshToken(userId);
  // };

  static revokeToken = async (userId: string) => {
    try {
      const tokens = await CachingService.getUserGoogleAuthToken(userId);
      if (tokens && tokens.accessToken) {
        await this.oauth2Client.revokeToken(tokens.accessToken);
        await CachingService.deleteUserGoogleAuthToken(userId);
      }
      console.log("Token revoked.");
    } catch (error) {
      console.error("Error revoking token:", error);
    }
  };
}

export default GoogleIdentityService;
