import type {
  PrismaClient,
  Recipe,
  User,
} from "../../src/generated/prisma/client";
import { getRandomIdx } from "../utils/get-random-idx.util";

export async function favoriteRecipeSeed(
  prisma: PrismaClient,
  users: User[],
  recipes: Recipe[]
) {
  console.log("❤️ Seeding favorite recipes...");
  const createFavorites = new Set<string>();
  const favoriteData = [];
  try {
    for (const user of users) {
      const numFavorites = getRandomIdx(5) + 1; // 1-5 favorites per user
      for (let i = 0; i < numFavorites; i++) {
        const randomRecipe = recipes[getRandomIdx(recipes.length)];
        if (!randomRecipe?.id) continue;

        const combination = `${user.id}-${randomRecipe.id}`;
        if (createFavorites.has(combination)) continue;

        createFavorites.add(combination);
        favoriteData.push({
          userId: user.id,
          recipeId: randomRecipe.id,
        });
      }
    }

    if (favoriteData.length > 0) {
      await prisma.favoriteRecipe.createMany({
        data: favoriteData,
        skipDuplicates: true,
      });
    }
  } catch (error) {
    console.error("❌ Failed to seed favorite recipes:", error);
  }

  console.log("✅ Favorite recipes seeded successfully!");
}
