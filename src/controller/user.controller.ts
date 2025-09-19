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
      const userId = req.params.userId as string;

      // Fetch the user data from the database (Prisma in this case)
      const userProfile = await UserService.getUserProfileById(userId);
      const userPreferences = await UserService.getUserPreferences(userId);
      // If the user is not found, return a 404 error
      if (!userProfile) {
        return Send.notFound(res, {}, "User not found");
      }
      // Return the user data in the response
      return Send.success(res, { ...userProfile, userPreferences });
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

  static updateUserPreferences = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId as string;
      const { preferences } = req.body;
      const categoryIds: string[] = preferences.map(
        (pref: { categoryId: string }) => pref.categoryId
      );
      await UserService.updateUserPreferences(userId, categoryIds);
      return Send.success(res, {}, "Update user preferences successfully");
    } catch (error) {
      console.error("Error :", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static getAllUserCollections = async (req: Request, res: Response) => {
    try {
      const userId = req.cookierUserId as string;
      const collections = await UserService.getAllUserCollections(userId);
      return Send.success(res, collections, "Get collections successfully");
    } catch (error) {
      console.error("Error :", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static getUserCollectionById = async (req: Request, res: Response) => {
    try {
      const userId = req.cookierUserId as string;
      const collectionId = req.params.collectionId as string;

      const collection = await UserService.getUserCollectionById(collectionId);
      if (!collection || collection.userId !== userId) {
        return Send.badRequest(res, {}, "Invalid request data");
      }
      return Send.success(res, collection, "Get collection successfully");
    } catch (error) {
      console.error("Error :", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static createUserCollection = async (req: Request, res: Response) => {
    try {
      const userId = req.cookierUserId as string;
      const collectionName = req.body.name;
      const col = await UserService.createUserCollection(
        userId,
        collectionName
      );
      return Send.success(res, col, "Create collection successfully");
    } catch (error) {
      console.error("Error :", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static updateUserCollection = async (req: Request, res: Response) => {
    try {
      const userId = req.cookierUserId as string;
      const collectionId = req.params.collectionId as string;
      const { name } = req.body;
      const collection = await UserService.getUserCollectionById(collectionId);
      if (!collection || collection.userId !== userId) {
        return Send.badRequest(res, {}, "Invalid request data");
      }

      const update = await UserService.updateUserCollection(collectionId, name);
      return Send.success(res, update, "  successfully");
    } catch (error) {
      console.error("Error :", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static deleteUserCollection = async (req: Request, res: Response) => {
    try {
      const userId = req.cookierUserId as string;
      const collectionId = req.params.collectionId as string;
      const collection = await UserService.getUserCollectionById(collectionId);
      if (!collection || collection.userId !== userId) {
        return Send.badRequest(res, {}, "Invalid request data");
      }

      const del = await UserService.deleteUserCollection(collectionId);
      return Send.success(res, del, "  successfully");
    } catch (error) {
      console.error("Error :", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static getRecipesFromCollection = async (req: Request, res: Response) => {
    try {
      const userId = req.cookierUserId as string;
      const collectionId = req.params.collectionId as string;
      const collection = await UserService.getUserCollectionById(collectionId);
      if (!collection || collection.userId !== userId) {
        return Send.badRequest(res, {}, "Invalid request data");
      }

      const recipes = await UserService.getUserCollectionRecipes(collectionId);
      return Send.success(
        res,
        recipes,
        "Get recipes from collection successfully"
      );
    } catch (error) {
      console.error("Error :", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static addRecipeUserCollection = async (req: Request, res: Response) => {
    try {
      const userId = req.cookierUserId as string;
      const { collectionId, recipeId } = req.body;
      const collection = await UserService.getUserCollectionById(collectionId);
      if (!collection || collection.userId !== userId) {
        return Send.badRequest(res, {}, "Invalid request data");
      }

      const created = await UserService.addRecipeToUserCollection(
        collectionId,
        recipeId
      );
      return Send.success(res, created, "  successfully");
    } catch (error) {
      console.error("Error :", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static updateRecipeUserCollection = async (req: Request, res: Response) => {
    try {
      const userId = req.cookierUserId as string;
      const { currentCollectionId, newCollectionId, recipeId } = req.body;
      const collection = await UserService.getUserCollectionById(
        currentCollectionId
      );
      if (!collection || collection.userId !== userId) {
        return Send.badRequest(res, {}, "Invalid request data");
      }

      const updated = await UserService.updateRecipeToNewCollection(
        currentCollectionId,
        newCollectionId,
        recipeId
      );
      return Send.success(res, updated, "  successfully");
    } catch (error) {
      console.error("Error :", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static deleteRecipeUserCollection = async (req: Request, res: Response) => {
    try {
      const userId = req.cookierUserId as string;
      const collectionId = req.params.collectionId as string;
      const recipeId = req.params.recipeId as string;
      const collection = await UserService.getUserCollectionById(collectionId);
      if (!collection || collection.userId !== userId) {
        return Send.badRequest(res, {}, "Invalid request data");
      }

      const del = await UserService.removeRecipeFromCollection(
        collectionId,
        recipeId
      );
      return Send.success(res, del, "  successfully");
    } catch (error) {
      console.error("Error :", error);
      return Send.error(res, {}, "Internal server error");
    }
  };
}

export default UserController;
