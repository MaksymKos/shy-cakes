import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/api/db/operations';
import { validateCreateUser, ValidationError } from '@/utils/validation';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = validateCreateUser(body);
    
    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Користувач з таким email вже існує' },
        { status: 409 }
      );
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    const userData = {
      ...validatedData,
      password: hashedPassword
    };

    const result = await createUser(userData);
    
    if (!result.insertedId) {
      throw new Error('Не вдалося створити користувача');
    }

    const { password: userPassword, ...userWithoutPassword } = {
      _id: result.insertedId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json(
      { 
        message: 'Користувач успішно створений',
        user: userWithoutPassword 
      }, 
      { status: 201 }
    );
    
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
