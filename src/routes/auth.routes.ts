import BaseRouter from "./router.js";
import type { RouteConfig } from "./router.js";
import ValidationMiddleware from "../middleware/validation.middleware.js";
import authSchema from "../validation/auth.schema.js";
import AuthController from "../controller/auth.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

class AuthRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        // login
        method: "post",
        path: "/login",
        middlewares: [
          ValidationMiddleware.validateBody(authSchema.login.shape.body),
        ],
        handler: AuthController.login,
      },
      {
        // register
        method: "post",
        path: "/register",
        middlewares: [
          ValidationMiddleware.validateBody(authSchema.register.shape.body),
        ],
        handler: AuthController.register,
      },
      {
        // logout
        method: "post",
        path: "/logout",
        middlewares: [
          // check if user is logged in
          AuthMiddleware.authenticateUser,
        ],
        handler: AuthController.logout,
      },
      {
        // refresh token
        method: "post",
        path: "/refresh-token",
        middlewares: [
          // checks if refresh token is valid
          AuthMiddleware.refreshTokenValidation,
        ],
        handler: AuthController.refreshToken,
      },
      {
        // google oauth authorize
        method: "get",
        path: "/google/oauth/authorize",
        middlewares: [],
        handler: AuthController.googleOAuthAuthorize,
      },
      {
        // google oauth callback
        method: "get",
        path: "/google/oauth/redirect-uri",
        middlewares: [],
        handler: AuthController.googleOAuthCallback,
      },
      {
        // google oath revoke
        method: "get",
        path: "/google/oauth/revoke",
        middlewares: [AuthMiddleware.authenticateUser],
        handler: AuthController.googleOAuthRevoke,
      },
    ];
  }
}

export default new AuthRouter().router;
