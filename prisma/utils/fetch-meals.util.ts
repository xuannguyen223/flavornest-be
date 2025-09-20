import { CATEGORY_MOCK_DATA } from "../data";
import type {
  MealDetailMockType,
  MealDetailReturnType,
  MealFromCategoryMockType,
} from "../types";

async function fetchMealDetails(
  mealId: string
): Promise<MealDetailMockType | null> {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = (await res.json()) as MealDetailReturnType;
    if (!data.meals || data.meals.length === 0) return null;
    const meal = data.meals[0] as MealDetailMockType;
    return meal;
  } catch (error) {
    console.error(`Failed to fetch meal details for ID ${mealId}:`, error);
    return null;
  }
}

export async function fetchMealsByCategory(): Promise<MealDetailMockType[]> {
  let meals: MealDetailMockType[] = [];
  try {
    for (const category of CATEGORY_MOCK_DATA) {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      const data = (await res.json()) as MealFromCategoryMockType;
      if (!data.meals) continue;

      const mealsInCategory = data.meals.slice(0, 10); // Limit to 10 meals per category

      for (const meal of mealsInCategory) {
        const mealDetails = await fetchMealDetails(meal.idMeal);
        if (!mealDetails) continue;
        meals.push(mealDetails);
      }
    }
    return meals;
  } catch (error) {
    console.error("Failed to fetch meals:", error);
    return [];
  }
}
