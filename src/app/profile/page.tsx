'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    shippingInfo?: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        notes: string;
    };
    createdAt: string;
    updatedAt?: string;
}

export default function Profile() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        shippingInfo: {
            fullName: '',
            phone: '',
            address: '',
            city: 'Вінниця',
            notes: ''
        }
    });

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/auth/signin');
            return;
        }

        fetchProfile();
    }, [session, status, router]);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile');
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    shippingInfo: {
                        fullName: data.shippingInfo?.fullName || data.name || '',
                        phone: data.shippingInfo?.phone || data.phone || '',
                        address: data.shippingInfo?.address || '',
                        city: 'Вінниця',
                        notes: data.shippingInfo?.notes || ''
                    }
                });
            } else {
                setMessage({ type: 'error', text: 'Помилка завантаження профілю' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Помилка завантаження профілю' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('shipping.')) {
            const shippingField = name.replace('shipping.', '');
            setFormData(prev => ({
                ...prev,
                shippingInfo: {
                    ...prev.shippingInfo,
                    [shippingField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.user);
                setMessage({ type: 'success', text: 'Профіль успішно оновлено!' });

                // Update session if name or email changed
                if (formData.name !== session?.user?.name || formData.email !== session?.user?.email) {
                    await update({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone
                    });
                }
            } else {
                setMessage({ type: 'error', text: data.error || 'Помилка оновлення профілю' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Помилка оновлення профілю' });
        } finally {
            setSaving(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
                            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <h1 className="text-3xl font-bold text-gray-900">Мій профіль</h1>
                    </div>

                    <p className="text-gray-600">
                        Керуйте своїм профілем та інформацією для доставки
                    </p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                        <div className="flex items-center">
                            {message.type === 'success' ? (
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {message.text}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    { }
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Особиста інформація
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Повне ім&apos;я *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder="Введіть ваше повне ім'я"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email адреса *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Номер телефону
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder="+380 XX XXX XX XX"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <div className="text-sm text-gray-500">
                                        <strong>Зареєстровано:</strong> {profile && new Date(profile.createdAt).toLocaleDateString('uk-UA')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    { }
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Інформація для доставки
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Ця інформація буде автоматично заповнюватися при оформленні замовлень
                            </p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Повне ім&apos;я для доставки
                                    </label>
                                    <input
                                        type="text"
                                        name="shipping.fullName"
                                        value={formData.shippingInfo.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder="Ім'я отримувача"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Телефон для доставки
                                    </label>
                                    <input
                                        type="tel"
                                        name="shipping.phone"
                                        value={formData.shippingInfo.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder="+380 XX XXX XX XX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Адреса доставки
                                    </label>
                                    <input
                                        type="text"
                                        name="shipping.address"
                                        value={formData.shippingInfo.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder="вул. Хрещатик, буд. 1, кв. 5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Місто
                                    </label>
                                    <input
                                        type="text"
                                        name="shipping.city"
                                        value="Вінниця"
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                                        placeholder="Вінниця"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Додаткові нотатки
                                    </label>
                                    <textarea
                                        name="shipping.notes"
                                        value={formData.shippingInfo.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder="Додаткова інформація для доставки (домофон, поверх, орієнтири тощо)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    { }
                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-400 transition-colors"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Збереження...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Зберегти профіль
                                </>
                            )}
                        </button>
                    </div>
                </form>

                { }
                <div className="mt-12">
                    <div className="bg-pink-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Швидкі посилання</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link
                                href="/catalog"
                                className="flex items-center p-3 bg-white rounded-lg hover:bg-pink-100 transition-colors group"
                            >
                                <svg className="w-5 h-5 mr-3 text-pink-600 group-hover:text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="text-gray-700 group-hover:text-gray-900">Каталог товарів</span>
                            </Link>

                            <Link
                                href="/orders"
                                className="flex items-center p-3 bg-white rounded-lg hover:bg-pink-100 transition-colors group"
                            >
                                <svg className="w-5 h-5 mr-3 text-pink-600 group-hover:text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className="text-gray-700 group-hover:text-gray-900">Мої замовлення</span>
                            </Link>

                            <Link
                                href="/liked"
                                className="flex items-center p-3 bg-white rounded-lg hover:bg-pink-100 transition-colors group"
                            >
                                <svg className="w-5 h-5 mr-3 text-pink-600 group-hover:text-pink-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span className="text-gray-700 group-hover:text-gray-900">Улюблені товари</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
