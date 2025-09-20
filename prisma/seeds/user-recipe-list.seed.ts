import type {
  PrismaClient,
  User,
  UserRecipeList,
} from "../../src/generated/prisma/client";
import { getRandomIdx } from "../utils/get-random-idx.util";

export async function userRecipeListSeed(
  prisma: PrismaClient,
  users: User[]
): Promise<UserRecipeList[]> {
  console.log("📋 Seeding user recipe lists...");

  try {
    for (let i = 0; i < 10; i++) {
      const randomUser = users[getRandomIdx(users.length)];
      if (!randomUser?.id) continue;
      await prisma.userRecipeList.create({
        data: {
          name: `My Favorite Recipes for the next ${i + 1} days`,
          userId: randomUser.id,
        },
      });
    }
  } catch (error) {
    console.error("❌ Failed to seed user recipe lists:", error);
  }

  console.log("✅ User recipe lists seeded successfully!");
  return prisma.userRecipeList.findMany();
}
