import type { Category } from "../../src/generated/prisma/client";

export function findCategoryByName(name: string, listCategories: Category[]) {
  const category = listCategories.find((cat) => cat.name === name);
  return category ?? null;
}
