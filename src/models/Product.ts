import { ObjectId } from "mongodb";
import { ProductCategoryValue } from "../constants/categories";
import { ProductUnit, PRODUCT_UNITS, DEFAULT_UNIT } from "@/constants/units";

export interface IProduct {
  _id?: ObjectId | string;
  name: string;
  description: string;
  price: number;
  category: ProductCategoryValue;
  images: string[];
  available: boolean;
  unit: ProductUnit;
  showOnHomepage?: boolean;
  packaging?: string;
  importantInfo?: string;
  storageConditions?: string;
  recommendations?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: ProductCategoryValue;
  images?: string[];
  available?: boolean;
  unit?: ProductUnit;
  showOnHomepage?: boolean;
  // Packaging and storage information
  packaging?: string;
  importantInfo?: string;
  storageConditions?: string;
  recommendations?: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  category?: ProductCategoryValue;
  images?: string[];
  available?: boolean;
  unit?: ProductUnit;
  showOnHomepage?: boolean;
  // Packaging and storage information
  packaging?: string;
  importantInfo?: string;
  storageConditions?: string;
  recommendations?: string;
}

// Validation schemas
export const validateProduct = (
  product: CreateProductInput
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!product.name || product.name.trim().length === 0) {
    errors.push("Product name is required");
  } else if (product.name.length > 100) {
    errors.push("Product name cannot exceed 100 characters");
  }

  if (!product.description || product.description.trim().length === 0) {
    errors.push("Product description is required");
  } else if (product.description.length > 500) {
    errors.push("Product description cannot exceed 500 characters");
  }

  if (typeof product.price !== "number" || product.price < 0) {
    errors.push("Product price must be a positive number");
  }

  if (!product.category) {
    errors.push("Product category is required");
  }

  if (product.images && product.images.length > 10) {
    errors.push("Cannot have more than 10 images");
  }

  if (product.unit && !Object.values(PRODUCT_UNITS).includes(product.unit)) {
    errors.push("Invalid unit type");
  }

  // Validate packaging fields
  if (product.packaging && product.packaging.length > 500) {
    errors.push("Packaging description cannot exceed 500 characters");
  }

  if (product.importantInfo && product.importantInfo.length > 1000) {
    errors.push("Important information cannot exceed 1000 characters");
  }

  if (product.storageConditions && product.storageConditions.length > 500) {
    errors.push("Storage conditions cannot exceed 500 characters");
  }

  if (product.recommendations && product.recommendations.length > 500) {
    errors.push("Recommendations cannot exceed 500 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper functions
export const createProductData = (
  input: CreateProductInput
): Omit<IProduct, "_id"> => {
  return {
    name: input.name.trim(),
    description: input.description.trim(),
    price: Math.round(input.price * 100) / 100, // Round to 2 decimal places
    category: input.category,
    images: input.images || [],
    available: input.available ?? true,
    unit: input.unit || DEFAULT_UNIT,
    showOnHomepage: input.showOnHomepage ?? false,
    packaging: input.packaging?.trim() || undefined,
    importantInfo: input.importantInfo?.trim() || undefined,
    storageConditions: input.storageConditions?.trim() || undefined,
    recommendations: input.recommendations?.trim() || undefined,
    createdAt: new Date(),
  };
};

export const updateProductData = (
  input: UpdateProductInput
): Partial<IProduct> => {
  const updateData: Partial<IProduct> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) updateData.name = input.name.trim();
  if (input.description !== undefined)
    updateData.description = input.description.trim();
  if (input.price !== undefined)
    updateData.price = Math.round(input.price * 100) / 100;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.images !== undefined) updateData.images = input.images;
  if (input.available !== undefined) updateData.available = input.available;
  if (input.unit !== undefined) updateData.unit = input.unit;
  if (input.showOnHomepage !== undefined)
    updateData.showOnHomepage = input.showOnHomepage;
  if (input.packaging !== undefined)
    updateData.packaging = input.packaging?.trim() || undefined;
  if (input.importantInfo !== undefined)
    updateData.importantInfo = input.importantInfo?.trim() || undefined;
  if (input.storageConditions !== undefined)
    updateData.storageConditions = input.storageConditions?.trim() || undefined;
  if (input.recommendations !== undefined)
    updateData.recommendations = input.recommendations?.trim() || undefined;

  return updateData;
};
