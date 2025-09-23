import type {
  Category,
  PrismaClient,
  User,
} from "../../src/generated/prisma/client";
import { getRandomIdx } from "../utils/get-random-idx.util";

export async function userCategoryPreferenceSeed(
  prisma: PrismaClient,
  users: User[],
  categories: Category[]
) {
  console.log("⭐ Seeding user category preferences...");
  const createdPreferences = new Set<string>();
  const preferenceData = [];

  try {
    for (const user of users) {
      const numPreferences = getRandomIdx(3) + 1; // 1-3 preferences per user
      for (let i = 0; i < numPreferences; i++) {
        const randomCategory = categories[getRandomIdx(categories.length)];
        if (!randomCategory?.id) continue;

        const combination = `${user.id}-${randomCategory.id}`;
        if (createdPreferences.has(combination)) continue;

        createdPreferences.add(combination);
        preferenceData.push({
          userId: user.id,
          categoryId: randomCategory.id,
        });
      }
    }
    if (preferenceData.length > 0) {
      await prisma.userCategoryPreference.createMany({
        data: preferenceData,
        skipDuplicates: true,
      });
    }
  } catch (error) {
    console.error("❌ Failed to seed user category preferences:", error);
  }

  console.log("✅ User category preferences seeded successfully!");
}
