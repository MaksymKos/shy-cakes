'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Order {
  _id: string;
  type: 'product' | 'cake';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  deliveryDate: string;
  deliveryTime?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;

  // Product order fields
  productId?: string;
  productName?: string;
  productPrice?: number;
  productUnit?: string; // Added productUnit field
  weight?: number;
  specialRequests?: string;
  paymentMethod?: string;
  totalAmount?: number;

  // Legacy cake order fields
  cakeType?: string;
  size?: string;
  description?: string;
  totalPrice?: number;
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

  const formatWeightDisplay = (weight: number, unit?: string) => {
    const isKg = !unit || unit === 'kg';
    const unitLabel = isKg ? 'кг' : 'шт';
    const weightLabel = isKg ? 'Вага' : 'Кількість';
    return `${weightLabel}: ${weight} ${unitLabel}`;
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
            <h1 className="text-3xl font-bold text-gray-900">Управління замовленнями</h1>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
                } transition-colors`}
            >
              Всі ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded ${filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
                } transition-colors`}
            >
              Очікують ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded ${filter === 'confirmed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
                } transition-colors`}
            >
              Підтверджені ({orders.filter(o => o.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded ${filter === 'in-progress'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
                } transition-colors`}
            >
              В роботі ({orders.filter(o => o.status === 'in-progress').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded ${filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
                } transition-colors`}
            >
              Завершені ({orders.filter(o => o.status === 'completed').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded ${filter === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
                } transition-colors`}
            >
              Скасовані ({orders.filter(o => o.status === 'cancelled').length})
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
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('uk-UA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                        {order.type === 'product' ? '🛒 Товар з каталогу' : '🎂 Індивідуальний торт'}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Клієнт
                    </h4>
                    <p className="text-sm text-gray-600 font-medium">{order.customerName}</p>
                    {order.customerEmail && (
                      <p className="text-sm text-gray-600">📧 {order.customerEmail}</p>
                    )}
                    <p className="text-sm text-gray-600">📞 {order.customerPhone}</p>
                  </div>

                  {/* Product/Cake Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      {order.type === 'product' ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          Товар
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Торт
                        </>
                      )}
                    </h4>
                    {order.type === 'product' ? (
                      <>
                        <p className="text-sm text-gray-600 font-medium">{order.productName}</p>
                        <p className="text-sm text-gray-600">⚖️ {formatWeightDisplay(order.weight || 0, order.productUnit)}</p>
                        <p className="text-sm text-gray-600">💰 Ціна за {order.productUnit === 'piece' ? 'шт' : 'кг'}: {order.productPrice} ₴</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 font-medium">{order.cakeType}</p>
                        {order.size && <p className="text-sm text-gray-600">📏 Розмір: {order.size}</p>}
                      </>
                    )}
                  </div>

                  {/* Delivery Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Доставка
                    </h4>
                    <p className="text-sm text-gray-600">
                      📅 {new Date(order.deliveryDate).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {order.deliveryTime && (
                      <p className="text-sm text-gray-600">🕐 {order.deliveryTime}</p>
                    )}
                    {order.deliveryAddress && (
                      <p className="text-sm text-gray-600">📍 {order.deliveryAddress}</p>
                    )}
                  </div>

                  {/* Price Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Вартість
                    </h4>
                    <p className="text-lg font-bold text-green-600">
                      {(order.totalAmount || order.totalPrice || 0)} ₴
                    </p>
                    {order.paymentMethod && (
                      <p className="text-sm text-gray-600">💳 {order.paymentMethod}</p>
                    )}
                  </div>
                </div>

                {/* Special Requests / Description */}
                {(order.specialRequests || order.description) && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {order.type === 'product' ? 'Особливі побажання' : 'Опис замовлення'}
                    </h4>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                      {order.specialRequests || order.description}
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Змінити статус:</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Очікує</option>
                      <option value="confirmed">Підтверджено</option>
                      <option value="in-progress">В роботі</option>
                      <option value="completed">Завершено</option>
                      <option value="cancelled">Скасовано</option>
                    </select>
                  </div>

                  {/* Quick action buttons for common workflows */}
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'confirmed')}
                          className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          ✓ Підтвердити
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'cancelled')}
                          className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          ✗ Скасувати
                        </button>
                      </>
                    )}

                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'in-progress')}
                        className="bg-purple-600 text-white px-3 py-1 text-sm rounded hover:bg-purple-700 transition-colors"
                      >
                        🔨 Почати роботу
                      </button>
                    )}

                    {order.status === 'in-progress' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'completed')}
                        className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        ✅ Завершити
                      </button>
                    )}
                  </div>
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
