'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Cake {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  available: boolean;
  createdAt: string;
}

export default function AdminCakes() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCake, setNewCake] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    fetchCakes();
  }, [session, status, router]);

  const fetchCakes = async () => {
    try {
      const response = await fetch('/api/cakes');
      if (response.ok) {
        const data = await response.json();
        setCakes(data);
      }
    } catch (error) {
      console.error('Error fetching cakes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/cakes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCake,
          price: parseFloat(newCake.price),
          images: []
        }),
      });

      if (response.ok) {
        setNewCake({ name: '', description: '', price: '', category: '', available: true });
        setShowAddForm(false);
        fetchCakes();
      }
    } catch (error) {
      console.error('Error adding cake:', error);
    }
  };

  const toggleCakeAvailability = async (cakeId: string, available: boolean) => {
    try {
      const response = await fetch(`/api/cakes/${cakeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: !available }),
      });

      if (response.ok) {
        fetchCakes();
      }
    } catch (error) {
      console.error('Error updating cake:', error);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Управління тортами</h1>
          <button
            onClick={() => router.push('/admin')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Назад до панелі
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          >
            {showAddForm ? 'Скасувати' : 'Додати торт'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Додати новий торт</h2>
            <form onSubmit={handleAddCake} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Назва торта
                </label>
                <input
                  type="text"
                  required
                  value={newCake.name}
                  onChange={(e) => setNewCake({ ...newCake, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Опис
                </label>
                <textarea
                  required
                  value={newCake.description}
                  onChange={(e) => setNewCake({ ...newCake, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ціна (грн)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newCake.price}
                    onChange={(e) => setNewCake({ ...newCake, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Категорія
                  </label>
                  <select
                    required
                    value={newCake.category}
                    onChange={(e) => setNewCake({ ...newCake, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Оберіть категорію</option>
                    <option value="весільні">Весільні</option>
                    <option value="дитячі">Дитячі</option>
                    <option value="святкові">Святкові</option>
                    <option value="корпоративні">Корпоративні</option>
                    <option value="класичні">Класичні</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newCake.available}
                  onChange={(e) => setNewCake({ ...newCake, available: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Доступний для замовлення</label>
              </div>
              
              <button
                type="submit"
                className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
              >
                Додати торт
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Список тортів</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Назва
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категорія
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ціна
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cakes.map((cake) => (
                  <tr key={cake._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cake.name}</div>
                        <div className="text-sm text-gray-500">{cake.description.substring(0, 50)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cake.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cake.price} грн
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cake.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cake.available ? 'Доступний' : 'Недоступний'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => toggleCakeAvailability(cake._id, cake.available)}
                        className={`mr-2 px-3 py-1 rounded text-xs ${
                          cake.available
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {cake.available ? 'Приховати' : 'Показати'}
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Редагувати
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
