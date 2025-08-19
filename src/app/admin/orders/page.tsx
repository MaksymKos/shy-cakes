'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import Loader from '@/components/Loader/Loader';

interface Order {
  _id: string;
  type: 'product' | 'cake' | 'custom';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  deliveryDate: string;
  deliveryTime?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;

  // User association fields
  userId?: string; // ID of the logged-in user who placed the order
  userEmail?: string; // Email of the user for quick reference
  isGuestOrder?: boolean; // Whether this is a guest order or from logged-in user

  // Product order fields
  productId?: string;
  productName?: string;
  productPrice?: number;
  productUnit?: string; // Added productUnit field
  weight?: number;
  specialRequests?: string;
  paymentMethod?: string;
  totalAmount?: number;
  referenceImages?: string[]; // Add reference images field
  reviewReference?: {
    reviewId: string;
    cakeName: string;
  };

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
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updating, setUpdating] = useState(false);

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
      } else {
        toast.error('Помилка завантаження замовлень');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Помилка завантаження замовлень');
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
      } else {
        const error = await response.json();
        toast.error(error.error || 'Помилка оновлення статусу замовлення');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Помилка оновлення статусу замовлення');
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowEditModal(true);
  };

  const handleUpdateOrder = async (updatedData: Partial<Order>) => {
    if (!editingOrder) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${editingOrder._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditingOrder(null);
        fetchOrders();
        toast.success('Замовлення успішно оновлено');
      } else {
        toast.error('Помилка оновлення замовлення');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Помилка оновлення замовлення');
    } finally {
      setUpdating(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-[#90e0ef]/20 text-[#023e8a]';
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
    : filter === 'users'
      ? orders.filter(order => !order.isGuestOrder)
      : filter === 'guests'
        ? orders.filter(order => order.isGuestOrder)
        : orders.filter(order => order.status === filter);

  if (status === 'loading' || loading) {
    return <Loader text='Завантаження...' />;
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminHeader title="Управління замовленнями" />

        {showEditModal && editingOrder && (
          <EditOrderModal
            order={editingOrder}
            onSave={handleUpdateOrder}
            onClose={closeEditModal}
            isUpdating={updating}
          />
        )}

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
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
                ? 'bg-[#48cae4] text-white'
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

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('users')}
              className={`px-4 py-2 rounded ${filter === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
                } transition-colors`}
            >
              👤 Від користувачів ({orders.filter(o => !o.isGuestOrder).length})
            </button>
            <button
              onClick={() => setFilter('guests')}
              className={`px-4 py-2 rounded ${filter === 'guests'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
                } transition-colors`}
            >
              🤝 Від гостей ({orders.filter(o => o.isGuestOrder).length})
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
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.type === 'product'
                        ? 'bg-blue-100 text-blue-800'
                        : order.type === 'custom'
                          ? 'bg-[#90e0ef]/20 text-[#023e8a]'
                          : 'bg-[#90e0ef]/20 text-[#023e8a]'
                        }`}>
                        {order.type === 'product'
                          ? '🛒 Товар з каталогу'
                          : order.type === 'custom'
                            ? '🎨 Індивідуальне замовлення'
                            : '🎂 Індивідуальний торт'
                        }
                      </span>
                    </div>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Клієнт
                      {order.isGuestOrder ? (
                        <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          Гість
                        </span>
                      ) : (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Користувач
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 font-medium">{order.customerName}</p>
                    {order.customerEmail && (
                      <p className="text-sm text-gray-600">📧 {order.customerEmail}</p>
                    )}
                    <p className="text-sm text-gray-600">📞 {order.customerPhone}</p>
                    {order.userId && (
                      <p className="text-xs text-gray-500 mt-1">👤 ID: {order.userId.slice(-6)}</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      {order.type === 'product' ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          Товар
                        </>
                      ) : order.type === 'custom' ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Індивідуальне замовлення
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
                    ) : order.type === 'custom' ? (
                      <>
                        <p className="text-sm text-gray-600 font-medium">Індивідуальне замовлення</p>
                        <p className="text-sm text-gray-600">🎨 Замовлення за власним дизайном</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 font-medium">{order.cakeType}</p>
                        {order.size && <p className="text-sm text-gray-600">📏 Розмір: {order.size}</p>}
                      </>
                    )}
                  </div>

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

                {(order.specialRequests || order.description) && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {order.type === 'product' ? 'Особливі побажання' : order.type === 'custom' ? 'Опис замовлення' : 'Опис замовлення'}
                    </h4>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                      {order.specialRequests || order.description}
                    </p>
                  </div>
                )}

                {order.referenceImages && order.referenceImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Референсні зображення ({order.referenceImages.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {order.referenceImages
                        .filter(imageUrl => imageUrl && imageUrl.trim() !== '')
                        .map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <div
                              className="relative w-full h-30 rounded border overflow-hidden bg-gray-100 cursor-pointer"
                              onClick={() => window.open(imageUrl, '_blank')}
                            >
                              <Image
                                src={imageUrl}
                                alt={`Референс ${index + 1}`}
                                fill
                                className="absolute inset-0 w-full h-full object-cover hover:opacity-90 transition-opacity"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Референс на відгук */}
                {order.reviewReference && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
                      </svg>
                      🍰 Замовлення на основі відгуку
                    </h4>
                    <div className="bg-[#90e0ef]/10 border border-[#90e0ef]/30 p-3 rounded">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Торт з відгуку:</span>
                          <p className="font-semibold text-gray-900">{order.reviewReference.cakeName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Посилання на відгук:</span>
                          <a
                            href={`/reviews?open=${order.reviewReference.reviewId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center text-sm text-[#48cae4] hover:text-[#023e8a] underline"
                          >
                            Переглянути оригінальний відгук
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
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

                  <button
                    onClick={() => handleEditOrder(order)}
                    className="bg-gray-600 text-white px-3 py-1 text-sm rounded hover:bg-gray-700 transition-colors"
                  >
                    ✏️ Редагувати
                  </button>

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
                        className="bg-[#48cae4] text-white px-3 py-1 text-sm rounded hover:bg-[#023e8a] transition-colors"
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

// Edit Order Modal Component
interface EditOrderModalProps {
  order: Order;
  onSave: (updatedData: Partial<Order>) => void;
  onClose: () => void;
  isUpdating: boolean;
}

function EditOrderModal({ order, onSave, onClose, isUpdating }: EditOrderModalProps) {
  const [formData, setFormData] = useState({
    customerName: order.customerName,
    customerEmail: order.customerEmail || '',
    customerPhone: order.customerPhone,
    deliveryAddress: order.deliveryAddress || '',
    deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : '',
    deliveryTime: order.deliveryTime || '',
    weight: order.weight || 0,
    specialRequests: order.specialRequests || '',
    paymentMethod: order.paymentMethod || 'cash',
    totalAmount: order.totalAmount || order.totalPrice || 0,
    productName: order.productName || '',
    productPrice: order.productPrice || 0,
    cakeType: order.cakeType || '',
    size: order.size || '',
    description: order.description || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' || name === 'totalAmount' || name === 'productPrice'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData: Partial<Order> = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      deliveryAddress: formData.deliveryAddress,
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      specialRequests: formData.specialRequests,
      paymentMethod: formData.paymentMethod as 'cash' | 'card' | 'transfer',
    };

    if (order.type === 'product') {
      updatedData.weight = formData.weight;
      updatedData.totalAmount = formData.totalAmount;
      updatedData.productName = formData.productName;
      updatedData.productPrice = formData.productPrice;
    } else {
      updatedData.cakeType = formData.cakeType;
      updatedData.size = formData.size;
      updatedData.description = formData.description;
      updatedData.totalPrice = formData.totalAmount;
    }

    onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Редагувати замовлення #{order._id.slice(-6)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Інформація про клієнта</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ім&apos;я клієнта *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Спосіб оплати</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cash">Готівка</option>
                  <option value="card">Картка</option>
                  <option value="transfer">Переказ</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Доставка</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адреса доставки</label>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата доставки *</label>
                <input
                  type="date"
                  name="deliveryDate"
                  required
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Час доставки</label>
                <input
                  type="time"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {order.type === 'product' ? 'Інформація про товар' : 'Інформація про торт'}
            </h3>
            {order.type === 'product' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Назва товару</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {order.productUnit === 'piece' ? 'Кількість (шт)' : 'Вага (кг)'}
                  </label>
                  <input
                    type="number"
                    name="weight"
                    step="0.1"
                    min="0"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ціна за {order.productUnit === 'piece' ? 'шт' : 'кг'} (₴)
                  </label>
                  <input
                    type="number"
                    name="productPrice"
                    step="0.01"
                    min="0"
                    value={formData.productPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Загальна сума (₴)</label>
                  <input
                    type="number"
                    name="totalAmount"
                    step="0.01"
                    min="0"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Тип торта</label>
                  <input
                    type="text"
                    name="cakeType"
                    value={formData.cakeType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Розмір</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Загальна сума (₴)</label>
                  <input
                    type="number"
                    name="totalAmount"
                    step="0.01"
                    min="0"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {order.type === 'product' ? 'Особливі побажання' : 'Опис замовлення'}
            </label>
            <textarea
              name={order.type === 'product' ? 'specialRequests' : 'description'}
              value={order.type === 'product' ? formData.specialRequests : formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Оновлення...
                </>
              ) : (
                '💾 Зберегти зміни'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
