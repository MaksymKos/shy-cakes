'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Чекаємо завантаження сесії

    // Додаткова затримка для надійності
    const timer = setTimeout(() => {
      if (status === 'unauthenticated' || !session) {
        router.push('/auth/signin');
        return;
      }

      // Перевіряємо роль тільки після того, як сесія точно завантажена
      if (session && (session.user as { role?: string })?.role !== 'admin') {
        router.push('/auth/signin');
        return;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  // Якщо не авторизований або не адмін - не показуємо нічого (useEffect перенаправить)
  if (status === 'unauthenticated' || !session || (session.user as { role?: string })?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Перевірка доступу...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Адмін панель</h1>

        <div className="space-y-4">
          {/* Управління товарами */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Товари</h2>
              <p className="text-gray-600">Додавання та редагування товарів</p>
            </div>
            <button
              onClick={() => router.push('/admin/products')}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors cursor-pointer"
            >
              Управляти товарами
            </button>
          </div>

          {/* Управління замовленнями */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Замовлення</h2>
              <p className="text-gray-600">Перегляд та обробка замовлень</p>
            </div>
            <button
              onClick={() => router.push('/admin/orders')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Переглянути замовлення
            </button>
          </div>

          {/* Управління користувачами */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Користувачі</h2>
              <p className="text-gray-600">Управління користувачами</p>
            </div>
            <button
              onClick={() => router.push('/admin/users')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
            >
              Управляти користувачами
            </button>
          </div>

          {/* Управління портфоліо */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Портфоліо</h2>
              <p className="text-gray-600">Додавання робіт до портфоліо</p>
            </div>
            <button
              onClick={() => router.push('/admin/portfolio')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Управляти портфоліо
            </button>
          </div>

          {/* Управління відгуками */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Відгуки</h2>
              <p className="text-gray-600">Відгуки з фотографіями тортів та описами</p>
            </div>
            <button
              onClick={() => router.push('/admin/photo-reviews')}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors cursor-pointer"
            >
              Управляти відгуками
            </button>
          </div>

          {/* Управління FAQ */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">FAQ</h2>
              <p className="text-gray-600">Редагування питань та відповідей</p>
            </div>
            <button
              onClick={() => router.push('/admin/faq')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Управляти FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
