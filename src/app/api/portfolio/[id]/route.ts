import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/api/db/operations";
import { ObjectId } from "mongodb";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Невірний ID елементу портфоліо" },
        { status: 400 }
      );
    }

    // Validate data
    const updateData = {
      title: body.title?.trim(),
      image: body.image?.trim(),
      updatedAt: new Date(),
    };

    if (!updateData.title || updateData.title.length < 2) {
      return NextResponse.json(
        { error: "Назва роботи обов'язкова (мінімум 2 символи)" },
        { status: 400 }
      );
    }

    if (!updateData.image) {
      return NextResponse.json(
        { error: "Зображення обов'язкове" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db
      .collection("portfolio")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Елемент портфоліо не знайдено" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update portfolio item error:", error);
    return NextResponse.json(
      { error: "Помилка оновлення елементу портфоліо" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Невірний ID елементу портфоліо" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection("portfolio").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Елемент портфоліо не знайдено" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete portfolio item error:", error);
    return NextResponse.json(
      { error: "Помилка видалення елементу портфоліо" },
      { status: 500 }
    );
  }
}
