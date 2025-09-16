import { PrismaClient } from "../generated/prisma/client.js";
import type {
  CategoryCreateInput,
  RecipeCreateInput,
  RecipeUpdateInput,
} from "../generated/prisma/models.js";

const prisma = new PrismaClient();

class RecipeRepository {
  static queryById = async (id: string) => {
    return await prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
        instructions: true,
        ingredients: true,
        categories: { include: { category: true } },
      },
    });
  };

  static queryAll = async () => {
    return await prisma.recipe.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
        instructions: true,
        ingredients: true,
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  };

  static queryAllCategory = async () => {
    return await prisma.category.findMany();
  };

  static createNewCategory = async (categoryData: CategoryCreateInput) => {
    return await prisma.category.create({
      data: categoryData,
    });
  };

  static createNewRecipe = async (recipeData: RecipeCreateInput) => {
    return await prisma.recipe.create({
      data: recipeData,
    });
  };

  static createRecipeCategoryRelation = async (
    recipeId: string,
    categoryId: string
  ) => {
    return await prisma.recipeCategory.create({
      data: { recipeId, categoryId },
    });
  };

  static updateById = async (
    id: string,
    updates: Partial<RecipeUpdateInput>
  ) => {
    return await prisma.recipe.update({
      where: { id },
      data: updates,
    });
  };

  static deleteById = async (id: string) => {
    return await prisma.recipe.delete({
      where: { id },
    });
  };

  static addIngredients = async (
    recipeId: string,
    ingredients: { name: string; quantity: number; unit: string }[]
  ) => {
    return await prisma.recipeIngredient.createMany({
      data: ingredients.map((ing) => ({
        recipeId,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
    });
  };

  static addInstructrions = async (
    recipeId: string,
    instructions: { step: number; description: string; imageUrl: string }[]
  ) => {
    return await prisma.recipeInstruction.createMany({
      data: instructions.map((ins) => ({
        recipeId,
        step: ins.step,
        description: ins.description,
        imageUrl: ins.imageUrl,
      })),
    });
  };

  static queryUserRecipes = async (userId: string) => {
    return await prisma.recipe.findMany({
      where: { authorId: userId },
      include: { ingredients: true, instructions: true, categories: true },
    });
  };

  static queryUserFavorites = async (userId: string) => {
    return await prisma.favoriteRecipe.findMany({
      where: { userId },
      include: { recipe: true },
    });
  };

  static insertFavoriteRecipe = async (userId: string, recipeId: string) => {
    return await prisma.favoriteRecipe.create({
      data: { userId, recipeId },
    });
  };

  static deleteFavoriteRecipe = async (userId: string, recipeId: string) => {
    return await prisma.favoriteRecipe.delete({
      where: { userId_recipeId: { userId, recipeId } },
    });
  };
}

export default RecipeRepository;
