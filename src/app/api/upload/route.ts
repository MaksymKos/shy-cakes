import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    [key: string]: unknown;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string; // portfolio, products, reviews

        if (!file) {
            return NextResponse.json(
                { error: "Файл не знайдено" },
                { status: 400 }
            );
        }

        // Validate file
        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Дозволені тільки зображення" },
                { status: 400 }
            );
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Розмір файлу не повинен перевищувати 5MB" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Determine folder based on type
        let folder = "shy-cakes/general";
        switch (type) {
            case "portfolio":
                folder = "shy-cakes/portfolio";
                break;
            case "products":
                folder = "shy-cakes/products";
                break;
            case "reviews":
                folder = "shy-cakes/reviews";
                break;
            default:
                folder = "shy-cakes/general";
        }

        // Upload to Cloudinary
        const uploadResponse = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            resource_type: "image",
                            folder: folder,
                            quality: "auto",
                            fetch_format: "auto",
                            transformation: [
                                { width: 2000, height: 2000, crop: "limit" }, // Limit max size
                                { quality: "auto:good" }, // Optimize quality
                            ],
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result as CloudinaryUploadResult);
                        }
                    )
                    .end(buffer);
            }
        );

        return NextResponse.json({ url: uploadResponse.secure_url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Помилка завантаження файлу" },
            { status: 500 }
        );
    }
}
