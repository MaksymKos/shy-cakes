// Product categories
export const PRODUCT_CATEGORIES = [
  "Мусові торти",
  "Бісквітні торти",
  "Macarons",
  "Ескімо",
  "Cake-pops",
  "Подарункові набори",
  "Кексики",
  "Трайфли",
  "Десерти",
] as const;

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number];

export const DEFAULT_CATEGORY: ProductCategoryValue = "Мусові торти";

// Category display names (if needed for UI)
export const CATEGORY_LABELS: Record<ProductCategoryValue, string> = {
  "Мусові торти": "Мусові торти",
  "Бісквітні торти": "Бісквітні торти",
  Macarons: "Macarons",
  Ескімо: "Ескімо",
  "Cake-pops": "Cake-pops",
  "Подарункові набори": "Подарункові набори",
  Кексики: "Кексики",
  Трайфли: "Трайфли",
  Десерти: "Десерти",
};

// Category descriptions (if needed)
export const CATEGORY_DESCRIPTIONS: Record<ProductCategoryValue, string> = {
  "Мусові торти": "Ніжні торти з муcовою начинкою",
  "Бісквітні торти": "Класичні торти на бісквітній основі",
  Macarons: "Французькі мигдальні тістечка",
  Ескімо: "Морозиво на паличці в шоколадній глазурі",
  "Cake-pops": "Тістечка на паличці",
  "Подарункові набори": "Готові набори солодощів",
  Кексики: "Маленькі кексики різних смаків",
  Трайфли: "Шаровані десерти в склянках",
  Десерти: "Різноманітні десерти та солодощі",
};
