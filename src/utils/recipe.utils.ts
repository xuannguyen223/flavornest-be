import type { Request } from "express";
import type {
  RecipeCreateInput,
  RecipeUpdateInput,
} from "../generated/prisma/models";

export const parseCreateRecipeData = (req: Request): RecipeCreateInput => {
  const {
    title,
    description,
    cookTips,
    prepTime,
    cookTime,
    servings,
    imageUrl,
    ingredients,
    instructions,
    categories,
  } = req.body;
  return {
    title: title,
    description: description,
    cookTips: cookTips,
    prepTime: prepTime,
    cookTime: cookTime,
    servings: servings,
    imageUrl: imageUrl,
    author: { connect: { id: req.cookierUserId as string } },
    /**
     * ingredients: [
          { name: "Flour", quantity: 200, unit: "grams" },
          { name: "Milk", quantity: 300, unit: "ml" },
          { name: "Eggs", quantity: 2, unit: "pcs" }
       ]
     */
    ingredients: {
      create: ingredients,
    },
    /**
     * instructions: [
          { step: 1, description: "Mix flour, milk, and eggs." },
          { step: 2, description: "Heat pan and pour batter." },
          { step: 3, description: "Cook until golden brown." }
       ]
     */
    instructions: {
      create: instructions,
    },
    /**
     * categories: [{ categoryId: "cate1" },{ categoryId: "cate2" }]
     */
    categories: {
      create: categories,
    },
  };
};

export const parseUpdateRecipeData = (req: Request): RecipeUpdateInput => {
  const {
    title,
    description,
    cookTips,
    prepTime,
    cookTime,
    servings,
    imageUrl,
    ingredients,
    instructions,
    categories,
  } = req.body;

  const data: RecipeUpdateInput = {
    title,
    description,
    cookTips,
    prepTime,
    cookTime,
    servings,
    imageUrl,
    author: { connect: { id: req.cookierUserId as string } },
  };

  if (ingredients) {
    data.ingredients = {
      deleteMany: {},
      create: ingredients.map((i: any) => ({
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
      })),
    };
  }

  if (instructions) {
    data.instructions = {
      deleteMany: {},
      create: instructions.map((ins: any) => ({
        step: ins.step,
        description: ins.description,
      })),
    };
  }

  if (categories) {
    data.categories = {
      deleteMany: {},
      create: categories.map((c: any) => ({
        categoryId: c.categoryId,
      })),
    };
  }

  return data;
};
