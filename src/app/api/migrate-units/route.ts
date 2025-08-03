// Migration script to add unit field to existing products
// This would typically be run once to update existing products

import { getDatabase } from "@/api/db/operations";

export async function migrateProductUnits() {
    try {
        const db = await getDatabase();

        // Update all products that don't have a unit field
        const result = await db.collection("products").updateMany(
            { unit: { $exists: false } }, // Products without unit field
            { $set: { unit: "kg" } } // Set default to kg
        );

        console.log(`Updated ${result.modifiedCount} products with unit field`);
        return result;
    } catch (error) {
        console.error("Migration error:", error);
        throw error;
    }
}

// Example of how to run this migration
// You could add this to your admin panel or run it via API
export async function GET() {
    try {
        const result = await migrateProductUnits();
        return Response.json({
            success: true,
            message: `Updated ${result.modifiedCount} products`,
        });
    } catch (error) {
        console.error("Migration failed:", error);
        return Response.json(
            {
                success: false,
                error: "Migration failed",
            },
            { status: 500 }
        );
    }
}
