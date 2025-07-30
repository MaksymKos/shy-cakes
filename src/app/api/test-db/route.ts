import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, getCollection } from '@/api/db/operations';
import { User } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Тестуємо підключення до бази даних...');
    
    // Тест підключення до бази
    const db = await getDatabase();
    console.log('✅ База даних:', db.databaseName);
    
    // Тест отримання колекції
    const users = await getCollection('users');
    console.log('✅ Колекція users отримана');
    
    // Рахуємо користувачів
    const userCount = await users.countDocuments();
    console.log('📊 Кількість користувачів:', userCount);
    
    // Отримуємо список всіх користувачів
    const allUsers = await users.find({}).toArray();
    console.log('👥 Користувачі:', allUsers.map((u: User) => ({ id: u._id, email: u.email, name: u.name })));
    
    // Тест запису - створюємо тестового користувача
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Перевіряємо чи тестовий користувач вже існує
    const existingTestUser = await users.findOne({ email: testUser.email });
    if (!existingTestUser) {
      const insertResult = await users.insertOne(testUser);
      console.log('✅ Тестовий користувач створений:', insertResult.insertedId);
    } else {
      console.log('ℹ️ Тестовий користувач вже існує:', existingTestUser._id);
    }
    
    // Тест читання
    const foundTestUser = await users.findOne({ email: testUser.email });
    console.log('🔍 Знайдений тестовий користувач:', foundTestUser ? 'ТАК' : 'НІ');
    
    return NextResponse.json({
      success: true,
      database: db.databaseName,
      userCount,
      users: allUsers.map((u: User) => ({ id: u._id, email: u.email, name: u.name })),
      testUserExists: !!foundTestUser,
      message: 'Підключення до бази даних працює коректно'
    });
    
  } catch (error) {
    console.error('❌ Помилка тестування бази даних:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Невідома помилка',
      message: 'Помилка підключення до бази даних'
    }, { status: 500 });
  }
}
