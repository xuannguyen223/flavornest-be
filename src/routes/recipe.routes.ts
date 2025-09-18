import RecipeController from "../controller/recipe.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import ValidationMiddleware from "../middleware/validation.middleware.js";
import recipeSchema from "../validation/recipe.schema.js";
import BaseRouter, { type RouteConfig } from "./router.js";

class RecipeRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        // get recipe by id
        method: "get",
        path: "/get/:recipeId", // api/recipe/get/:recipeId
        middlewares: [
          ValidationMiddleware.validateParams(
            recipeSchema.getById.shape.params
          ),
        ],
        handler: RecipeController.getRecipeById,
      },
      {
        // get all recipes (optionally filter by authorId via query param)
        method: "get",
        path: "/get", // api/recipe/get
        middlewares: [ValidationMiddleware.validateQuery(recipeSchema.getAllRecipes)],
        handler: RecipeController.getAllRecipes,
      },
      {
        // get all category
        method: "get",
        path: "/category/get", // api/recipe/category/get?type=
        middlewares: [],
        handler: RecipeController.getAllCategory,
      },
      // {
      //   // create a new category
      //   method: "post",
      //   path: "/category/create", // api/recipe/category/create
      //   middlewares: [
      //     AuthMiddleware.authenticateUser,
      //     ValidationMiddleware.validateBody(
      //       recipeSchema.createCategory.shape.body
      //     ),
      //   ],
      //   handler: RecipeController.createCategory,
      // },
      {
        // create a new recipe
        method: "post",
        path: "/create", // api/recipe/create
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(
            recipeSchema.createRecipe.shape.body
          ),
        ],
        handler: RecipeController.createRecipe,
      },
      {
        // update recipe rating
        method: "put",
        path: "/rating/:recipeId", // api/recipe/update/:recipeId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validate({
            params: recipeSchema.updateRecipeRating.shape.params,
            body: recipeSchema.updateRecipeRating.shape.body,
          }),
        ],
        handler: RecipeController.updateRecipeRating,
      },
      {
        // update recipe
        method: "put",
        path: "/update/:recipeId", // api/recipe/update/:recipeId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validate({
            params: recipeSchema.updateRecipe.shape.params,
            body: recipeSchema.updateRecipe.shape.body,
          }),
        ],
        handler: RecipeController.updateRecipe,
      },
      {
        // rate recipe
        method: "put",
        path: "/rating/:recipeId", // api/recipe/update/:recipeId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validate({
            params: recipeSchema.updateRecipe.shape.params,
            body: recipeSchema.updateRecipe.shape.body,
          }),
        ],
        handler: RecipeController.updateRecipe,
      },
      {
        // delete recipe
        method: "delete",
        path: "/delete/:recipeId", // api/recipe/delete/:recipeId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateParams(
            recipeSchema.deleteRecipe.shape.params
          ),
        ],
        handler: RecipeController.deleteRecipe,
      },
      {
        // create a new recipe ingredients
        method: "post",
        path: "/ingredient/create",
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(
            recipeSchema.addRecipeIngredientList.shape.body
          ),
        ],
        handler: RecipeController.addRecipeIngredientList,
      },
      {
        // create a new recipe instructions
        method: "post",
        path: "/instruction/create",
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(
            recipeSchema.addRecipeInstructions.shape.body
          ),
        ],
        handler: RecipeController.addRecipeInstructions,
      },
      {
        method: "get",
        path: "/:userId/recipes", // api/recipe/:userId/recipes
        middlewares: [
          ValidationMiddleware.validateParams(
            recipeSchema.getUserRecipes.shape.params
          ),
        ],
        handler: RecipeController.getUserRecipes,
      },
      {
        method: "get",
        path: "/:userId/favorites", // api/recipe/:userId/favorites
        middlewares: [
          ValidationMiddleware.validateParams(
            recipeSchema.getUserFavorites.shape.params
          ),
        ],
        handler: RecipeController.getUserFavorites,
      },
      {
        method: "post",
        path: "/favorites", // api/recipe/favorites
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateBody(
            recipeSchema.addFavorite.shape.body
          ),
        ],
        handler: RecipeController.addFavoriteRecipe,
      },
      {
        method: "delete",
        path: "/favorites/:userId/:recipeId", // api/recipe/:userId/favorites/:recipeId
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateParams(
            recipeSchema.removeFavorite.shape.params
          ),
        ],
        handler: RecipeController.removeFavoriteRecipe,
      },
    ];
  }
}

export default new RecipeRoutes().router;
