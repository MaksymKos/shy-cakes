import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/api/db/operations';

export async function GET() {
  try {
    const db = await getDatabase();
    const cakes = await db.collection('cakes').find({}).toArray();
    
    return NextResponse.json(cakes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cakes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, category, images = [], available = true } = body;
    
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const cakeData = {
      name,
      description,
      price: parseFloat(price),
      category,
      images,
      available,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('cakes').insertOne(cakeData);
    
    return NextResponse.json({ 
      ...cakeData, 
      _id: result.insertedId 
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create cake' },
      { status: 500 }
    );
  }
}
