'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';
import { toast } from 'react-toastify';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
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
    weight: number;
    specialRequests: string;
    paymentMethod: 'cash' | 'card' | 'transfer';
    referenceImages?: string[];
    reviewReference?: {
        reviewId: string;
        cakeName: string;
    };
}

export default function OrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#90e0ef]"></div>
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
    const [uploadingImages, setUploadingImages] = useState(false);
    const [formData, setFormData] = useState<OrderFormData>({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        deliveryAddress: '',
        deliveryDate: '',
        weight: 1,
        specialRequests: '',
        paymentMethod: 'cash',
        referenceImages: []
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
                deliveryAddress: user.shippingInfo?.address
                    ? `${user.shippingInfo.address}, ${user.shippingInfo.city || ''}, ${user.shippingInfo.postalCode || ''}`.replace(/,\s*,/g, ',').replace(/,\s*$/, '')
                    : prev.deliveryAddress,
            }));
        }
    }, [session, status]);

    // Handle review reference parameters
    useEffect(() => {
        const reviewId = searchParams.get('reviewId');
        const cakeName = searchParams.get('cakeName');
        const description = searchParams.get('description');
        const weight = searchParams.get('weight');

        if (reviewId && cakeName) {
            setFormData(prev => ({
                ...prev,
                specialRequests: description || prev.specialRequests,
                weight: weight ? parseFloat(weight) : prev.weight,
                reviewReference: {
                    reviewId,
                    cakeName
                }
            }));
        }
    }, [searchParams]);

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
            } catch {
                // Ignore error - will redirect or show error
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const currentCount = formData.referenceImages?.length || 0;
        if (currentCount >= 5) {
            toast.warning('Максимум 5 зображень');
            return;
        }

        setUploadingImages(true);

        try {
            const uploadedUrls: string[] = [];

            for (const file of Array.from(files)) {
                if (currentCount + uploadedUrls.length >= 5) {
                    toast.warning('Досягнуто максимум 5 зображень');
                    break;
                }

                // Перевірка типу файлу
                if (!file.type.startsWith('image/')) {
                    toast.warning(`Файл ${file.name} не є зображенням`);
                    continue;
                }

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.secure_url && data.secure_url.trim() !== '') {
                        uploadedUrls.push(data.secure_url);
                    }
                } else {
                    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                    toast.error(`Помилка завантаження файлу ${file.name}: ${errorData.error || 'Невідома помилка'}`);
                }
            }

            // Фільтруємо порожні URL перед додаванням
            const validUrls = uploadedUrls.filter(url => url && url.trim() !== '');

            if (validUrls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    referenceImages: [...(prev.referenceImages || []), ...validUrls]
                }));
                toast.success(`${validUrls.length} зображень завантажено успішно!`);
            }

        } catch {
            toast.error('Помилка завантаження зображень');
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            referenceImages: prev.referenceImages?.filter((_, index) => index !== indexToRemove) || []
        }));
    };

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
                toast.success('Замовлення успішно відправлено! Ми зв\'яжемося з вами найближчим часом.');
                router.push('/catalog');
            } else {
                const error = await response.json();
                toast.error(error.message || 'Помилка при створенні замовлення');
            }

        } catch {
            toast.error('Помилка при відправці замовлення. Спробуйте ще раз.');
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
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#90e0ef]"></div>
                    <p className="mt-2 text-gray-600">Завантаження...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#90e0ef]/10 via-white to-[#48cae4]/10">
            <PageBannerSimple
                currentPage='Замовлення'
                title='Оформлення замовлення'
                text='Заповніть форму нижче, і ми зв&apos;яжемося з вами для підтвердження деталей замовлення.'
                image="/images/cataloge-banner.jpg"
            />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
                <form onSubmit={handleSubmit} className="space-y-10">
                    {product ? (
                        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#90e0ef]/30">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">1</span>
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#90e0ef] to-[#48cae4] bg-clip-text text-transparent">Обраний товар</h2>
                            </div>
                            <div className="flex gap-6 p-6 bg-gradient-to-r from-[#90e0ef]/10 to-[#48cae4]/10 rounded-xl border border-[#90e0ef]/30">
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-white shadow-lg flex-shrink-0 ring-4 ring-[#90e0ef]/30">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-gray-400 text-3xl">🍰</div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">{product.name}</h3>
                                    <p className="text-[#48cae4] font-medium text-sm mb-3 px-3 py-1 bg-[#90e0ef]/20 rounded-full inline-block">{product.category}</p>
                                    <p className="text-[#023e8a] font-bold text-2xl">
                                        {formatPrice(product.price, product.unit)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#90e0ef]/30">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">✨</span>
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#90e0ef] to-[#48cae4] bg-clip-text text-transparent">Індивідуальне замовлення</h2>
                            </div>
                            <div className="p-6 bg-gradient-to-r from-[#90e0ef]/10 to-[#48cae4]/10 rounded-xl border border-[#90e0ef]/30">
                                <p className="text-gray-700 text-lg">
                                    Заповніть форму нижче для індивідуального замовлення. Ми зв&apos;яжемося з вами для уточнення деталей та ціни.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Референс на відгук */}
                    {formData.reviewReference && (
                        <div className="bg-gradient-to-r from-[#90e0ef]/20 to-[#48cae4]/20 backdrop-blur-sm border-2 border-[#90e0ef]/50 p-8 rounded-2xl shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">🍰</span>
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#023e8a] to-[#03045e] bg-clip-text text-transparent">Замовлення на основі відгуку</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-md border border-[#90e0ef]/30">
                                    <p className="text-sm text-[#48cae4] font-medium mb-2">Торт з відгуку:</p>
                                    <p className="font-bold text-xl text-gray-900">{formData.reviewReference.cakeName}</p>
                                </div>
                                <div className="bg-white/80 backdrop-blur p-4 rounded-xl shadow-md border border-[#90e0ef]/30">
                                    <p className="text-xs text-[#48cae4] font-medium mb-2">Посилання на відгук</p>
                                    <a
                                        href={`/reviews?open=${formData.reviewReference.reviewId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-[#023e8a] hover:text-[#03045e] transition-colors duration-200 bg-[#90e0ef]/20 px-3 py-2 rounded-lg hover:bg-[#90e0ef]/30"
                                    >
                                        Переглянути оригінальний відгук
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Контактна інформація */}
                    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#90e0ef]/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">2</span>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#90e0ef] to-[#48cae4] bg-clip-text text-transparent">Контактна інформація</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ім&apos;я *
                                </label>
                                <input
                                    type="text"
                                    id="customerName"
                                    name="customerName"
                                    required
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-[#90e0ef]/30 rounded-xl focus:ring-4 focus:ring-[#90e0ef]/30 focus:border-[#90e0ef] transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    placeholder="Введіть ваше ім&apos;я"
                                />
                            </div>

                            <div>
                                <label htmlFor="customerPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Номер телефону *
                                </label>
                                <input
                                    type="tel"
                                    id="customerPhone"
                                    name="customerPhone"
                                    required
                                    value={formData.customerPhone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-[#90e0ef]/30 rounded-xl focus:ring-4 focus:ring-[#90e0ef]/30 focus:border-[#90e0ef] transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    placeholder="+38 XXX XXX XX XX"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="customerEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email (необов&apos;язково)
                                </label>
                                <input
                                    type="email"
                                    id="customerEmail"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-[#90e0ef]/30 rounded-xl focus:ring-4 focus:ring-[#90e0ef]/30 focus:border-[#90e0ef] transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#90e0ef]/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">3</span>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#90e0ef] to-[#48cae4] bg-clip-text text-transparent">Деталі замовлення</h2>
                        </div>
                        <div className="space-y-6">
                            {/* Вага та дата доставки в одній лінії */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
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
                                        className="w-full px-4 py-3 border-2 border-[#90e0ef]/30 rounded-xl focus:ring-4 focus:ring-[#90e0ef]/30 focus:border-[#90e0ef] transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    />
                                    <p className="text-xs text-[#48cae4] font-medium mt-2 bg-[#90e0ef]/20 px-3 py-1 rounded-lg inline-block">
                                        {product
                                            ? product.unit === 'kg'
                                                ? 'Мінімальна вага: 0.5 кг'
                                                : 'Мінімальна кількість: 5 шт'
                                            : 'Орієнтовна вага для розрахунку вартості'
                                        }
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="deliveryDate" className="block text-sm font-semibold text-gray-700 mb-2">
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
                                        className="w-full px-4 py-3 border-2 border-[#90e0ef]/30 rounded-xl focus:ring-4 focus:ring-[#90e0ef]/30 focus:border-[#90e0ef] transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="paymentMethod" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Спосіб оплати *
                                </label>
                                <select
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    required
                                    value={formData.paymentMethod}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 pr-10 border-2 border-[#90e0ef]/30 rounded-xl focus:ring-4 focus:ring-[#90e0ef]/30 focus:border-[#90e0ef] transition-all duration-200 bg-white/80 backdrop-blur-sm appearance-none"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 0.7rem center',
                                        backgroundSize: '1rem'
                                    }}
                                >
                                    <option value="cash">Готівка при отриманні</option>
                                    <option value="card">Картка при отриманні</option>
                                    <option value="transfer">Банківський переказ</option>
                                </select>
                                <div className="mt-3 p-4 bg-gradient-to-r from-[#90e0ef]/20 to-[#48cae4]/20 border-2 border-[#90e0ef]/50 rounded-xl shadow-sm">
                                    <p className="text-sm text-[#023e8a] font-semibold flex items-center gap-2">
                                        <span className="text-lg">💡</span>
                                        Для підтвердження замовлення необхідна передоплата 50%
                                    </p>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="deliveryAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Адреса доставки *
                                </label>
                                <input
                                    type="text"
                                    id="deliveryAddress"
                                    name="deliveryAddress"
                                    required
                                    value={formData.deliveryAddress}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-[#90e0ef]/30 rounded-xl focus:ring-4 focus:ring-[#90e0ef]/30 focus:border-[#90e0ef] transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    placeholder="Вулиця, номер будинку, квартира"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="specialRequests" className="block text-sm font-semibold text-gray-700 mb-2">
                                    {product ? 'Особливі побажання' : 'Опис бажаного товару *'}
                                </label>
                                <textarea
                                    id="specialRequests"
                                    name="specialRequests"
                                    rows={product ? 4 : 6}
                                    required={!product}
                                    value={formData.specialRequests}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-[#90e0ef]/30 rounded-xl focus:ring-4 focus:ring-[#90e0ef]/30 focus:border-[#90e0ef] transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                                    placeholder={
                                        product
                                            ? "Напишіть особливі побажання щодо оформлення, доставки тощо..."
                                            : "Опишіть детально який торт або десерт ви хочете замовити: тип, розмір, начинка, оформлення, особливі побажання тощо..."
                                    }
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Референсні зображення (необов&apos;язково)
                                </label>
                                <p className="text-xs text-gray-500 mb-3">
                                    Додайте до 5 зображень, щоб показати як має виглядати ваш торт або десерт
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="image-upload"
                                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${uploadingImages || (formData.referenceImages?.length || 0) >= 5
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                                }`}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="w-8 h-8 mb-3 text-gray-400">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                </div>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    {uploadingImages ? (
                                                        <span className="font-semibold">Завантаження...</span>
                                                    ) : (
                                                        <>
                                                            <span className="font-semibold">Натисніть для завантаження</span> або перетягніть файли
                                                        </>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG</p>
                                            </div>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                className="hidden"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploadingImages || (formData.referenceImages?.length || 0) >= 5}
                                            />
                                        </label>
                                    </div>

                                    {formData.referenceImages && formData.referenceImages.filter(url => url && url.trim() !== '').length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {formData.referenceImages
                                                .map((imageUrl, originalIndex) => {
                                                    // Пропускаємо порожні URL
                                                    if (!imageUrl || imageUrl.trim() === '') return null;

                                                    return (
                                                        <div key={originalIndex} className="relative group">
                                                            <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-200">
                                                                <Image
                                                                    src={imageUrl}
                                                                    alt={`Референс ${originalIndex + 1}`}
                                                                    fill
                                                                    className="object-cover"
                                                                    unoptimized={true}
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(originalIndex)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors group-hover:opacity-100 opacity-75"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                                .filter(Boolean) // Видаляємо null елементи
                                            }
                                        </div>
                                    )}

                                    {formData.referenceImages && formData.referenceImages.filter(url => url && url.trim() !== '').length > 0 && (
                                        <p className="text-xs text-gray-500">
                                            Завантажено {formData.referenceImages.filter(url => url && url.trim() !== '').length} з 5 можливих зображень
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

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
                            className="flex-1 bg-[#90e0ef] hover:bg-[#48cae4] disabled:bg-[#90e0ef]/50 text-gray-900 py-3 px-6 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
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
