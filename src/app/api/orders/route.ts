import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/api/db/operations";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        const userOnly = searchParams.get("userOnly") === "true";

        const db = await getDatabase();

        let query = {};

        // If userOnly is requested and user is logged in, filter by user ID
        if (userOnly && session?.user?.id) {
            query = { userId: session.user.id };
        }
        // If userOnly is requested but user is not logged in, return empty array
        else if (userOnly && !session?.user?.id) {
            return NextResponse.json([]);
        }
        // For admin access, return all orders (no filter)
        // For regular access without userOnly, return all orders (existing behavior)

        const orders = await db
            .collection("orders")
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(orders);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get user session to associate order with logged-in user
        const session = await getServerSession(authOptions);

        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            deliveryAddress,
            deliveryDate,
            weight,
            specialRequests,
            paymentMethod,
            productId,
            productName,
            productPrice,
            productUnit,
            totalAmount,
            // Legacy cake order fields (for backward compatibility)
            cakeType,
            size,
            description,
        } = body;

        // Determine if this is a guest order or from a logged-in user
        const isGuestOrder = !session?.user;
        const userId = session?.user?.id || null;
        const userEmail = session?.user?.email || null;

        // Validate required fields for product orders
        if (
            productId &&
            (!customerName ||
                !customerPhone ||
                !deliveryAddress ||
                !deliveryDate ||
                !weight)
        ) {
            return NextResponse.json(
                { error: "Missing required fields for product order" },
                { status: 400 }
            );
        }

        // Validate required fields for cake orders (legacy)
        if (
            !productId &&
            (!customerName || !customerEmail || !cakeType || !deliveryDate)
        ) {
            return NextResponse.json(
                {
                    error: "Customer name, email, cake type, and delivery date are required",
                },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // Get the next order ID using a counter
        const getNextOrderId = async () => {
            const counterCollection = db.collection("counters");
            const result = await counterCollection.findOneAndUpdate(
                { name: "orderId" },
                { $inc: { sequence: 1 } },
                { upsert: true, returnDocument: "after" }
            );

            // If this is the first order, start from 1000
            const nextId = result?.sequence || 1000;
            if (nextId < 1000) {
                await counterCollection.updateOne(
                    { name: "orderId" },
                    { $set: { sequence: 1000 } }
                );
                return 1000;
            }
            return nextId;
        };

        const orderId = await getNextOrderId();

        // Create order data based on type
        let orderData;

        if (productId) {
            // Product order
            orderData = {
                orderId,
                type: "product",
                customerName,
                customerEmail,
                customerPhone,
                deliveryAddress,
                deliveryDate: new Date(deliveryDate),
                weight: parseFloat(weight),
                specialRequests,
                paymentMethod,
                productId,
                productName,
                productPrice: parseFloat(productPrice),
                productUnit,
                totalAmount: parseFloat(totalAmount),
                status: "pending",
                // User association fields
                userId,
                userEmail,
                isGuestOrder,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        } else {
            // Legacy cake order
            orderData = {
                orderId,
                type: "cake",
                customerName,
                customerEmail,
                customerPhone,
                cakeType,
                size,
                description,
                deliveryDate: new Date(deliveryDate),
                totalPrice: parseInt(totalAmount || 0),
                status: "pending",
                // User association fields
                userId,
                userEmail,
                isGuestOrder,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        }

        const result = await db.collection("orders").insertOne(orderData);

        return NextResponse.json(
            {
                ...orderData,
                _id: result.insertedId,
                message:
                    "Замовлення успішно прийнято! Ми зв'яжемося з вами найближчим часом.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
