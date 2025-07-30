'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="p-8">Завантаження...</div>;
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Адмін панель</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Управління тортами */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Торти</h2>
            <p className="text-gray-600 mb-4">Додавання та редагування тортів</p>
            <button 
              onClick={() => router.push('/admin/cakes')}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
            >
              Управляти тортами
            </button>
          </div>

          {/* Управління замовленнями */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Замовлення</h2>
            <p className="text-gray-600 mb-4">Перегляд та обробка замовлень</p>
            <button 
              onClick={() => router.push('/admin/orders')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Переглянути замовлення
            </button>
          </div>

          {/* Управління користувачами */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Користувачі</h2>
            <p className="text-gray-600 mb-4">Управління користувачами</p>
            <button 
              onClick={() => router.push('/admin/users')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Управляти користувачами
            </button>
          </div>

          {/* Управління портфоліо */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Портфоліо</h2>
            <p className="text-gray-600 mb-4">Додавання робіт до портфоліо</p>
            <button 
              onClick={() => router.push('/admin/portfolio')}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Управляти портфоліо
            </button>
          </div>

          {/* Управління відгуками */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Відгуки</h2>
            <p className="text-gray-600 mb-4">Модерація відгуків</p>
            <button 
              onClick={() => router.push('/admin/reviews')}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Модерувати відгуки
            </button>
          </div>

          {/* Повідомлення */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Повідомлення</h2>
            <p className="text-gray-600 mb-4">Контактні повідомлення</p>
            <button 
              onClick={() => router.push('/admin/messages')}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Переглянути повідомлення
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
