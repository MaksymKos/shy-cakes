import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/api/db/operations";
import { ObjectId } from "mongodb";
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

        // Get the current review to check for image changes
        const currentReview = await db
            .collection("photo_reviews")
            .findOne({ _id: new ObjectId(id) });

        if (!currentReview) {
            return NextResponse.json(
                { error: "Відгук не знайдено" },
                { status: 404 }
            );
        }

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
            updateData.completedDate = new Date(
                updateData.completedDate as string
            );
        }

        // Handle image cleanup if images changed
        if (updateData.images && currentReview.images) {
            const oldImages = currentReview.images as string[];
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

        // Remove undefined fields
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        await db
            .collection("photo_reviews")
            .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

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

        // Get the review first to get the images
        const review = await db.collection("photo_reviews").findOne({
            _id: new ObjectId(id),
        });

        if (!review) {
            return NextResponse.json(
                { error: "Відгук не знайдено" },
                { status: 404 }
            );
        }

        // Delete the review from database
        await db.collection("photo_reviews").deleteOne({
            _id: new ObjectId(id),
        });

        // Delete all images from Cloudinary
        if (review.images && Array.isArray(review.images)) {
            await deleteMultipleImages(review.images);
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
