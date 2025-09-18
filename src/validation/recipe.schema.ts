// src/schema/recipe.schema.ts
import { z } from "zod";

/**
 * Shared reusable fields
 */
const recipeIdSchema = z.string().trim().min(1, "Recipe ID is required");
const titleSchema = z.string().min(1, "Title is required");
const descriptionSchema = z.string().optional();
const timeSchema = z.number().int().positive().optional();
const servingsSchema = z.number().int().positive().optional();
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
  imageUrl: z.string().optional(),
});

// GET /recipe/:recipeId
const getById = z.object({
  params: z.object({
    recipeId: recipeIdSchema,
  }),
});

const getAllRecipes = z.object({
  query: z.object({
    search: z.string().trim().min(1).optional(),
    filter: z.string().trim().min(1).optional()
  }).optional()
})

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
    cookTips: z.string().optional(),
    prepTime: timeSchema,
    cookTime: timeSchema,
    servings: servingsSchema,
    imageUrl: z.string().optional(),
    ingredients: z
      .array(
        z.object({
          name: z.string().min(1, "Ingredient name is required"),
          quantity: z.number().positive("Quantity must be positive"),
          unit: z.string().min(1, "Unit is required"),
        })
      )
      .optional(),

    instructions: z
      .array(
        z.object({
          step: z.number().int().positive("Step must be a positive integer"),
          description: z.string().min(1, "Instruction description is required"),
        })
      )
      .optional(),

    categories: z
      .array(
        z.object({
          categoryId: z.string().cuid("Invalid category ID format"),
        })
      )
      .optional(),
  }),
});

// PUT /api/recipe/rating/:recipeId
const updateRecipeRating = z.object({
  params: z.object({
    recipeId: recipeIdSchema,
  }),
  body: z.object({
    rating: z.number().positive().min(1).max(5),
  })
});

// PUT /api/recipe/update/:recipeId
const updateRecipe = z.object({
  params: z.object({
    recipeId: recipeIdSchema,
  }),
  body: z
    .object({
      title: titleSchema,
      description: descriptionSchema,
      cookTips: z.string().optional(),
      prepTime: timeSchema,
      cookTime: timeSchema,
      servings: servingsSchema,
      imageUrl: z.string().optional(),
      ingredients: z
        .array(
          z.object({
            name: z.string().min(1, "Ingredient name is required"),
            quantity: z.number().positive("Quantity must be positive"),
            unit: z.string().min(1, "Unit is required"),
          })
        )
        .optional(),

      instructions: z
        .array(
          z.object({
            step: z.number().int().positive("Step must be a positive integer"),
            description: z
              .string()
              .min(1, "Instruction description is required"),
          })
        )
        .optional(),

      categories: z
        .array(
          z.object({
            categoryId: z.string().cuid("Invalid category ID format"),
          })
        )
        .optional(),
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
  getAllRecipes,
  createRecipe,
  createCategory,
  updateRecipe,
  updateRecipeRating,
  deleteRecipe,
  addRecipeIngredientList,
  addRecipeInstructions,
  getUserRecipes,
  getUserFavorites,
  addFavorite,
  removeFavorite,
};

export default recipeSchema;
