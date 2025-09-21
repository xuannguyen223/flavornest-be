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
        path: "/profile/get", // api/user/profile/get
        middlewares: [AuthMiddleware.authenticateUser],
        handler: UserController.getUserProfileById,
      },
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
      {
        method: "get",
        path: "/collection", // api/user/collection
        middlewares: [AuthMiddleware.authenticateUser],
        handler: UserController.getAllUserCollections,
      },
      {
        method: "get",
        path: "/collection/:collectionId", // api/user/collection/"collectionId"
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateParams(
            userSchema.getUserCollectionById.shape.params
          ),
        ],
        handler: UserController.getUserCollectionById,
      },
      {
        method: "post",
        path: "/collection/create", // api/user/collection/create
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(
            userSchema.createUserCollection.shape.body
          ),
        ],
        handler: UserController.createUserCollection,
      },
      {
        method: "put",
        path: "/collection/:collectionId", // api/user/collection/:collectionId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validate({
            params: userSchema.updateUserCollection.shape.params,
            body: userSchema.updateUserCollection.shape.body,
          }),
        ],
        handler: UserController.updateUserCollection,
      },
      {
        method: "delete",
        path: "/collection/:collectionId", // api/user/collection/:collectionId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateParams(
            userSchema.deleteUserCollection.shape.params
          ),
        ],
        handler: UserController.deleteUserCollection,
      },
      {
        method: "get",
        path: "/collection/recipe/get/:collectionId", // api/user/collection/get
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateParams(
            userSchema.getAllCollectionRecipes.shape.params
          ),
        ],
        handler: UserController.getRecipesFromCollection,
      },
      {
        method: "post",
        path: "/collection/recipe/add", // api/user/collection/add
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(
            userSchema.addRecipeToCollection.shape.body
          ),
        ],
        handler: UserController.addRecipeUserCollection,
      },
      {
        method: "put",
        path: "/collection/recipe/update", // api/user/collection/update
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(
            userSchema.updateRecipeUserCollection.shape.body
          ),
        ],
        handler: UserController.updateRecipeUserCollection,
      },
      {
        method: "delete",
        path: "/collection/recipe/delete/:collectionId/:recipeId", // api/user/collection/delete/:collectionId/:recipeId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateParams(
            userSchema.deleteRecipeUserCollection.shape.params
          ),
        ],
        handler: UserController.deleteRecipeUserCollection,
      },
    ];
  }
}

export default new UserRoutes().router;
