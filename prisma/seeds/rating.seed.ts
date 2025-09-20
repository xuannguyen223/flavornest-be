import type {
  PrismaClient,
  Recipe,
  User,
} from "../../src/generated/prisma/client";
import { getRandomIdx } from "../utils/get-random-idx.util";

export async function recipeRatingSeed(
  prisma: PrismaClient,
  users: User[],
  recipes: Recipe[]
) {
  console.log("⭐ Seeding recipe ratings...");

  try {
    const ratingsToCreate = new Set<string>(); // Track combinations to avoid duplicates
    const ratingData = [];

    // Generate unique user-recipe combinations
    for (let i = 0; i < 100; i++) {
      const randomUser = users[getRandomIdx(users.length)];
      const randomRecipe = recipes[getRandomIdx(recipes.length)];
      if (!randomUser?.id || !randomRecipe?.id) continue;

      const combination = `${randomUser.id}-${randomRecipe.id}`;
      if (ratingsToCreate.has(combination)) continue;

      ratingsToCreate.add(combination);
      ratingData.push({
        userId: randomUser.id,
        recipeId: randomRecipe.id,
        value: getRandomIdx(5) + 1, // 1-5 stars
      });
    }

    if (ratingData.length > 0) {
      await prisma.recipeRating.createMany({
        data: ratingData,
        skipDuplicates: true, // Skip any duplicates just in case
      });
    }
  } catch (error) {
    console.error("❌ Failed to seed recipe ratings:", error);
    throw error;
  }

  console.log("✅ Recipe ratings seeded successfully!");
}
