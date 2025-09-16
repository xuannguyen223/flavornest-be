import type { Request, Response } from "express";
import UserService from "../service/user.service.js";
import Send from "../utils/response.utils.js";

class UserController {
  /**
   * Get the user information based on the authenticated user.
   * The userId is passed from the AuthMiddleware.
   */
  static getUserById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      // Fetch the user data from the database (Prisma in this case)
      const user = await UserService.getUserById(userId as string);

      // If the user is not found, return a 404 error
      if (!user) {
        return Send.notFound(res, {}, "User not found");
      }

      // Return the user data in the response
      return Send.success(res, { user });
    } catch (error) {
      console.error("Error fetching user info:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static getUserProfileById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      // Fetch the user data from the database (Prisma in this case)
      const user = await UserService.getUserProfileById(userId as string);
      // If the user is not found, return a 404 error
      if (!user) {
        return Send.notFound(res, {}, "User not found");
      }
      // Return the user data in the response
      return Send.success(res, { user });
    } catch (error) {
      console.error("Error fetching user info:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static updateUserProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const profileData = req.body;

      const profile = await UserService.createOrUpdateProfile({
        ...profileData,
        userId,
      });
      return Send.success(res, { profile }, "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };
}

export default UserController;
