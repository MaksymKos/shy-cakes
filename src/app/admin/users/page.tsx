'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error('Помилка завантаження користувачів');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Помилка завантаження користувачів');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
        toast.success('Роль користувача оновлено');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Помилка оновлення ролі користувача');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Помилка оновлення ролі користувача');
    }
  };

  const deleteUser = async (userId: string) => {
    // Показуємо попередження через toast
    toast.warning('Натисніть ще раз для підтвердження видалення', {
      onClick: () => confirmDeleteUser(userId),
      autoClose: 5000,
    });
  };

  const confirmDeleteUser = async (userId: string) => {

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
        toast.success('Користувача видалено');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Помилка видалення користувача');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Помилка видалення користувача');
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  const getRoleText = (role: string) => {
    return role === 'admin' ? 'Адміністратор' : 'Користувач';
  };

  const filteredUsers = filter === 'all'
    ? users
    : users.filter(user => user.role === filter);

  if (status === 'loading' || loading) {
    return <div className="p-8">Завантаження...</div>;
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Назад до панелі</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900">Управління користувачами</h1>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border'
                }`}
            >
              Всі ({users.length})
            </button>
            <button
              onClick={() => setFilter('user')}
              className={`px-4 py-2 rounded ${filter === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border'
                }`}
            >
              Користувачі ({users.filter(u => u.role === 'user').length})
            </button>
            <button
              onClick={() => setFilter('admin')}
              className={`px-4 py-2 rounded ${filter === 'admin'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border'
                }`}
            >
              Адміністратори ({users.filter(u => u.role === 'admin').length})
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Список користувачів</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Користувач
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Телефон
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Роль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата реєстрації
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user._id.slice(-6)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('uk-UA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {user.role === 'user' ? (
                          <button
                            onClick={() => updateUserRole(user._id, 'admin')}
                            className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700"
                            disabled={user._id === session?.user?.id}
                          >
                            Зробити адміном
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserRole(user._id, 'user')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                            disabled={user._id === session?.user?.id}
                          >
                            Зробити користувачем
                          </button>
                        )}

                        <button
                          onClick={() => deleteUser(user._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          disabled={user._id === session?.user?.id}
                        >
                          Видалити
                        </button>
                      </div>

                      {user._id === session?.user?.id && (
                        <div className="text-xs text-gray-500 mt-1">
                          (Це ваш акаунт)
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Немає користувачів для відображення
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
