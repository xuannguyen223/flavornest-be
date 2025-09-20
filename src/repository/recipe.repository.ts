import {
  CategoryType,
  PrismaClient,
  type RecipeRating,
} from "../generated/prisma/client.js";
import type {
  CategoryCreateInput,
  RecipeCreateInput,
  RecipeUpdateInput,
} from "../generated/prisma/models.js";

const prisma = new PrismaClient();

class RecipeRepository {
  static queryById = async (id: string) => {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                name: true,
              },
            },
          },
        },
        instructions: true,
        ingredients: true,
        categories: { include: { category: true } },
      },
    });

    if (!recipe) return null;

    const ratingStats = await prisma.recipeRating.aggregate({
      where: { recipeId: id },
      _avg: { value: true },
      _count: { value: true },
    });

    return {
      ...recipe,
      avgRating: ratingStats._avg.value ?? 0,
      ratingCount: ratingStats._count.value,
    };
  };

  static queryAll = async (options: {
    category?: string;
    search?: string;
    categoryType?: string;
  }) => {
    const { category, search, categoryType } = options;

    // 1. Get the recipes
    const recipes = await prisma.recipe.findMany({
      where: {
        AND: [
          search
            ? {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              }
            : {},
          category
            ? {
                categories: {
                  some: {
                    category: {
                      name: {
                        equals: category,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              }
            : {},
          categoryType
            ? {
                categories: {
                  some: {
                    category: {
                      type: categoryType as CategoryType,
                    },
                  },
                },
              }
            : {},
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
        instructions: true,
        ingredients: true,
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recipes.length === 0) return [];

    // 2. Get average ratings + counts for all recipe IDs in one query
    const ratingStats = await prisma.recipeRating.groupBy({
      by: ["recipeId"],
      where: {
        recipeId: { in: recipes.map((r) => r.id) },
      },
      _avg: { value: true },
      _count: { value: true },
    });

    // 3. Map stats back to recipes
    const statsMap = Object.fromEntries(
      ratingStats.map((stat) => [
        stat.recipeId,
        { avgRating: stat._avg.value ?? 0, ratingCount: stat._count.value },
      ])
    );

    return recipes.map((recipe) => ({
      ...recipe,
      avgRating: statsMap[recipe.id]?.avgRating ?? 0,
      ratingCount: statsMap[recipe.id]?.ratingCount ?? 0,
    }));
  };

  static queryAllCategory = async (type?: string) => {
    return await prisma.category.findMany({
      where: type ? { type: type as CategoryType } : {},
    });
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

  static updateOrInsertRatingByRecipeId = async (rr: RecipeRating) => {
    return await prisma.recipeRating.upsert({
      where: {
        userId_recipeId: {
          userId: rr.userId,
          recipeId: rr.recipeId,
        },
      },
      update: {
        value: rr.value,
        updatedAt: new Date(),
      },
      create: {
        userId: rr.userId,
        recipeId: rr.recipeId,
        value: rr.value,
      },
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
