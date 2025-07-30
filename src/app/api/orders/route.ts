import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/api/db/operations';

export async function GET() {
  try {
    const db = await getDatabase();
    const orders = await db.collection('orders')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
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
      cakeType, 
      size, 
      description, 
      deliveryDate, 
      totalPrice 
    } = body;
    
    if (!customerName || !customerEmail || !cakeType || !deliveryDate) {
      return NextResponse.json(
        { error: 'Customer name, email, cake type, and delivery date are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const orderData = {
      customerName,
      customerEmail,
      customerPhone,
      cakeType,
      size,
      description,
      deliveryDate: new Date(deliveryDate),
      totalPrice: parseFloat(totalPrice) || 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(orderData);
    
    return NextResponse.json({ 
      ...orderData, 
      _id: result.insertedId 
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
