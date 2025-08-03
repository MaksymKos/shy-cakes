import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/api/db/operations";

export async function GET() {
    try {
        const db = await getDatabase();
        const orders = await db
            .collection("orders")
            .find({})
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
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            deliveryAddress,
            deliveryDate,
            deliveryTime,
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

        // Create order data based on type
        let orderData;

        if (productId) {
            // Product order
            orderData = {
                type: "product",
                customerName,
                customerEmail,
                customerPhone,
                deliveryAddress,
                deliveryDate: new Date(deliveryDate),
                deliveryTime,
                weight: parseFloat(weight),
                specialRequests,
                paymentMethod,
                productId,
                productName,
                productPrice: parseFloat(productPrice),
                productUnit,
                totalAmount: parseFloat(totalAmount),
                status: "pending",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        } else {
            // Legacy cake order
            orderData = {
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
