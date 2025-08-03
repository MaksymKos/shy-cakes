import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/api/db/operations";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const db = await getDatabase();
        const user = await db.collection("users").findOne(
            { _id: new ObjectId(session.user.id) },
            { projection: { password: 0 } } // Exclude password from response
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch user profile" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, email, phone, shippingInfo } = body;

        // Validate required fields
        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // Check if email is already taken by another user
        if (email !== session.user.email) {
            const existingUser = await db.collection("users").findOne({
                email: email.toLowerCase(),
                _id: { $ne: new ObjectId(session.user.id) },
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: "Email already in use" },
                    { status: 400 }
                );
            }
        }

        const updateData: {
            name: string;
            email: string;
            phone?: string;
            updatedAt: Date;
            shippingInfo?: {
                fullName: string;
                phone: string;
                address: string;
                city: string;
                postalCode: string;
                notes: string;
            };
        } = {
            name,
            email: email.toLowerCase(),
            phone,
            updatedAt: new Date(),
        };

        // Add shipping information if provided
        if (shippingInfo) {
            updateData.shippingInfo = {
                fullName: shippingInfo.fullName || name,
                phone: shippingInfo.phone || phone,
                address: shippingInfo.address || "",
                city: shippingInfo.city || "",
                postalCode: shippingInfo.postalCode || "",
                notes: shippingInfo.notes || "",
            };
        }

        const result = await db
            .collection("users")
            .updateOne(
                { _id: new ObjectId(session.user.id) },
                { $set: updateData }
            );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Fetch updated user data
        const updatedUser = await db
            .collection("users")
            .findOne(
                { _id: new ObjectId(session.user.id) },
                { projection: { password: 0 } }
            );

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json(
            { error: "Failed to update user profile" },
            { status: 500 }
        );
    }
}
