import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/api/db/operations";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Невірний ID відгуку" },
        { status: 400 }
      );
    }

    const review = await db
      .collection("photo_reviews")
      .findOne({ _id: new ObjectId(id) });

    if (!review) {
      return NextResponse.json(
        { error: "Відгук не знайдено" },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error fetching photo review:", error);
    return NextResponse.json(
      { error: "Помилка завантаження відгуку" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Невірний ID відгуку" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const updateData: Record<string, unknown> = {
      ...body,
      updatedAt: new Date(),
    };

    // Конвертуємо числові поля
    if (updateData.totalPrice !== undefined) {
      updateData.totalPrice = Number(updateData.totalPrice);
    }
    if (updateData.totalWeight !== undefined) {
      updateData.totalWeight = Number(updateData.totalWeight);
    }
    if (
      updateData.completedDate !== undefined &&
      updateData.completedDate !== null
    ) {
      updateData.completedDate = new Date(updateData.completedDate as string);
    }

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const result = await db
      .collection("photo_reviews")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Відгук не знайдено" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Відгук оновлено" });
  } catch (error) {
    console.error("Error updating photo review:", error);
    return NextResponse.json(
      { error: "Помилка оновлення відгуку" },
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
        { error: "Невірний ID відгуку" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection("photo_reviews").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Відгук не знайдено" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Відгук видалено" });
  } catch (error) {
    console.error("Error deleting photo review:", error);
    return NextResponse.json(
      { error: "Помилка видалення відгуку" },
      { status: 500 }
    );
  }
}
