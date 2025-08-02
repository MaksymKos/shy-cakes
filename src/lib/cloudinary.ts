import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function getPublicIdFromUrl(url: string): string {
    // Extract public_id from Cloudinary URL
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/filename.jpg
    try {
        const parts = url.split("/");
        const uploadIndex = parts.indexOf("upload");

        if (uploadIndex === -1) {
            // Fallback: get filename without extension
            const filename = parts[parts.length - 1];
            return filename.split(".")[0];
        }

        // Get everything after 'upload' and potential version number
        let pathParts = parts.slice(uploadIndex + 1);

        // Skip version number if present (starts with 'v' followed by digits)
        if (pathParts[0] && pathParts[0].match(/^v\d+$/)) {
            pathParts = pathParts.slice(1);
        }

        // Join all parts except remove extension from last part
        const lastPart = pathParts[pathParts.length - 1];
        const lastPartWithoutExt = lastPart.split(".")[0];
        pathParts[pathParts.length - 1] = lastPartWithoutExt;

        return pathParts.join("/");
    } catch (error) {
        console.error("Error extracting public ID from URL:", error);
        // Fallback: get filename without extension
        const filename = url.split("/").pop() || "";
        return filename.split(".")[0];
    }
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
    try {
        if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
            // Not a Cloudinary URL, skip deletion
            return true;
        }

        const publicId = getPublicIdFromUrl(imageUrl);
        const result = await cloudinary.uploader.destroy(publicId);

        // Cloudinary returns 'ok' for successful deletion, 'not found' if already deleted
        return result.result === "ok" || result.result === "not found";
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        return false;
    }
}

export async function deleteMultipleImages(
    imageUrls: string[]
): Promise<boolean[]> {
    // Delete multiple images in parallel
    const deletePromises = imageUrls.map((url) => deleteImage(url));
    return Promise.all(deletePromises);
}

export { cloudinary };
