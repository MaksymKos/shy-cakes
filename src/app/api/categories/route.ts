import { NextRequest, NextResponse } from "next/server";
import { Db } from "mongodb";
import { getDatabase } from "@/api/db/operations";
import {
  CreateCategoryInput,
  validateCategory,
  createCategoryData,
  defaultCategories,
} from "@/models/Category";

export async function GET() {
  try {
    const db = await getDatabase();

    // Get categories from database
    const categories = await db
      .collection("categories")
      .find({ isActive: { $ne: false } })
      .sort({ order: 1, name: 1 })
      .toArray();

    // If no categories exist, initialize with default data
    if (categories.length === 0) {
      await initializeDefaultCategories(db);

      // Fetch categories again after initialization
      const newCategories = await db
        .collection("categories")
        .find({ isActive: { $ne: false } })
        .sort({ order: 1, name: 1 })
        .toArray();

      // Convert _id to string for frontend
      const serializedCategories = newCategories.map((category) => ({
        ...category,
        _id: category._id.toString(),
      }));

      return NextResponse.json(serializedCategories);
    }

    // Convert _id to string for frontend
    const serializedCategories = categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
    }));

    return NextResponse.json(serializedCategories);
  } catch {
    return NextResponse.json(
      { error: "Помилка отримання категорій" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const input: CreateCategoryInput = {
      name: body.name,
      description: body.description,
      order: body.order,
      isActive: body.isActive !== false,
    };

    // Validate category data
    const validation = validateCategory(input);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if category with this name already exists
    const existingCategory = await db.collection("categories").findOne({
      name: {
        $regex: new RegExp(
          `^${input.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          "i"
        ),
      },
    });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Категорія з такою назвою вже існує" },
        { status: 400 }
      );
    }

    // Reorder existing categories if necessary
    const targetOrder = input.order || 1;
    await db
      .collection("categories")
      .updateMany({ order: { $gte: targetOrder } }, { $inc: { order: 1 } });

    // Create category data with the specified order
    const categoryData = createCategoryData({
      ...input,
      order: targetOrder,
    });

    const result = await db.collection("categories").insertOne(categoryData);

    return NextResponse.json({
      success: true,
      categoryId: result.insertedId,
    });
  } catch {
    return NextResponse.json(
      { error: "Помилка створення категорії" },
      { status: 500 }
    );
  }
}

// Helper function to initialize default categories
async function initializeDefaultCategories(db: Db) {
  try {
    // Double check to prevent duplicates
    const existingCount = await db.collection("categories").countDocuments();
    if (existingCount > 0) {
      return;
    }

    const categoriesToInsert = defaultCategories.map((category) =>
      createCategoryData(category)
    );

    await db.collection("categories").insertMany(categoriesToInsert);
  } catch {
    // Ignore initialization errors
  }
}
