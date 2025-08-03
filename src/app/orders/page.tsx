'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
    _id: string;
    orderId?: number;
    type: 'product' | 'cake';
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryDate: string;
    status: string;

    // User association fields
    userId?: string;
    userEmail?: string;
    isGuestOrder?: boolean;

    // Product order fields
    productId?: string;
    productName?: string;
    productPrice?: number;
    productUnit?: string;
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

export default function MyOrders() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/auth/signin');
            return;
        }

        fetchMyOrders();
    }, [session, status, router]);

    const fetchMyOrders = async () => {
        try {
            const response = await fetch('/api/orders?userOnly=true');
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
            case 'pending': return 'Очікує підтвердження';
            case 'confirmed': return 'Підтверджено';
            case 'in-progress': return 'Готується';
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

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>На головну</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <h1 className="text-3xl font-bold text-gray-900">Мої замовлення</h1>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Тут ви можете переглянути всі ваші замовлення та відслідковувати їх статус
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                У вас поки немає замовлень
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Зробіть ваше перше замовлення в нашому каталозі
                            </p>
                            <Link
                                href="/catalog"
                                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Переглянути каталог
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    {/* Order Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                        <div className="mb-2 sm:mb-0">
                                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                Замовлення #{order.orderId || order._id.slice(-6)}
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {order.type === 'product' ? '🛒 Товар' : '🎂 Індивідуальний торт'}
                                                </span>
                                            </h3>
                                        </div>
                                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Product/Cake Information */}
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-900 flex items-center">
                                                {order.type === 'product' ? (
                                                    <>
                                                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                        Товар з каталогу
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        Індивідуальний торт
                                                    </>
                                                )}
                                            </h4>
                                            {order.type === 'product' ? (
                                                <>
                                                    <p className="text-gray-900 font-medium">{order.productName}</p>
                                                    <p className="text-sm text-gray-600">⚖️ {formatWeightDisplay(order.weight || 0, order.productUnit)}</p>
                                                    <p className="text-sm text-gray-600">💰 Ціна за {order.productUnit === 'piece' ? 'шт' : 'кг'}: {order.productPrice} ₴</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-gray-900 font-medium">{order.cakeType}</p>
                                                    {order.size && <p className="text-sm text-gray-600">📏 Розмір: {order.size}</p>}
                                                </>
                                            )}
                                        </div>

                                        {/* Delivery Information */}
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-900 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            {order.deliveryAddress && (
                                                <p className="text-sm text-gray-600">📍 {order.deliveryAddress}</p>
                                            )}
                                        </div>

                                        {/* Price Information */}
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-900 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                                Вартість
                                            </h4>
                                            <p className="text-xl font-bold text-green-600">
                                                {(order.totalAmount || order.totalPrice || 0)} ₴
                                            </p>
                                            {order.paymentMethod && (
                                                <p className="text-sm text-gray-600">
                                                    💳 {order.paymentMethod === 'cash' ? 'Готівка' : order.paymentMethod === 'card' ? 'Картка' : 'Переказ'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Special Requests / Description */}
                                    {(order.specialRequests || order.description) && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                {order.type === 'product' ? 'Особливі побажання' : 'Опис замовлення'}
                                            </h4>
                                            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">
                                                {order.specialRequests || order.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Status-specific actions or info */}
                                    {order.status === 'pending' && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center text-yellow-600 text-sm">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Ваше замовлення очікує підтвердження. Ми зв&apos;яжемося з вами найближчим часом.
                                            </div>
                                        </div>
                                    )}

                                    {order.status === 'confirmed' && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center text-blue-600 text-sm">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Замовлення підтверджено! Ми почнемо роботу найближчим часом.
                                            </div>
                                        </div>
                                    )}

                                    {order.status === 'in-progress' && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center text-purple-600 text-sm">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                </svg>
                                                Ваше замовлення готується. Очікуйте повідомлення про готовність!
                                            </div>
                                        </div>
                                    )}

                                    {order.status === 'completed' && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center text-green-600 text-sm">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Замовлення успішно завершено! Дякуємо за довіру до Shy Cakes! 💖
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Call to Action */}
                {orders.length > 0 && (
                    <div className="mt-12 text-center">
                        <div className="bg-pink-50 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Хочете замовити ще щось смачненьке?
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Переглядайте наш каталог та створюйте нові замовлення
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/catalog"
                                    className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Каталог товарів
                                </Link>
                                <Link
                                    href="/order"
                                    className="inline-flex items-center px-4 py-2 bg-white text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    Індивідуальне замовлення
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
