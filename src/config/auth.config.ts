const authConfig = {
  // Secret key used for signing JWT access tokens
  secret: process.env.AUTH_SECRET as string,

  // Expiration time for the JWT access token (e.g., "15m" for 15 minutes)
  access_token_expires: process.env.AUTH_SECRET_EXPIRES_IN as string,

  access_token_expires_in_ms: parseInt(process.env.AUTH_SECRET_EXPIRES_IN_MS || "300000") as number,

  // Secret key used for signing JWT refresh tokens
  refresh_secret: process.env.AUTH_REFRESH_SECRET as string,

  // Expiration time for the JWT refresh token (e.g., "24h" for 24 hours)
  refresh_token_expires: process.env.AUTH_REFRESH_SECRET_EXPIRES_IN as string,

  refresh_token_expires_in_ms: parseInt(process.env.AUTH_REFRESH_SECRET_EXPIRES_IN_MS || "86400000") as number,
};

export default authConfig;
