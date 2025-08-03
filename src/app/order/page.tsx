'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';
import { ProductCategoryValue } from '@/constants/categories';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategoryValue;
    images: string[];
    available: boolean;
    unit: 'kg' | 'piece'; // New field for unit type
    createdAt: string;
}

interface OrderFormData {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    deliveryDate: string;
    deliveryTime: string;
    weight: number;
    specialRequests: string;
    paymentMethod: 'cash' | 'card' | 'transfer';
}

export default function OrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <p className="mt-2 text-gray-600">Завантаження...</p>
                </div>
            </div>
        }>
            <OrderContent />
        </Suspense>
    );
}

function OrderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const productId = searchParams.get('productId');

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<OrderFormData>({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        deliveryAddress: '',
        deliveryDate: '',
        deliveryTime: '',
        weight: 1,
        specialRequests: '',
        paymentMethod: 'cash'
    });

    // Auto-fill form with user's saved information
    useEffect(() => {
        if (status === 'loading') return;

        if (session?.user) {
            const user = session.user as typeof session.user & {
                shippingInfo?: {
                    fullName: string;
                    phone: string;
                    address: string;
                    city: string;
                    postalCode: string;
                    notes: string;
                };
            };

            setFormData(prev => ({
                ...prev,
                customerName: user.name || prev.customerName,
                customerEmail: user.email || prev.customerEmail,
                customerPhone: user.phone || prev.customerPhone,
                deliveryAddress: user.shippingInfo?.address || prev.deliveryAddress,
            }));
        }
    }, [session, status]);

    // Load product if productId is provided
    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/products/${productId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.available) {
                        setProduct(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const formatPrice = (price: number, unit: 'kg' | 'piece' = 'kg') => {
        const unitText = unit === 'kg' ? '/ кг' : '/ шт';
        return `${Math.round(price)} ₴ ${unitText}`;
    };

    const calculateTotal = () => {
        if (!product) return 0;
        return Math.round(product.price * formData.weight);
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
            const orderData = {
                ...formData,
                productId: product?._id,
                productName: product?.name,
                productPrice: product?.price,
                productUnit: product?.unit,
                totalAmount: calculateTotal(),
                orderDate: new Date().toISOString()
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Замовлення успішно відправлено! Номер замовлення: ${result._id}\nМи зв'яжемося з вами найближчим часом.`);
                router.push('/catalog');
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Помилка при створенні замовлення');
            }

        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Помилка при відправці замовлення. Спробуйте ще раз.');
        } finally {
            setSubmitting(false);
        }
    };

    // Get minimum date (tomorrow)
    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <p className="mt-2 text-gray-600">Завантаження...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <PageBannerSimple
                currentPage='Замовлення'
                title='Оформлення замовлення'
                text='Заповніть форму нижче, і ми зв&apos;яжемося з вами для підтвердження деталей замовлення.'
                image="/images/cataloge-banner.jpg"
            />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Product Information */}
                    {product ? (
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Обраний товар</h2>
                            <div className="flex gap-4">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-gray-400 text-2xl">📸</div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{product.category}</p>
                                    <p className="text-pink-600 font-bold text-lg mt-2">
                                        {formatPrice(product.price, product.unit)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Індивідуальне замовлення</h2>
                            <p className="text-gray-600">
                                Заповніть форму нижче для індивідуального замовлення. Ми зв&apos;яжемося з вами для уточнення деталей та ціни.
                            </p>
                        </div>
                    )}

                    {/* Customer Information */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Контактна інформація</h2>
                            {session?.user && (
                                <div className="text-sm text-blue-600">
                                    <a href="/profile" className="hover:text-blue-800 transition-colors">
                                        💾 Зберегти цю інформацію в профілі
                                    </a>
                                </div>
                            )}
                        </div>

                        {session?.user && (session.user as typeof session.user & { shippingInfo?: { address: string } }).shippingInfo && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center text-green-700 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Форма автоматично заповнена з вашого профілю
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ім&apos;я та прізвище *
                                </label>
                                <input
                                    type="text"
                                    id="customerName"
                                    name="customerName"
                                    required
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Введіть ваше ім&apos;я"
                                />
                            </div>

                            <div>
                                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Номер телефону *
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

                            <div className="md:col-span-2">
                                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email (необов&apos;язково)
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
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Деталі замовлення</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                                    {product
                                        ? product.unit === 'kg'
                                            ? 'Вага (кг) *'
                                            : 'Кількість (шт) *'
                                        : 'Приблизна вага (кг)'
                                    }
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    required={!!product}
                                    min={product?.unit === 'piece' ? "1" : "0.5"}
                                    max={product?.unit === 'piece' ? "100" : "20"}
                                    step={product?.unit === 'piece' ? "1" : "0.5"}
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {product
                                        ? product.unit === 'kg'
                                            ? 'Мінімальна вага: 0.5 кг'
                                            : 'Мінімальна кількість: 1 шт'
                                        : 'Орієнтовна вага для розрахунку вартості'
                                    }
                                </p>
                            </div>

                            <div>
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
                                    <option value="cash">Готівка при отриманні</option>
                                    <option value="card">Картка при отриманні</option>
                                    <option value="transfer">Банківський переказ</option>
                                </select>
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

                            <div>
                                <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
                                    Бажаний час доставки
                                </label>
                                <input
                                    type="time"
                                    id="deliveryTime"
                                    name="deliveryTime"
                                    value={formData.deliveryTime}
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
                                    placeholder="Вулиця, номер будинку, квартира"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                                    {product ? 'Особливі побажання' : 'Опис бажаного товару *'}
                                </label>
                                <textarea
                                    id="specialRequests"
                                    name="specialRequests"
                                    rows={product ? 3 : 5}
                                    required={!product}
                                    value={formData.specialRequests}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder={
                                        product
                                            ? "Напишіть особливі побажання щодо оформлення, доставки тощо..."
                                            : "Опишіть детально який торт або десерт ви хочете замовити: тип, розмір, начинка, оформлення, особливі побажання тощо..."
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Підсумок замовлення</h2>
                        {product ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>{product.name} × {formData.weight} {product.unit === 'kg' ? 'кг' : 'шт'}</span>
                                    <span>{formatPrice(product.price, product.unit).replace(/\s*[\/]\s*(кг|шт)/, '')} × {formData.weight}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between text-lg font-semibold text-gray-900">
                                    <span>Загальна сума:</span>
                                    <span className="text-pink-600">{formatPrice(calculateTotal())}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-600">
                                <p className="mb-2">Індивідуальне замовлення</p>
                                <p className="text-sm">Вартість буде розрахована після уточнення деталей</p>
                            </div>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Назад
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-3 px-6 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Відправляємо...
                                </>
                            ) : (
                                <>
                                    🛒 Оформити замовлення
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
