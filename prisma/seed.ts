// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Clearing old data...");

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

  console.log("🌱 Seeding new data...");

  // Cuisine
  await Promise.all([
    prisma.category.create({
      data: {
        name: "Italian",
        type: "CUISINE",
        description: "Delicious food from Italy",
      },
    }),
    prisma.category.create({
      data: {
        name: "Mexican",
        type: "CUISINE",
        description: "Traditional food from Mexico",
      },
    }),
    prisma.category.create({
      data: {
        name: "Chinese",
        type: "CUISINE",
        description: "Dishes from Chinese cuisine",
      },
    }),
    prisma.category.create({
      data: {
        name: "Indian",
        type: "CUISINE",
        description: "Spicy and flavorful Indian cuisine",
      },
    }),
    prisma.category.create({
      data: {
        name: "Thai",
        type: "CUISINE",
        description: "Authentic food from Thailand",
      },
    }),
    prisma.category.create({
      data: {
        name: "Vietnamese",
        type: "CUISINE",
        description: "Fresh and balanced Vietnamese dishes",
      },
    }),
    prisma.category.create({
      data: {
        name: "Japanese",
        type: "CUISINE",
        description: "Traditional Japanese cuisine",
      },
    }),
    prisma.category.create({
      data: {
        name: "Korean",
        type: "CUISINE",
        description: "Korean cuisine full of flavors",
      },
    }),
    prisma.category.create({
      data: {
        name: "French",
        type: "CUISINE",
        description: "Classic French gastronomy",
      },
    }),
    prisma.category.create({
      data: {
        name: "American",
        type: "CUISINE",
        description: "American comfort food",
      },
    }),
    prisma.category.create({
      data: {
        name: "Mediterranean",
        type: "CUISINE",
        description: "Healthy Mediterranean dishes",
      },
    }),
    prisma.category.create({
      data: {
        name: "Greek",
        type: "CUISINE",
        description: "Traditional Greek food",
      },
    }),
    prisma.category.create({
      data: {
        name: "Spanish",
        type: "CUISINE",
        description: "Classic Spanish recipes",
      },
    }),
    prisma.category.create({
      data: {
        name: "German",
        type: "CUISINE",
        description: "Traditional German meals",
      },
    }),
  ]);

  // Meal Type
  await Promise.all([
    prisma.category.create({
      data: {
        name: "Breakfast",
        type: "MEAL_TYPE",
        description: "Morning meals to start the day right",
      },
    }),
    prisma.category.create({
      data: {
        name: "Brunch",
        type: "MEAL_TYPE",
        description: "Late morning combined meals",
      },
    }),
    prisma.category.create({
      data: {
        name: "Lunch",
        type: "MEAL_TYPE",
        description: "Afternoon meals",
      },
    }),
    prisma.category.create({
      data: {
        name: "Dinner",
        type: "MEAL_TYPE",
        description: "Evening meals to end the day",
      },
    }),
    prisma.category.create({
      data: {
        name: "Dessert",
        type: "MEAL_TYPE",
        description: "Sweet treats after meals",
      },
    }),
    prisma.category.create({
      data: {
        name: "Snack",
        type: "MEAL_TYPE",
        description: "Light food between meals",
      },
    }),
    prisma.category.create({
      data: {
        name: "Appetizer",
        type: "MEAL_TYPE",
        description: "Starters before the main course",
      },
    }),
    prisma.category.create({
      data: {
        name: "Beverage",
        type: "MEAL_TYPE",
        description: "Drinks to enjoy anytime",
      },
    }),
  ]);

  // Cooking Method
  await Promise.all([
    prisma.category.create({
      data: {
        name: "Baking",
        type: "COOKING_METHOD",
        description: "Oven-based cooking method",
      },
    }),
    prisma.category.create({
      data: {
        name: "Grilling",
        type: "COOKING_METHOD",
        description: "Cooking food over an open flame",
      },
    }),
    prisma.category.create({
      data: {
        name: "Frying",
        type: "COOKING_METHOD",
        description: "Cooking food in hot oil",
      },
    }),
    prisma.category.create({
      data: {
        name: "Boiling",
        type: "COOKING_METHOD",
        description: "Cooking food in boiling water",
      },
    }),
    prisma.category.create({
      data: {
        name: "Steaming",
        type: "COOKING_METHOD",
        description: "Cooking food with steam",
      },
    }),
    prisma.category.create({
      data: {
        name: "Sautéing",
        type: "COOKING_METHOD",
        description: "Cooking food quickly in a small amount of fat",
      },
    }),
    prisma.category.create({
      data: {
        name: "Roasting",
        type: "COOKING_METHOD",
        description: "Cooking food with dry heat in the oven",
      },
    }),
    prisma.category.create({
      data: {
        name: "Slow Cooking",
        type: "COOKING_METHOD",
        description: "Cooking food at low temperatures for a long time",
      },
    }),
    prisma.category.create({
      data: {
        name: "Pressure Cooking",
        type: "COOKING_METHOD",
        description: "Cooking food quickly under pressure",
      },
    }),
    prisma.category.create({
      data: {
        name: "Raw",
        type: "COOKING_METHOD",
        description: "Dishes prepared without cooking",
      },
    }),
  ]);

  // Dietary
  await Promise.all([
    prisma.category.create({
      data: {
        name: "Low-Carb",
        type: "DIETARY",
        description: "Dishes low in carbohydrates",
      },
    }),
    prisma.category.create({
      data: {
        name: "Keto",
        type: "DIETARY",
        description: "Ketogenic-friendly meals",
      },
    }),
    prisma.category.create({
      data: {
        name: "Gluten-Free",
        type: "DIETARY",
        description: "Meals free from gluten",
      },
    }),
    prisma.category.create({
      data: {
        name: "Dairy-Free",
        type: "DIETARY",
        description: "Meals free from dairy",
      },
    }),
    prisma.category.create({
      data: {
        name: "High-Protein",
        type: "DIETARY",
        description: "Protein-rich meals",
      },
    }),
    prisma.category.create({
      data: {
        name: "Paleo",
        type: "DIETARY",
        description: "Meals aligned with the paleo diet",
      },
    }),
    prisma.category.create({
      data: {
        name: "Vegetarian",
        type: "DIETARY",
        description: "Plant-based meals",
      },
    }),
    prisma.category.create({
      data: {
        name: "Nut-Free",
        type: "DIETARY",
        description: "Meals without nuts",
      },
    }),
    prisma.category.create({
      data: {
        name: "Low-Sodium",
        type: "DIETARY",
        description: "Meals low in salt",
      },
    }),
  ]);

  // Main Ingredient
  await Promise.all([
    prisma.category.create({
      data: {
        name: "Chicken",
        type: "MAIN_INGREDIENT",
        description: "Recipes with chicken",
      },
    }),
    prisma.category.create({
      data: {
        name: "Beef",
        type: "MAIN_INGREDIENT",
        description: "Recipes with beef",
      },
    }),
    prisma.category.create({
      data: {
        name: "Pork",
        type: "MAIN_INGREDIENT",
        description: "Recipes with pork",
      },
    }),
    prisma.category.create({
      data: {
        name: "Fish",
        type: "MAIN_INGREDIENT",
        description: "Recipes with fish",
      },
    }),
    prisma.category.create({
      data: {
        name: "Seafood",
        type: "MAIN_INGREDIENT",
        description: "Recipes with seafood",
      },
    }),
    prisma.category.create({
      data: {
        name: "Eggs",
        type: "MAIN_INGREDIENT",
        description: "Recipes with eggs",
      },
    }),
    prisma.category.create({
      data: {
        name: "Tofu",
        type: "MAIN_INGREDIENT",
        description: "Recipes with tofu",
      },
    }),
    prisma.category.create({
      data: {
        name: "Rice",
        type: "MAIN_INGREDIENT",
        description: "Recipes with rice",
      },
    }),
    prisma.category.create({
      data: {
        name: "Pasta",
        type: "MAIN_INGREDIENT",
        description: "Recipes with pasta",
      },
    }),
    prisma.category.create({
      data: {
        name: "Beans",
        type: "MAIN_INGREDIENT",
        description: "Recipes with beans",
      },
    }),
    prisma.category.create({
      data: {
        name: "Vegetables",
        type: "MAIN_INGREDIENT",
        description: "Recipes with vegetables",
      },
    }),
    prisma.category.create({
      data: {
        name: "Fruits",
        type: "MAIN_INGREDIENT",
        description: "Recipes with fruits",
      },
    }),
    prisma.category.create({
      data: {
        name: "Cheese",
        type: "MAIN_INGREDIENT",
        description: "Recipes with cheese",
      },
    }),
    prisma.category.create({
      data: {
        name: "Nuts",
        type: "MAIN_INGREDIENT",
        description: "Recipes with nuts",
      },
    }),
  ]);

  //----------------------------------------------------------------- REMOVE AFTER DONE

  // ================== Users ==================
  const john = await prisma.user.create({
    data: {
      email: "john@example.com",
      password: "hashedpassword123",
      profile: {
        create: {
          name: "John Doe",
          age: 28,
          gender: "MALE",
          bio: "Food enthusiast",
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
          age: 26,
          gender: "FEMALE",
          bio: "Loves cooking pasta",
        },
      },
    },
  });

  const listCategories = await prisma.category.findMany();

  // ================== Recipes ==================
  const pancake = await prisma.recipe.create({
    data: {
      title: "Pancakes",
      description: "Fluffy homemade pancakes",
      prepTime: 10,
      cookTime: 10,
      servings: 2,
      authorId: john.id,
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
          { categoryId: listCategories[0]?.id as string },
          { categoryId: listCategories[1]?.id as string },
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
      authorId: jane.id,
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
          { categoryId: listCategories[2]?.id as string },
          { categoryId: listCategories[3]?.id as string },
        ],
      },
    },
  });

  // ================== Ratings ==================
  await prisma.recipeRating.createMany({
    data: [
      { userId: john.id, recipeId: pancake.id, value: 4 },
      { userId: jane.id, recipeId: pancake.id, value: 5 },
    ],
  });

  // ================== Favorite ==================
  await prisma.favoriteRecipe.create({
    data: { userId: john.id, recipeId: pasta.id },
  });

  // ================== User Recipe List ==================
  const userRecipeList = await prisma.userRecipeList.create({
    data: {
      name: "John’s Favorite Recipes",
      userId: john.id,
    },
  });

  // ================== User Recipe List Item ==================
  await prisma.userRecipeListItem.create({
    data: {
      listId: userRecipeList.id,
      recipeId: pancake.id,
    },
  });

  await prisma.userRecipeListItem.create({
    data: {
      listId: userRecipeList.id,
      recipeId: pasta.id,
    },
  });

  // ================== User Category Preference =================
  await prisma.userCategoryPreference.create({
    data: {
      userId: john.id,
      categoryId: listCategories[0]?.id as string,
    },
  });

  await prisma.userCategoryPreference.create({
    data: {
      userId: john.id,
      categoryId: listCategories[1]?.id as string,
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
