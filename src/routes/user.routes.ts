import UserController from "../controller/user.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import ValidationMiddleware from "../middleware/validation.middleware.js";
import userSchema from "../validation/user.schema.js";
import BaseRouter, { type RouteConfig } from "./router.js";

class UserRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        // get user info
        method: "get",
        path: "/get/:userId", // api/user/get/:userId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateParams(userSchema.getById.shape.params),
        ],
        handler: UserController.getUserById,
      },
      {
        // get user profile
        method: "get",
        path: "/profile/:userId", // api/user/get-userprofile/:userId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateParams(userSchema.getById.shape.params),
        ],
        handler: UserController.getUserProfileById,
      },
      {
        method: "put",
        path: "/profile/:userId", // api/user/profile/:userId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateParams(userSchema.getById.shape.params),
        ],
        handler: UserController.updateUserProfile,
      },
      {
        method: "post",
        path: "/preference/:userId", // api/user/preference/:userId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validate({
            params: userSchema.updateUserPreference.shape.params,
            body: userSchema.updateUserPreference.shape.body,
          }),
        ],
        handler: UserController.updateUserPreferences,
      },
    ];
  }
}

export default new UserRoutes().router;
