import { ObjectId } from "mongodb";

export interface ICategory {
  _id?: ObjectId | string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

// Validation functions
export const validateCategory = (
  category: CreateCategoryInput
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!category.name || category.name.trim().length === 0) {
    errors.push("Назва категорії обов'язкова");
  }

  if (category.name && category.name.trim().length > 100) {
    errors.push("Назва категорії не може бути довшою за 100 символів");
  }

  if (category.description && category.description.length > 500) {
    errors.push("Опис категорії не може бути довшим за 500 символів");
  }

  if (category.order !== undefined && category.order < 1) {
    errors.push("Порядок має бути більше 0");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateCategory = (
  category: UpdateCategoryInput
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (
    category.name !== undefined &&
    (!category.name || category.name.trim().length === 0)
  ) {
    errors.push("Назва категорії обов'язкова");
  }

  if (category.name && category.name.trim().length > 100) {
    errors.push("Назва категорії не може бути довшою за 100 символів");
  }

  if (category.description && category.description.length > 500) {
    errors.push("Опис категорії не може бути довшим за 500 символів");
  }

  if (category.order !== undefined && category.order < 1) {
    errors.push("Порядок має бути більше 0");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper functions
export const createCategoryData = (
  input: CreateCategoryInput
): Omit<ICategory, "_id"> => {
  return {
    name: input.name.trim(),
    description: input.description?.trim() || "",
    order: input.order || 1,
    isActive: input.isActive !== false,
    createdAt: new Date(),
  };
};

export const updateCategoryData = (input: UpdateCategoryInput) => {
  const updateData: Partial<ICategory> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) updateData.name = input.name.trim();
  if (input.description !== undefined)
    updateData.description = input.description.trim();
  if (input.order !== undefined) updateData.order = input.order;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;

  return updateData;
};

// Default categories based on current constants
export const defaultCategories: CreateCategoryInput[] = [
  {
    name: "Мусові торти",
    description: "Легкі та повітряні торти з мусовими начинками",
    order: 1,
    isActive: true,
  },
  {
    name: "Бісквітні торти",
    description: "Класичні торти на бісквітній основі",
    order: 2,
    isActive: true,
  },
  {
    name: "Macarons",
    description: "Французькі мигдальні тістечка",
    order: 3,
    isActive: true,
  },
  {
    name: "Ескімо",
    description: "Морозиво на паличці в шоколадній глазурі",
    order: 4,
    isActive: true,
  },
  {
    name: "Cake-pops",
    description: "Тістечка на паличці в глазурі",
    order: 5,
    isActive: true,
  },
  {
    name: "Подарункові набори",
    description: "Готові набори солодощів для подарунків",
    order: 6,
    isActive: true,
  },
];
