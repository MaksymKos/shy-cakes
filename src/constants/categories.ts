// Константи для категорій товарів
export const PRODUCT_CATEGORIES = [
  { value: "Мусові торти", label: "Мусові торти" },
  { value: "Бісквітні торти", label: "Бісквітні торти" },
  { value: "Macarons", label: "Macarons" },
  { value: "Ескімо", label: "Ескімо" },
  { value: "Cake-pops", label: "Cake-pops" },
  { value: "Подарункові набори", label: "Подарункові набори" },
] as const;

// Категорії з опцією "Всі товари" для фільтрів
export const FILTER_CATEGORIES = [
  { value: "", label: "Всі товари" },
  ...PRODUCT_CATEGORIES,
] as const;

// Типи для TypeScript
export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number]["value"];
export type FilterCategoryValue = (typeof FILTER_CATEGORIES)[number]["value"];
