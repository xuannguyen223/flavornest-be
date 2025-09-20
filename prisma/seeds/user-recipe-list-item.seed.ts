import type {
  PrismaClient,
  Recipe,
  UserRecipeList,
} from "../../src/generated/prisma/client";
import { getRandomIdx } from "../utils/get-random-idx.util";

export async function userRecipeListItemSeed(
  prisma: PrismaClient,
  lists: UserRecipeList[],
  recipes: Recipe[]
) {
  console.log("📝 Seeding user recipe list items...");

  const createdItems = new Set<string>();
  const itemData = [];

  try {
    for (const list of lists) {
      const numItems = getRandomIdx(5) + 1; // 1-5 items per list
      for (let i = 0; i < numItems; i++) {
        const randomRecipe = recipes[getRandomIdx(recipes.length)];
        if (!randomRecipe?.id) continue;

        const combination = `${list.id}-${randomRecipe.id}`;
        if (createdItems.has(combination)) continue;

        createdItems.add(combination);
        itemData.push({
          listId: list.id,
          recipeId: randomRecipe.id,
        });
      }
    }

    if (itemData.length > 0) {
      await prisma.userRecipeListItem.createMany({
        data: itemData,
        skipDuplicates: true,
      });
    }
  } catch (error) {
    console.error("❌ Failed to seed user recipe list items:", error);
  }

  console.log("✅ User recipe list items seeded successfully!");
}
