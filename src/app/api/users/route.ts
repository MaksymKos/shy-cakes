import { NextRequest, NextResponse } from 'next/server';
import { 
  createUser, 
  findUserByEmail, 
  getAllUsers
} from '@/api/db/operations';
import { CreateUser } from '@/types/database';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const users = await getAllUsers();
    const usersWithoutPasswords = users.map(({ password: _, ...user }) => user);
    return NextResponse.json(usersWithoutPasswords);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { email, name, password, role = 'user', phone }: CreateUser = body;
    
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData: CreateUser = {
      email,
      name,
      password: hashedPassword,
      role: role as 'user' | 'admin',
      phone
    };

    const result = await createUser(userData);
    
    if (!result.insertedId) {
      throw new Error('Failed to create user');
    }

    const { password: _, ...userWithoutPassword } = {
      _id: result.insertedId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json(userWithoutPassword, { status: 201 });
    
  } catch {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
