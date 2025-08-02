import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/api/db/operations";
import { deleteImage, deleteMultipleImages } from "@/lib/cloudinary";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await getDatabase();

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Невірний ID товару" },
                { status: 400 }
            );
        }

        const product = await db
            .collection("products")
            .findOne({ _id: new ObjectId(id) });

        if (!product) {
            return NextResponse.json(
                { error: "Товар не знайдено" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Помилка завантаження товару" },
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
                { error: "Невірний ID продукту" },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // Get the current product to check for image changes
        const currentProduct = await db
            .collection("products")
            .findOne({ _id: new ObjectId(id) });

        if (!currentProduct) {
            return NextResponse.json(
                { error: "Продукт не знайдено" },
                { status: 404 }
            );
        }

        const updateData = {
            ...body,
            updatedAt: new Date(),
        };

        // Remove undefined fields
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        // Handle image cleanup if images changed
        if (updateData.images && currentProduct.images) {
            const oldImages = currentProduct.images as string[];
            const newImages = updateData.images as string[];

            // Find images that were removed
            const removedImages = oldImages.filter(
                (img) => !newImages.includes(img)
            );

            // Delete removed images from Cloudinary
            for (const imageUrl of removedImages) {
                await deleteImage(imageUrl);
            }
        }

        await db
            .collection("products")
            .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update product error:", error);
        return NextResponse.json(
            { error: "Помилка оновлення продукту" },
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
                { error: "Невірний ID продукту" },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // Get the product first to get the images
        const product = await db.collection("products").findOne({
            _id: new ObjectId(id),
        });

        if (!product) {
            return NextResponse.json(
                { error: "Продукт не знайдено" },
                { status: 404 }
            );
        }

        // Delete the product from database
        await db.collection("products").deleteOne({
            _id: new ObjectId(id),
        });

        // Delete all images from Cloudinary
        if (product.images && Array.isArray(product.images)) {
            await deleteMultipleImages(product.images);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete product error:", error);
        return NextResponse.json(
            { error: "Помилка видалення продукту" },
            { status: 500 }
        );
    }
}
