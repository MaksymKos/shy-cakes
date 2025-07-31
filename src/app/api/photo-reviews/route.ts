import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/api/db/operations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get("approved");

    const db = await getDatabase();

    const filter: Record<string, boolean> = {};

    if (approved === "true") {
      filter.isApproved = true;
    }

    const reviews = await db
      .collection("photo_reviews")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching photo reviews:", error);
    return NextResponse.json(
      { error: "Помилка завантаження відгуків" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      cakeName,
      cakeDescription,
      totalPrice,
      totalWeight,
      completedDate,
      images,
      isApproved = true, // Одразу схвалюємо
    } = body;

    // Валідація
    if (
      !cakeName ||
      !cakeDescription ||
      !totalPrice ||
      !totalWeight ||
      !completedDate
    ) {
      return NextResponse.json(
        { error: "Обов'язкові поля не заповнені" },
        { status: 400 }
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "Потрібно додати хоча б одне фото" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    const newReview = {
      cakeName,
      cakeDescription,
      totalPrice: Number(totalPrice),
      totalWeight: Number(totalWeight),
      completedDate: new Date(completedDate),
      images,
      isApproved,
      createdAt: new Date(),
    };

    const result = await db.collection("photo_reviews").insertOne(newReview);

    return NextResponse.json(
      {
        message: "Відгук успішно створено",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating photo review:", error);
    return NextResponse.json(
      { error: "Помилка створення відгуку" },
      { status: 500 }
    );
  }
}
