import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/api/db/operations";
import {
  CreateProductInput,
  validateProduct,
  createProductData,
} from "@/models/Product";
import { PRODUCT_UNITS } from "@/constants/units";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const db = await getDatabase();

    // Build filter
    type FilterType = {
      category?: string;
      $or?: Array<
        | { name: { $regex: string; $options: string } }
        | { description: { $regex: string; $options: string } }
      >;
    };

    const filter: FilterType = {};
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await db
      .collection("products")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Помилка отримання продуктів" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create input data
    const input: CreateProductInput = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      category: body.category,
      images: body.images,
      available: body.available,
      unit: body.unit,
      showOnHomepage: body.showOnHomepage,
      packaging: body.packaging,
      importantInfo: body.importantInfo,
      storageConditions: body.storageConditions,
      recommendations: body.recommendations,
    };

    // Validate product data
    const validation = validateProduct(input);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    // Additional unit validation
    if (input.unit && !Object.values(PRODUCT_UNITS).includes(input.unit)) {
      return NextResponse.json(
        { error: "Одиниця виміру має бути 'kg' або 'piece'" },
        { status: 400 }
      );
    }

    // Create product data
    const productData = createProductData(input);

    const db = await getDatabase();
    const result = await db.collection("products").insertOne(productData);

    return NextResponse.json({
      success: true,
      productId: result.insertedId,
    });
  } catch {
    return NextResponse.json(
      { error: "Помилка створення продукту" },
      { status: 500 }
    );
  }
}
