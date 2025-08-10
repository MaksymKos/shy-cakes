import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/api/db/operations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Невірний ID FAQ" }, { status: 400 });
    }

    const faq = await db.collection("faq").findOne({ _id: new ObjectId(id) });

    if (!faq) {
      return NextResponse.json({ error: "FAQ не знайдено" }, { status: 404 });
    }

    // Convert _id to string for frontend
    const serializedFaq = {
      ...faq,
      _id: faq._id.toString(),
    };

    return NextResponse.json(serializedFaq);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json(
      { error: "Помилка завантаження FAQ" },
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
      return NextResponse.json({ error: "Невірний ID FAQ" }, { status: 400 });
    }

    const db = await getDatabase();

    // Check if FAQ exists
    const currentFaq = await db
      .collection("faq")
      .findOne({ _id: new ObjectId(id) });

    if (!currentFaq) {
      return NextResponse.json({ error: "FAQ не знайдено" }, { status: 404 });
    }

    // Prepare update data
    const updateData: Partial<{
      question: string;
      answer: string;
      order: number;
      isActive: boolean;
      updatedAt: Date;
    }> = {
      updatedAt: new Date(),
    };

    if (body.question !== undefined) {
      updateData.question = body.question.trim();
    }
    if (body.answer !== undefined) {
      updateData.answer = body.answer.trim();
    }
    if (body.order !== undefined) {
      updateData.order = body.order;
    }
    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }

    await db
      .collection("faq")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update FAQ error:", error);
    return NextResponse.json(
      { error: "Помилка оновлення FAQ" },
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
      return NextResponse.json({ error: "Невірний ID FAQ" }, { status: 400 });
    }

    const db = await getDatabase();

    // Check if FAQ exists
    const faq = await db.collection("faq").findOne({
      _id: new ObjectId(id),
    });

    if (!faq) {
      return NextResponse.json({ error: "FAQ не знайдено" }, { status: 404 });
    }

    // Delete the FAQ from database
    await db.collection("faq").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete FAQ error:", error);
    return NextResponse.json(
      { error: "Помилка видалення FAQ" },
      { status: 500 }
    );
  }
}
