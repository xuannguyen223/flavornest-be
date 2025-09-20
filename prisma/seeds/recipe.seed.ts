import type {
  Category,
  PrismaClient,
  Recipe,
  User,
} from "../../src/generated/prisma/client";
import { fetchMealsByCategory } from "../utils/fetch-meals.util";
import { findCategoryByName } from "../utils/find-category-id.util";
import { getRandomIdx } from "../utils/get-random-idx.util";
import { parseCategories } from "../utils/parse-categories.util";
import { parseIngredients } from "../utils/parse-ingredients.util";
import { parseInstructions } from "../utils/parse-instructions.util";

export async function recipeSeed(
  prisma: PrismaClient,
  listCategories: Category[],
  users: User[]
): Promise<Recipe[]> {
  console.log("🍽️ Seeding recipes...");
  try {
    const meals = await fetchMealsByCategory();

    for (const meal of meals) {
      // make sure user has id
      const randomUser = users[getRandomIdx(users.length)];
      if (!randomUser?.id) continue;

      // estimate prep and cook time based on instructions length
      const instructionCount = parseInstructions(
        meal.strInstructions || ""
      ).length;

      await prisma.recipe.create({
        data: {
          title: meal.strMeal,
          description: `Delicious ${meal.strCategory?.toLowerCase()} from ${
            meal.strArea
          }`,
          prepTime: Math.min(Math.max(instructionCount * 5, 10), 60),
          cookTime: Math.min(Math.max(instructionCount * 10, 15), 120), // 20-80 minutes
          servings: getRandomIdx(6) + 2, // 2-8 servings
          authorId: randomUser.id, // Always a string
          cookTips: "Enjoy this traditional recipe!",
          imageUrl: meal.strMealThumb || null,
          ingredients: {
            create: parseIngredients(meal),
          },
          instructions: {
            create: parseInstructions(meal.strInstructions || ""),
          },
          categories: {
            create: parseCategories(
              listCategories,
              meal.strCategory || "",
              meal.strArea || ""
            ),
          },
        },
      });
    }
  } catch (error) {
    console.error("❌ Failed to seed recipes:", error);
  }

  console.log("Sample recipes seeded successfully!");
  return prisma.recipe.findMany();
}

async function defaultRecipeSeed(
  prisma: PrismaClient,
  listCategories: Category[],
  users: User[]
) {
  const pancake = await prisma.recipe.create({
    data: {
      title: "Pancakes",
      description: "Fluffy homemade pancakes",
      prepTime: 10,
      cookTime: 10,
      servings: 2,
      authorId: users.find((user) => user.email === "john@example.com")
        ?.id as string,
      cookTips: "Serve warm with maple syrup",
      imageUrl: "https://example.com/pancakes.jpg",
      ingredients: {
        create: [
          { name: "Flour", quantity: 200, unit: "grams" },
          { name: "Milk", quantity: 300, unit: "ml" },
          { name: "Eggs", quantity: 2, unit: "pcs" },
        ],
      },
      instructions: {
        create: [
          { step: 1, description: "Mix flour, milk, and eggs." },
          { step: 2, description: "Heat pan and pour batter." },
          { step: 3, description: "Cook until golden brown." },
        ],
      },
      categories: {
        create: [
          {
            categoryId: findCategoryByName("French", listCategories)
              ?.id as string,
          },
          {
            categoryId: findCategoryByName("Dessert", listCategories)
              ?.id as string,
          },
        ],
      },
    },
  });

  const pasta = await prisma.recipe.create({
    data: {
      title: "Pasta Carbonara",
      description: "Classic Italian pasta dish",
      prepTime: 10,
      cookTime: 20,
      servings: 2,
      authorId: users.find((user) => user.email === "jane@example.com")
        ?.id as string,
      cookTips: "Use freshly grated Pecorino Romano cheese",
      imageUrl: "https://example.com/carbonara.jpg",
      ingredients: {
        create: [
          { name: "Spaghetti", quantity: 200, unit: "grams" },
          { name: "Eggs", quantity: 2, unit: "pcs" },
          { name: "Bacon", quantity: 100, unit: "grams" },
        ],
      },
      instructions: {
        create: [
          { step: 1, description: "Boil spaghetti." },
          { step: 2, description: "Cook bacon in pan." },
          { step: 3, description: "Mix with eggs and cheese." },
        ],
      },
      categories: {
        create: [
          {
            categoryId: findCategoryByName("Italian", listCategories)
              ?.id as string,
          },
          {
            categoryId: findCategoryByName("Dinner", listCategories)
              ?.id as string,
          },
        ],
      },
    },
  });
}
