import type { MealDetailMockType } from "../types";
import { convertFractionToDecimal } from "./convert-fraction.util";

export type IngredientMockType = {
  name: string;
  quantity: number;
  unit: string;
};

export function parseIngredients(
  meal: MealDetailMockType
): IngredientMockType[] {
  let ingredients: IngredientMockType[] = [];

  for (let i = 1; i < 20; i++) {
    const ingredient = meal[`strIngredient${i}`] as string | null;
    const measure = meal[`strMeasure${i}`] as string | null;

    if (ingredient && ingredient.trim()) {
      let quantity: number = 1;
      let unit: string = "pcs";

      if (measure && measure.trim()) {
        const measureStr = measure.trim();
        const match = measureStr.match(/^(\d*\.?\/?\d+)\s*(.*)$/);
        if (match) {
          if (match[1]?.includes("/")) {
            quantity = convertFractionToDecimal(match[1]);
          } else {
            quantity = Number(match[1]) || 1;
          }
          unit = match[2]?.trim() || "pcs";
        }
      }

      ingredients.push({
        name: ingredient.trim(),
        quantity,
        unit,
      });
    }
  }

  return ingredients;
}
