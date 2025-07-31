import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/api/db/operations";

export async function GET() {
  try {
    const db = await getDatabase();
    const portfolioItems = await db
      .collection("portfolio")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(portfolioItems);
  } catch (error) {
    console.error("Get portfolio error:", error);
    return NextResponse.json(
      { error: "Помилка отримання портфоліо" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate portfolio item data
    const portfolioData = {
      title: body.title?.trim(),
      image: body.image?.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Basic validation
    if (!portfolioData.title || portfolioData.title.length < 2) {
      return NextResponse.json(
        { error: "Назва робіт обов'язкова (мінімум 2 символи)" },
        { status: 400 }
      );
    }

    if (!portfolioData.image) {
      return NextResponse.json(
        { error: "Зображення обов'язкове" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection("portfolio").insertOne(portfolioData);

    return NextResponse.json({
      success: true,
      portfolioId: result.insertedId,
    });
  } catch (error) {
    console.error("Create portfolio item error:", error);
    return NextResponse.json(
      { error: "Помилка створення елементу портфоліо" },
      { status: 500 }
    );
  }
}
