import { ObjectId } from "mongodb";
import { ProductCategoryValue } from "@/constants/categories";
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
}

export interface UpdateProductInput {
    name?: string;
    description?: string;
    price?: number;
    category?: ProductCategoryValue;
    images?: string[];
    available?: boolean;
    unit?: ProductUnit;
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

    return updateData;
};
