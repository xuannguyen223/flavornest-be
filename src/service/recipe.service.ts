import type { RecipeRating } from "../generated/prisma/client.js";
import type {
  CategoryCreateInput,
  RecipeCreateInput,
  RecipeUpdateInput,
} from "../generated/prisma/models.js";
import RecipeRepository from "../repository/recipe.repository.js";

class RecipeService {
  static getRecipeById(id: string) {
    return RecipeRepository.queryById(id);
  }

  static getAllRecipes = (options: {
    category?: string;
    search?: string;
    categoryType?: string;
  }) => {
    return RecipeRepository.queryAll(options);
  };

  static getAllCategory = (type?: string) => {
    return RecipeRepository.queryAllCategory(type);
  };

  static createCategory = (category: CategoryCreateInput) => {
    return RecipeRepository.createNewCategory(category);
  };

  static addRecipeCategory = (recipeId: string, categoryId: string) => {
    return RecipeRepository.createRecipeCategoryRelation(recipeId, categoryId);
  };

  static createRecipe = (recipe: RecipeCreateInput) => {
    return RecipeRepository.createNewRecipe(recipe);
  };

  static updateRecipeRating = async (recipeRating: RecipeRating) => {
    return await RecipeRepository.updateOrInsertRatingByRecipeId(recipeRating);
  };

  static updateRecipe = (
    recipeId: string,
    updates: Partial<RecipeUpdateInput>
  ) => {
    return RecipeRepository.updateById(recipeId, updates);
  };

  static deleteRecipe = (recipeId: string) => {
    return RecipeRepository.deleteById(recipeId);
  };

  static addIngredientsToRecipe = (
    recipeId: string,
    ingredients: { name: string; quantity: number; unit: string }[]
  ) => {
    return RecipeRepository.addIngredients(recipeId, ingredients);
  };

  static addInstructionsToRecipe = (
    recipeId: string,
    instructions: { step: number; description: string; imageUrl: string }[]
  ) => {
    return RecipeRepository.addInstructrions(recipeId, instructions);
  };

  static getUserRecipes = (userId: string) => {
    return RecipeRepository.queryUserRecipes(userId);
  };

  static getUserFavorites = (userId: string) => {
    return RecipeRepository.queryUserFavorites(userId);
  };

  static addFavoriteRecipe = (userId: string, recipeId: string) => {
    return RecipeRepository.insertFavoriteRecipe(userId, recipeId);
  };

  static removeFavoriteRecipe = (userId: string, recipeId: string) => {
    return RecipeRepository.deleteFavoriteRecipe(userId, recipeId);
  };
}

export default RecipeService;
