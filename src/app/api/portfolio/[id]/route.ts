import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/api/db/operations";
import { ObjectId } from "mongodb";
import { deleteImage } from "@/lib/cloudinary";

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

        // Get the current item to check if image URL changed
        const currentItem = await db
            .collection("portfolio")
            .findOne({ _id: new ObjectId(id) });

        if (!currentItem) {
            return NextResponse.json(
                { error: "Елемент портфоліо не знайдено" },
                { status: 404 }
            );
        }

        // If image URL changed, delete the old image from Cloudinary
        if (currentItem.image && currentItem.image !== updateData.image) {
            await deleteImage(currentItem.image);
        }

        await db
            .collection("portfolio")
            .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

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

        // Get the item first to get the image URL
        const item = await db.collection("portfolio").findOne({
            _id: new ObjectId(id),
        });

        if (!item) {
            return NextResponse.json(
                { error: "Елемент портфоліо не знайдено" },
                { status: 404 }
            );
        }

        // Delete the item from database
        await db.collection("portfolio").deleteOne({
            _id: new ObjectId(id),
        });

        // Delete the image from Cloudinary
        if (item.image) {
            await deleteImage(item.image);
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
