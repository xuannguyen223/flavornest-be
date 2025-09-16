// src/schema/recipe.schema.ts
import { z } from "zod";

/**
 * Shared reusable fields
 */
const recipeIdSchema = z.string().trim().min(1, "Recipe ID is required");
const titleSchema = z.string().min(1, "Title is required");
const descriptionSchema = z.string().optional();
const tagsSchema = z.array(z.string()).optional();
const totalTimeSchema = z.number().int().positive().optional();
const servingsSchema = z.number().int().positive().optional();
const authorIdSchema = z.string().trim().min(1, "Author ID is required");
const userIdSchema = z.string().trim().min(1, "User ID is required");
const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "Category name is required");

const ingredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
});

const instructionSchema = z.object({
  step: z.number().positive(),
  description: z.string().min(1),
  imageUrl: z.string(),
});

// GET /recipe/:recipeId
const getById = z.object({
  params: z.object({
    recipeId: recipeIdSchema,
  }),
});

// POST /recipe/category
const createCategory = z.object({
  body: z.object({
    name: categoryNameSchema,
  }),
});

// POST /recipe
const createRecipe = z.object({
  body: z.object({
    title: titleSchema,
    description: descriptionSchema,
    tags: tagsSchema,
    totalTime: totalTimeSchema,
    servings: servingsSchema,
    authorId: authorIdSchema,
  }),
});

// PUT /recipe/:recipeId
const updateRecipe = z.object({
  params: z.object({
    recipeId: recipeIdSchema,
  }),
  body: z
    .object({
      title: titleSchema.optional(),
      description: descriptionSchema,
      tags: tagsSchema,
      totalTime: totalTimeSchema,
      servings: servingsSchema,
    })
    .strict(),
});

// DELETE /recipe/:recipeId
const deleteRecipe = z.object({
  params: z.object({
    recipeId: recipeIdSchema,
  }),
});

const addRecipeIngredientList = z.object({
  body: z.object({
    recipeId: recipeIdSchema,
    ingredients: z.array(ingredientSchema).min(1),
  }),
});

const addRecipeInstructions = z.object({
  body: z.object({
    recipeId: recipeIdSchema,
    instructions: z.array(instructionSchema).min(1),
  }),
});

// GET /recipe/:userId/recipes
const getUserRecipes = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
});

// GET /recipe/:userId/favorites
const getUserFavorites = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
});

// POST /recipe/:userId/favorites/:recipeId
const addFavorite = z.object({
  body: z.object({
    userId: userIdSchema,
    recipeId: recipeIdSchema,
  }),
});

// DELETE /recipe/:userId/favorites/:recipeId
const removeFavorite = z.object({
  params: z.object({
    userId: userIdSchema,
    recipeId: recipeIdSchema,
  }),
});

export const recipeSchema = {
  getById,
  createRecipe,
  createCategory,
  updateRecipe,
  deleteRecipe,
  addRecipeIngredientList,
  addRecipeInstructions,
  getUserRecipes,
  getUserFavorites,
  addFavorite,
  removeFavorite,
};

export default recipeSchema;
