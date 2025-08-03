'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';

interface OrderFormData {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    deliveryDate: string;
    specialRequests: string;
    paymentMethod: 'cash' | 'card' | 'transfer';
}

export default function CartPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
    const [submitting, setSubmitting] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);

    const [formData, setFormData] = useState<OrderFormData>({
        customerName: session?.user?.name || '',
        customerPhone: (session?.user as { phone?: string })?.phone || '',
        customerEmail: session?.user?.email || '',
        deliveryAddress: (session?.user as { shippingInfo?: { address?: string } })?.shippingInfo?.address || '',
        deliveryDate: '',
        specialRequests: '',
        paymentMethod: 'cash'
    });

    const formatPrice = (price: number, unit: 'kg' | 'piece' = 'kg') => {
        const unitText = unit === 'kg' ? '/ кг' : '/ шт';
        return `${Math.round(price)} ₴ ${unitText}`;
    };

    const formatQuantity = (quantity: number, unit: 'kg' | 'piece') => {
        if (unit === 'kg') {
            return `${quantity} кг`;
        } else {
            return `${quantity} шт`;
        }
    };

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const handleQuantityChange = (productId: string, newQuantity: number, unit: 'kg' | 'piece') => {
        const minQuantity = unit === 'kg' ? 0.5 : 1;
        const maxQuantity = unit === 'kg' ? 20 : 100;

        if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Create orders for each item in cart
            for (const item of items) {
                const orderData = {
                    ...formData,
                    productId: item.productId,
                    productName: item.productName,
                    productPrice: item.productPrice,
                    productUnit: item.productUnit,
                    weight: item.quantity,
                    totalAmount: Math.round(item.productPrice * item.quantity),
                    orderDate: new Date().toISOString()
                };

                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Помилка при створенні замовлення');
                }
            }

            // Clear cart and redirect
            clearCart();
            alert(`Всі замовлення успішно відправлені!\nЗагальна сума: ${Math.round(getTotalPrice())} ₴\nМи зв'яжемося з вами найближчим часом.`);
            router.push('/orders');
        } catch (error) {
            console.error('Error submitting orders:', error);
            alert('Помилка при оформленні замовлень. Спробуйте ще раз.');
        } finally {
            setSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="">
                <PageBannerSimple
                    currentPage='Кошик'
                    title='Ваш кошик порожній'
                    text='Додайте товари до кошика, щоб оформити замовлення'
                    image="/images/cataloge-banner.jpg"
                />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ваш кошик порожній</h2>
                        <p className="text-gray-600 mb-8">Переглядайте наш каталог та додавайте улюблені товари до кошика</p>
                        <Link
                            href="/catalog"
                            className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Перейти до каталогу
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (showCheckout) {
        return (
            <div className="">
                <PageBannerSimple
                    currentPage='Оформлення замовлення'
                    title='Оформлення замовлення'
                    text='Заповніть форму для оформлення всіх товарів з кошика'
                    image="/images/cataloge-banner.jpg"
                />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ваше замовлення</h2>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex items-center space-x-4 py-2 border-b border-gray-200">
                                        {item.productImage && (
                                            <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.productName}</h3>
                                            <p className="text-sm text-gray-600">
                                                {formatQuantity(item.quantity, item.productUnit)} × {formatPrice(item.productPrice, item.productUnit)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {Math.round(item.productPrice * item.quantity)} ₴
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Загальна сума:</span>
                                        <span className="text-pink-600">{Math.round(getTotalPrice())} ₴</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Form */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Дані для доставки</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Повне ім&apos;я *
                                        </label>
                                        <input
                                            type="text"
                                            id="customerName"
                                            name="customerName"
                                            required
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="Ваше повне ім'я"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Телефон *
                                        </label>
                                        <input
                                            type="tel"
                                            id="customerPhone"
                                            name="customerPhone"
                                            required
                                            value={formData.customerPhone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="+380 XX XXX XX XX"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="customerEmail"
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                                            Дата доставки *
                                        </label>
                                        <input
                                            type="date"
                                            id="deliveryDate"
                                            name="deliveryDate"
                                            required
                                            min={getMinDate()}
                                            value={formData.deliveryDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                            Адреса доставки *
                                        </label>
                                        <input
                                            type="text"
                                            id="deliveryAddress"
                                            name="deliveryAddress"
                                            required
                                            value={formData.deliveryAddress}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="вул. Хрещатик, буд. 1, кв. 5"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                                            Спосіб оплати *
                                        </label>
                                        <select
                                            id="paymentMethod"
                                            name="paymentMethod"
                                            required
                                            value={formData.paymentMethod}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        >
                                            <option value="cash">Готівка при доставці</option>
                                            <option value="card">Картою при доставці</option>
                                            <option value="transfer">Банківський переказ</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                                            Додаткові побажання
                                        </label>
                                        <textarea
                                            id="specialRequests"
                                            name="specialRequests"
                                            rows={3}
                                            value={formData.specialRequests}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="Додаткові побажання або коментарі до замовлення"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowCheckout(false)}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Назад до кошика
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-400 transition-colors"
                                    >
                                        {submitting ? 'Оформлення...' : 'Оформити замовлення'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <PageBannerSimple
                currentPage='Кошик'
                title='Кошик для покупок'
                text='Переглядайте та редагуйте ваші товари перед оформленням замовлення'
                image="/images/cataloge-banner.jpg"
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Ваш кошик ({items.length} товар{items.length > 1 ? 'и' : ''})
                            </h2>
                            <button
                                onClick={clearCart}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                                Очистити кошик
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <div key={item.productId} className="p-6">
                                <div className="flex items-center space-x-4">
                                    {item.productImage && (
                                        <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                                            <Image
                                                src={item.productImage}
                                                alt={item.productName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900">{item.productName}</h3>
                                        <p className="text-gray-600">{formatPrice(item.productPrice, item.productUnit)}</p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleQuantityChange(
                                                    item.productId,
                                                    item.quantity - (item.productUnit === 'kg' ? 0.5 : 1),
                                                    item.productUnit
                                                )}
                                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>

                                            <div className="text-center min-w-[80px]">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.productId, parseFloat(e.target.value) || 0, item.productUnit)}
                                                    min={item.productUnit === 'kg' ? 0.5 : 1}
                                                    max={item.productUnit === 'kg' ? 20 : 100}
                                                    step={item.productUnit === 'kg' ? 0.5 : 1}
                                                    className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {item.productUnit === 'kg' ? 'кг' : 'шт'}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleQuantityChange(
                                                    item.productId,
                                                    item.quantity + (item.productUnit === 'kg' ? 0.5 : 1),
                                                    item.productUnit
                                                )}
                                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right min-w-[100px]">
                                            <p className="text-lg font-semibold text-gray-900">
                                                {Math.round(item.productPrice * item.quantity)} ₴
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="text-red-600 hover:text-red-700 p-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-medium text-gray-900">
                                Загальна сума: <span className="text-pink-600">{Math.round(getTotalPrice())} ₴</span>
                            </div>
                            <div className="flex gap-4">
                                <Link
                                    href="/catalog"
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Продовжити покупки
                                </Link>
                                <button
                                    onClick={() => setShowCheckout(true)}
                                    className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                                >
                                    Оформити замовлення
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
