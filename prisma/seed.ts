// prisma/seed.ts

import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create users
  const john = await prisma.user.create({
    data: {
      email: "john@example.com",
      password: "hashedpassword123", // Normally use bcrypt
      profile: {
        create: {
          name: "John Doe",
          age: 28,
          gender: "MALE", // if using enum; otherwise just "male"
          bio: "Food enthusiast, loves pancakes and coding.",
          avatarUrl: "https://example.com/john.png",
        },
      },
    },
  });

  const jane = await prisma.user.create({
    data: {
      email: "jane@example.com",
      password: "hashedpassword456",
      profile: {
        create: {
          name: "Jane Smith",
          age: 25,
          gender: "FEMALE",
          bio: "Italian cuisine lover.",
          avatarUrl: "https://example.com/jane.png",
        },
      },
    },
  });

  // 2. Create categories
  const [breakfast, dinner] = await Promise.all([
    prisma.category.create({ data: { name: "Breakfast" } }),
    prisma.category.create({ data: { name: "Dinner" } }),
  ]);

  // 3. Create a recipe with ingredients, instructions, and categories
  const pancake = await prisma.recipe.create({
    data: {
      title: "Pancakes",
      description: "Fluffy homemade pancakes",
      tags: ["sweet", "easy"],
      totalTime: 20,
      servings: 2,
      authorId: john.id,
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
        create: [{ categoryId: breakfast.id }],
      },
    },
  });

  const pasta = await prisma.recipe.create({
    data: {
      title: "Pasta Carbonara",
      description: "Classic Italian pasta dish",
      tags: ["italian", "savory"],
      totalTime: 30,
      servings: 2,
      authorId: jane.id,
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
        create: [{ categoryId: dinner.id }],
      },
    },
  });

  // 4. Add favorite
  await prisma.favoriteRecipe.create({
    data: { userId: john.id, recipeId: pasta.id },
  });

  // 5. Create user recipe list
  await prisma.userRecipeList.create({
    data: {
      name: "John’s Favorite Recipes",
      userId: john.id,
      recipes: {
        create: [{ recipeId: pancake.id }, { recipeId: pasta.id }],
      },
    },
  });

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
