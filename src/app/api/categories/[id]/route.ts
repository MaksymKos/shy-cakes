import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/api/db/operations";
import { UpdateCategoryInput, updateCategoryData } from "@/models/Category";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Невірний ID категорії" },
        { status: 400 }
      );
    }

    const category = await db
      .collection("categories")
      .findOne({ _id: new ObjectId(id) });

    if (!category) {
      return NextResponse.json(
        { error: "Категорію не знайдено" },
        { status: 404 }
      );
    }

    // Convert _id to string for frontend
    const serializedCategory = {
      ...category,
      _id: category._id.toString(),
    };

    return NextResponse.json(serializedCategory);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Помилка завантаження категорії" },
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
        { error: "Невірний ID категорії" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if category exists
    const currentCategory = await db
      .collection("categories")
      .findOne({ _id: new ObjectId(id) });

    if (!currentCategory) {
      return NextResponse.json(
        { error: "Категорію не знайдено" },
        { status: 404 }
      );
    }

    // Check if name is being changed and if new name already exists
    if (body.name && body.name !== currentCategory.name) {
      const existingCategory = await db.collection("categories").findOne({
        name: {
          $regex: new RegExp(
            `^${body.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i"
          ),
        },
        _id: { $ne: new ObjectId(id) },
      });
      if (existingCategory) {
        return NextResponse.json(
          { error: "Категорія з такою назвою вже існує" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const input: UpdateCategoryInput = {
      name: body.name,
      description: body.description,
      order: body.order,
      isActive: body.isActive,
    };

    // Handle order reordering if order is being changed
    if (body.order !== undefined && body.order !== currentCategory.order) {
      const newOrder = body.order;
      const oldOrder = currentCategory.order;

      if (newOrder < oldOrder) {
        // Moving up - shift categories down between newOrder and oldOrder-1
        await db.collection("categories").updateMany(
          {
            order: { $gte: newOrder, $lt: oldOrder },
            _id: { $ne: new ObjectId(id) },
          },
          { $inc: { order: 1 } }
        );
      } else if (newOrder > oldOrder) {
        // Moving down - shift categories up between oldOrder+1 and newOrder
        await db.collection("categories").updateMany(
          {
            order: { $gt: oldOrder, $lte: newOrder },
            _id: { $ne: new ObjectId(id) },
          },
          { $inc: { order: -1 } }
        );
      }
    }

    const updateData = updateCategoryData(input);

    await db
      .collection("categories")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: "Помилка оновлення категорії" },
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
        { error: "Невірний ID категорії" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if category exists
    const category = await db.collection("categories").findOne({
      _id: new ObjectId(id),
    });

    if (!category) {
      return NextResponse.json(
        { error: "Категорію не знайдено" },
        { status: 404 }
      );
    }

    // Check if category is used by any products
    const productsWithCategory = await db.collection("products").findOne({
      category: category.name,
    });

    if (productsWithCategory) {
      return NextResponse.json(
        {
          error: "Неможливо видалити категорію, яка використовується в товарах",
        },
        { status: 400 }
      );
    }

    // Delete the category from database
    await db.collection("categories").deleteOne({
      _id: new ObjectId(id),
    });

    // Reorder remaining categories - shift down all categories with order greater than deleted
    await db
      .collection("categories")
      .updateMany({ order: { $gt: category.order } }, { $inc: { order: -1 } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Помилка видалення категорії" },
      { status: 500 }
    );
  }
}
