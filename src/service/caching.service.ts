import redisClient from "../config/redisClient.config.js";
import {
  GOOGLE_ACCESS_TOKEN_EXPIRES_IN_MS,
  GOOGLE_AUTHORIZATION_STATE,
  GOOGLE_REFRESH_TOKEN_EXPIRES_IN_MS,
  REDIS_USER_GOOGLE_ACCESS_TOKEN_PREFIX,
  REDIS_USER_GOOGLE_REFRESH_TOKEN_PREFIX,
  REDIS_USER_REFRESH_TOKEN_PREFIX,
} from "../utils/constants.utils.js";

class CachingService {
  static async saveUserRefreshToken(
    userId: string,
    refreshToken: string,
    expiresIn: number
  ) {
    // Save the refresh token in your caching layer (e.g., Redis) with an expiration time
    await redisClient.set(
      `${REDIS_USER_REFRESH_TOKEN_PREFIX}:${userId}`,
      refreshToken,
      { expiration: { type: "PX", value: expiresIn } }
    );
  }

  static async getUserRefreshToken(userId: string) {
    // Retrieve the refresh token from your caching layer
    return await redisClient.get(
      `${REDIS_USER_REFRESH_TOKEN_PREFIX}:${userId}`
    );
  }

  static async deleteUserRefreshToken(userId: string) {
    // Delete the refresh token from your caching layer
    await redisClient.del(`${REDIS_USER_REFRESH_TOKEN_PREFIX}:${userId}`);
  }

  static async hasGoogleAccessToken(userId: string) {
    return await redisClient.exists(
      `${REDIS_USER_GOOGLE_ACCESS_TOKEN_PREFIX}:${userId}`
    );
  }

  static async saveUserGoogleAuthToken(
    userId: string,
    refreshToken: string,
    accessToken: string
  ) {
    // Save the Google refresh token in your caching layer (e.g., Redis) without expiration time
    await redisClient.set(
      `${REDIS_USER_GOOGLE_REFRESH_TOKEN_PREFIX}:${userId}`,
      refreshToken,
      { expiration: { type: "PX", value: GOOGLE_REFRESH_TOKEN_EXPIRES_IN_MS } }
    );
    await redisClient.set(
      `${REDIS_USER_GOOGLE_ACCESS_TOKEN_PREFIX}:${userId}`,
      accessToken,
      { expiration: { type: "PX", value: GOOGLE_ACCESS_TOKEN_EXPIRES_IN_MS } }
    );
  }

  static async getUserGoogleAuthToken(userId: string) {
    // Retrieve the Google auth tokens from your caching layer
    const refreshToken = await redisClient.get(
      `${REDIS_USER_GOOGLE_REFRESH_TOKEN_PREFIX}:${userId}`
    );
    const accessToken = await redisClient.get(
      `${REDIS_USER_GOOGLE_ACCESS_TOKEN_PREFIX}:${userId}`
    );
    return { refreshToken, accessToken };
  }

  static async deleteUserGoogleAuthToken(userId: string) {
    // Delete the Google auth tokens from your caching layer
    await redisClient.del(
      `${REDIS_USER_GOOGLE_REFRESH_TOKEN_PREFIX}:${userId}`
    );
    await redisClient.del(`${REDIS_USER_GOOGLE_ACCESS_TOKEN_PREFIX}:${userId}`);
  }

  static async saveGoogleOauthState(state: string) {
    await redisClient.set(`${GOOGLE_AUTHORIZATION_STATE}:${state}`, 1, {
      expiration: { type: "PX", value: 600000 },
    }); // expires in 10m
  }

  static async googleOauthStateExists(state: string) {
    const exist = await redisClient.exists(
      `${GOOGLE_AUTHORIZATION_STATE}:${state}`
    );
    if (exist === 1) {
      await redisClient.del(`${GOOGLE_AUTHORIZATION_STATE}:${state}`);
      return true;
    }
    return false;
  }
}
export default CachingService;
