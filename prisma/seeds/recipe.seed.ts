import type {
  Category,
  PrismaClient,
  Recipe,
  User,
} from "../../src/generated/prisma/client";
import { fetchMealsByCategory } from "../utils/fetch-meals.util";
import { getRandomIdx } from "../utils/get-random-idx.util";
import { parseCategories } from "../utils/parse-categories.util";
import { parseIngredients } from "../utils/parse-ingredients.util";
import { parseInstructions } from "../utils/parse-instructions.util";
import { uploadImageRecipe } from "../utils/uploadImage.util";

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

      const imgUrl = await uploadImageRecipe(meal);
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
          imageUrl: imgUrl,
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
