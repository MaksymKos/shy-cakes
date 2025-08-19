'use client';

import Loader from '@/components/Loader/Loader';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const menu = [
    { name: 'Товари', path: '/admin/products', color: 'pink' },
    { name: 'Замовлення', path: '/admin/orders', color: 'blue' },
    { name: 'Користувачі', path: '/admin/users', color: 'green' },
    { name: 'Портфоліо', path: '/admin/portfolio', color: 'purple' },
    { name: 'Відгуки', path: '/admin/photo-reviews', color: 'amber' },
    { name: 'FAQ', path: '/admin/faq', color: 'indigo' },
    { name: 'Категорії', path: '/admin/categories', color: 'red' }
  ]

  useEffect(() => {
    if (status === 'loading') return;

    const timer = setTimeout(() => {
      if (status === 'unauthenticated' || !session) {
        router.push('/auth/signin');
        return;
      }

      if (session && (session.user as { role?: string })?.role !== 'admin') {
        router.push('/auth/signin');
        return;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <Loader text='Завантаження...' />
    );
  }

  if (status === 'unauthenticated' || !session || (session.user as { role?: string })?.role !== 'admin') {
    return (
      <Loader text='Завантаження адмін панелі...' />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Адмін панель</h1>

        <div className="space-y-4">
          {menu.map((item) => (
            <div key={item.name} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              </div>
              <button
                onClick={() => router.push(item.path)}
                className={`bg-${item.color}-600 text-white px-6 py-3 rounded-lg hover:bg-${item.color}-700 transition-colors cursor-pointer`}
              >
                Управляти
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
