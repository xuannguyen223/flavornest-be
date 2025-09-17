import type { Request, Response } from "express";
import RecipeService from "../service/recipe.service.js";
import Send from "../utils/response.utils.js";
import {
  parseCreateRecipeData,
  parseUpdateRecipeData,
} from "../utils/recipe.utils.js";

class RecipeController {
  /**
   * Get recipe by ID
   */
  static getRecipeById = async (req: Request, res: Response) => {
    try {
      const recipeId = req.params.recipeId;
      const recipe = await RecipeService.getRecipeById(recipeId as string);

      if (!recipe) {
        return Send.notFound(res, {}, "Recipe not found");
      }

      return Send.success(res, { recipe });
    } catch (error) {
      console.error("Error fetching recipe:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  /**
   * Create a new recipe
   */
  static createRecipe = async (req: Request, res: Response) => {
    try {
      const createData = parseCreateRecipeData(req);

      const recipe = await RecipeService.createRecipe(createData);

      return Send.success(res, { recipe }, "Recipe created successfully");
    } catch (error) {
      console.error("Error creating recipe:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static getAllCategory = async (req: Request, res: Response) => {
    try {
      const type = req.query.type;
      const categoryList = await RecipeService.getAllCategory(type ? type as string : undefined);
      return Send.success(res, { categoryList }, "Get all categories");
    } catch (error) {
      console.error("Error getting all category:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static createCategory = async (req: Request, res: Response) => {
    try {
      const newCategory = req.body;
      const category = await RecipeService.createCategory(newCategory);

      return Send.success(res, { category }, "Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  /**
   * Update an existing recipe
   */
  static updateRecipe = async (req: Request, res: Response) => {
    try {
      const recipeId = req.params.recipeId as string;
      const updateData = parseUpdateRecipeData(req);

      const recipe = await RecipeService.getRecipeById(recipeId);
      if (!recipe) {
        return Send.notFound(res, {}, "Recipe not found!");
      }
      if (recipe.authorId !== req.cookierUserId) {
        return Send.unauthorized(res, null, "Unauthorized");
      }

      if ((req.body.rating as number) > 0) {
        const newRatingCount = recipe.ratingCount + 1;
        const newRating =
          (recipe.rating * recipe.ratingCount + req.body.rating) /
          newRatingCount;
        updateData.rating = Math.round(newRating * 10) / 10;
        updateData.ratingCount = newRatingCount;
      }

      const updatedRecipe = await RecipeService.updateRecipe(
        recipeId,
        updateData
      );

      if (!updatedRecipe) {
        return Send.notFound(res, {}, "Recipe not found");
      }

      return Send.success(
        res,
        { recipe: updatedRecipe },
        "Recipe updated successfully"
      );
    } catch (error) {
      console.error("Error updating recipe:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  /**
   * Delete a recipe
   */
  static deleteRecipe = async (req: Request, res: Response) => {
    try {
      const recipeId = req.params.recipeId as string;

      const deleted = await RecipeService.deleteRecipe(recipeId);

      if (!deleted) {
        return Send.notFound(res, {}, "Recipe not found");
      }

      return Send.success(res, {}, "Recipe deleted successfully");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static addRecipeIngredientList = async (req: Request, res: Response) => {
    try {
      const { recipeId, ingredients } = req.body;

      const createdIngredients = await RecipeService.addIngredientsToRecipe(
        recipeId,
        ingredients
      );

      return Send.success(
        res,
        createdIngredients,
        "Ingredients added successfully"
      );
    } catch (error) {
      console.error("Error adding recipe ingredients:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static addRecipeInstructions = async (req: Request, res: Response) => {
    try {
      const { recipeId, instructions } = req.body;

      const createdInstructions = await RecipeService.addInstructionsToRecipe(
        recipeId,
        instructions
      );

      return Send.success(
        res,
        createdInstructions,
        "Instructions added successfully"
      );
    } catch (error) {
      console.error("Error adding recipe instructions:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  /**
   * Get all recipes (optionally filter by author)
   */
  static getAllRecipes = async (req: Request, res: Response) => {
    try {
      const recipes = await RecipeService.getAllRecipes();

      return Send.success(res, { recipes });
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static getUserRecipes = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId as string;
      const recipes = await RecipeService.getUserRecipes(userId);
      return Send.success(res, { recipes });
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static getUserFavorites = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId as string;
      const favorites = await RecipeService.getUserFavorites(userId);
      return Send.success(res, { favorites });
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static addFavoriteRecipe = async (req: Request, res: Response) => {
    try {
      const { userId, recipeId } = req.body;
      const favorite = await RecipeService.addFavoriteRecipe(
        userId as string,
        recipeId as string
      );
      return Send.success(res, { favorite }, "Recipe added to favorites");
    } catch (error) {
      console.error("Error adding favorite recipe:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };

  static removeFavoriteRecipe = async (req: Request, res: Response) => {
    try {
      const { userId, recipeId } = req.params;
      await RecipeService.removeFavoriteRecipe(
        userId as string,
        recipeId as string
      );
      return Send.success(res, {}, "Recipe removed from favorites");
    } catch (error) {
      console.error("Error removing favorite recipe:", error);
      return Send.error(res, {}, "Internal server error");
    }
  };
}

export default RecipeController;
