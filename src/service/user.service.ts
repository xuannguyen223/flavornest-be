import bcrypt from "bcrypt";
import type { Profile, User } from "../generated/prisma/client.js";
import UserRepository from "../repository/user.repository.js";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";
import CachingService from "./caching.service.js";
import UserProfileRepository from "../repository/userProfile.repository.js";
import UserPreferenceRepository from "../repository/userPreference.repository.js";
import UserCollectionRepository from "../repository/userCollection.repository.js";

class UserService {
  static getUserById = (id: string) => {
    return UserRepository.queryById(id);
  };

  static getUserProfileById = (userId: string) => {
    return UserProfileRepository.queryById(userId);
  };

  static getUserByEmail = (email: string) => {
    return UserRepository.queryByEmail(email);
  };

  static createUser = async (user: User) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return UserRepository.createNewUser(user);
  };

  static createOrUpdateProfile = async (profile: Profile) => {
    return await UserProfileRepository.insertOrUpdateProfile(profile);
  };

  static getUserPreferences = (userId: string) => {
    return UserPreferenceRepository.queryAllByUserId(userId);
  };

  static updateUserPreferences = async (
    userId: string,
    categoryIds: string[]
  ) => {
    await UserPreferenceRepository.deleteAllByUserId(userId);
    await Promise.all(
      categoryIds.map((id) =>
        UserPreferenceRepository.upsertUserPreference(userId, id)
      )
    );
  };

  static loginUser = async (email: string, password: string) => {
    const user = await UserRepository.queryByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  };

  static generateAccessToken = (userId: string) => {
    return jwt.sign(
      { userId: userId },
      authConfig.secret, // Use the secret from the authConfig for signing the access token
      { expiresIn: authConfig.access_token_expires as any } // Use the expiration time from the config (e.g., "15m")
    );
  };

  static generateJwtTokens = async (userId: string) => {
    // 3. Generate an access token (JWT) with a short expiration time (e.g., 15 minutes)
    const accessToken = this.generateAccessToken(userId);

    // 4. Generate a refresh token with a longer expiration time (e.g., 7 days)
    const refreshToken = jwt.sign(
      { userId: userId },
      authConfig.refresh_secret, // Use the separate secret for signing the refresh token
      { expiresIn: authConfig.refresh_token_expires as any } // Use the expiration time for the refresh token (e.g., "30d")
    );

    // 5. Store the refresh token in the database (optional)
    await CachingService.saveUserRefreshToken(
      userId,
      refreshToken,
      authConfig.refresh_token_expires_in_ms
    );
    return { accessToken, refreshToken };
  };

  static getRefreshToken = (userId: string) => {
    return CachingService.getUserRefreshToken(userId);
  };

  static revokeRefreshToken = (userId: string) => {
    CachingService.deleteUserRefreshToken(userId);
  };

  static isUserLoginGoogle = (userId: string) => {
    return CachingService.hasGoogleAccessToken(userId);
  };

  static getAllUserCollections = (userId: string) => {
    return UserCollectionRepository.queryAllUserRecipeList(userId);
  };

  static getUserCollectionById = (collectionId: string) => {
    return UserCollectionRepository.queryUserRecipeListById(collectionId);
  };

  static createUserCollection = (userId: string, collectionName: string) => {
    return UserCollectionRepository.createUserRecipeList(
      userId,
      collectionName
    );
  };

  static updateUserCollection = (collectionId: string, updatedName: string) => {
    return UserCollectionRepository.updateUserRecipeListName(
      collectionId,
      updatedName
    );
  };

  static deleteUserCollection = (collectionId: string) => {
    return UserCollectionRepository.deleteUserRecipeList(collectionId);
  };

  static getUserCollectionRecipes = (collectionId: string) => {
    return UserCollectionRepository.queryAllRecipeByCollection(collectionId);
  };

  static addRecipeToUserCollection = (
    collectionId: string,
    recipeId: string
  ) => {
    return UserCollectionRepository.createUserRecipeListItem(
      collectionId,
      recipeId
    );
  };

  static updateRecipeToNewCollection = async (
    currentColId: string,
    newColId: string,
    recId: string
  ) => {
    await UserCollectionRepository.deleteUserRecipeListItem(
      currentColId,
      recId
    );
    return await UserCollectionRepository.createUserRecipeListItem(
      newColId,
      recId
    );
  };

  static removeRecipeFromCollection = (collectionId: string, recId: string) => {
    return UserCollectionRepository.deleteUserRecipeListItem(
      collectionId,
      recId
    );
  };
}

export default UserService;
