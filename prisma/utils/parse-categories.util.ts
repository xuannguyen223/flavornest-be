import type { Category } from "../../src/generated/prisma/client";
import { COOKING_METHOD, LACKING_CATEGORIES } from "../data";
import { findCategoryByName } from "./find-category-id.util";
import { getRandomIdx } from "./get-random-idx.util";

export type CategoriesMockType = {
  categoryId: string;
};

export function parseCategories(
  listCategories: Category[],
  strCategory: string,
  strArea: string
): CategoriesMockType[] {
  const category = findCategoryByName(strCategory, listCategories);
  const categories: CategoriesMockType[] = [];
  let categoryNames = [strCategory, strArea];
  const idx = getRandomIdx(COOKING_METHOD.length);

  if (category?.name === "Vegetarian") {
    const veganIngredients =
      Math.random() < 0.5
        ? ["Vegetables", "Tofu", "Rice"]
        : ["Cheese", "Eggs", "Beans"];
    categoryNames = [
      ...categoryNames,
      "Gluten-Free",
      "Dairy-Free",
      ...veganIngredients,
    ];
  } else if (category?.name === "Dessert") {
    categoryNames = [...categoryNames, "Fruits", "Beverages"];
  } else {
    categoryNames = [...categoryNames, "High-Protein"];
  }

  const cookingMethod =
    COOKING_METHOD[getRandomIdx(COOKING_METHOD.length)]?.name;
  const lackingCategory =
    LACKING_CATEGORIES[getRandomIdx(LACKING_CATEGORIES.length)];

  if (cookingMethod) categoryNames.push(cookingMethod);
  if (lackingCategory) categoryNames.push(lackingCategory);

  categoryNames.forEach((name) => {
    const foundCategory = findCategoryByName(name, listCategories);
    if (foundCategory) {
      categories.push({ categoryId: foundCategory.id });
    }
  });

  return categories;
}
