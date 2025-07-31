import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/api/db/operations";

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
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Помилка отримання продуктів" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate product data
    const productData = {
      name: body.name?.trim(),
      description: body.description?.trim(),
      price: parseFloat(body.price),
      category: body.category,
      images: body.images || [],
      available: body.available !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Basic validation
    if (!productData.name || productData.name.length < 2) {
      return NextResponse.json(
        { error: "Назва продукту обов'язкова (мінімум 2 символи)" },
        { status: 400 }
      );
    }

    if (!productData.description || productData.description.length < 10) {
      return NextResponse.json(
        { error: "Опис продукту обов'язковий (мінімум 10 символів)" },
        { status: 400 }
      );
    }

    if (isNaN(productData.price) || productData.price <= 0) {
      return NextResponse.json(
        { error: "Ціна має бути більше 0" },
        { status: 400 }
      );
    }

    if (!productData.category) {
      return NextResponse.json(
        { error: "Категорія продукту обов'язкова" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection("products").insertOne(productData);

    return NextResponse.json({
      success: true,
      productId: result.insertedId,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Помилка створення продукту" },
      { status: 500 }
    );
  }
}
