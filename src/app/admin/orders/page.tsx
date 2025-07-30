'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  cakeType: string;
  size: string;
  description: string;
  deliveryDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function AdminOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Очікує';
      case 'confirmed': return 'Підтверджено';
      case 'in-progress': return 'В роботі';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Скасовано';
      default: return status;
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

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
          <h1 className="text-3xl font-bold text-gray-900">Управління замовленнями</h1>
          <button
            onClick={() => router.push('/admin')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Назад до панелі
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Всі ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded ${
                filter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Очікують ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded ${
                filter === 'confirmed' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Підтверджені ({orders.filter(o => o.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded ${
                filter === 'in-progress' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              В роботі ({orders.filter(o => o.status === 'in-progress').length})
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Замовлення</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Замовлення #{order._id.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Клієнт</h4>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerEmail}</p>
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Торт</h4>
                    <p className="text-sm text-gray-600">{order.cakeType}</p>
                    <p className="text-sm text-gray-600">Розмір: {order.size}</p>
                    <p className="text-sm text-gray-600">Доставка: {new Date(order.deliveryDate).toLocaleDateString('uk-UA')}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Ціна</h4>
                    <p className="text-lg font-semibold text-gray-900">{order.totalPrice} грн</p>
                  </div>
                </div>

                {order.description && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Опис</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {order.description}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order._id, 'confirmed')}
                        className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                      >
                        Підтвердити
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                      >
                        Скасувати
                      </button>
                    </>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'in-progress')}
                      className="bg-purple-600 text-white px-3 py-1 text-sm rounded hover:bg-purple-700"
                    >
                      Почати роботу
                    </button>
                  )}
                  
                  {order.status === 'in-progress' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'completed')}
                      className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                    >
                      Завершити
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Немає замовлень для відображення
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
