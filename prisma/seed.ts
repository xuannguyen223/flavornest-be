// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma/client.js";
import { categorySeed } from "./seeds/category.seed.js";
import { userSeed } from "./seeds/user.seed.js";
import { recipeSeed } from "./seeds/recipe.seed.js";
import { recipeRatingSeed } from "./seeds/rating.seed.js";
import { favoriteRecipeSeed } from "./seeds/favorite.seed.js";
import { userRecipeListSeed } from "./seeds/user-recipe-list.seed.js";
import { userRecipeListItemSeed } from "./seeds/user-recipe-list-item.seed.js";
import { userCategoryPreferenceSeed } from "./seeds/user-category-preference.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing old data...");
  // Order matters because of foreign keys
  await prisma.recipeRating.deleteMany();
  await prisma.favoriteRecipe.deleteMany();
  await prisma.userRecipeList.deleteMany();
  await prisma.userRecipeListItem.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipeInstruction.deleteMany();
  await prisma.recipeCategory.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  console.log("✅ Old data removed!");

  const categories = await categorySeed(prisma);
  const users = await userSeed(prisma);
  const recipes = await recipeSeed(prisma, categories, users);
  await recipeRatingSeed(prisma, users, recipes);
  await favoriteRecipeSeed(prisma, users, recipes);
  const lists = await userRecipeListSeed(prisma, users);
  await userRecipeListItemSeed(prisma, lists, recipes);
  await userCategoryPreferenceSeed(prisma, users, categories);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
