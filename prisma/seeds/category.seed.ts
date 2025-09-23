import type { Category, PrismaClient } from "../../src/generated/prisma/client";
import {
  COOKING_METHOD,
  CUISINE,
  DIETARY,
  MAIN_INGREDIENT,
  MEAL_TYPE,
} from "../data";

export async function categorySeed(prisma: PrismaClient): Promise<Category[]> {
  console.log(`Creating categories...`);
  try {
    await Promise.all([
      createCategoriesByType(prisma, "CUISINE", CUISINE),
      createCategoriesByType(prisma, "MEAL_TYPE", MEAL_TYPE),
      createCategoriesByType(prisma, "COOKING_METHOD", COOKING_METHOD),
      createCategoriesByType(prisma, "DIETARY", DIETARY),
      createCategoriesByType(prisma, "MAIN_INGREDIENT", MAIN_INGREDIENT),
    ]);
    console.log("✅ All categories seeded successfully!");
    return await prisma.category.findMany();
  } catch (error) {
    console.error("❌ Failed to seed categories:", error);
    throw error;
  }
}

async function createCategoriesByType(
  prisma: PrismaClient,
  type: string,
  categories: readonly { name: string; description: string }[]
) {
  try {
    await Promise.all(
      categories.map((category) =>
        prisma.category.create({
          data: {
            name: category.name,
            type: type as any,
            description: category.description,
          },
        })
      )
    );
  } catch (error) {
    console.error(`❌ Failed to create ${type} categories:`, error);
    throw error;
  }
  return await prisma.category.findMany();
}
