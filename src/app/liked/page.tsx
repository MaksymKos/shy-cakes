'use client';

import { useState, useEffect } from 'react';
import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';
import ProductList from '@/components/ProductList/ProductList';
import { toast } from 'react-toastify';

export default function LikedProductsPage() {
    const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

    useEffect(() => {
        const savedLikes = localStorage.getItem('likedProducts');
        if (savedLikes) {
            try {
                const likesArray = JSON.parse(savedLikes);
                setLikedProducts(new Set(likesArray));
            } catch {
            }
        }
    }, []);

    const clearAllLikes = () => {
        localStorage.removeItem('likedProducts');
        setLikedProducts(new Set());
        toast.success('Всі улюблені товари очищено');
    };

    return (
        <>
            <PageBannerSimple currentPage='Улюблені товари' title='Мої улюблені товари' text='Тут зібрані всі товари, які ви додали до улюблених. Можете легко переглянути їх та зробити замовлення.' image="/images/cataloge-banner.jpg" />

            {likedProducts.size === 0 ? (
                <section className="min-h-[60vh] grid place-items-center">
                    <div className="text-center">
                        <div className="text-gray-400 text-4xl mb-2">❤️</div>
                        <p className="text-gray-500 text-sm">У вас немає улюблених товарів</p>
                    </div>
                </section>
            ) : (
                likedProducts.size > 0 && (
                    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Мої улюблені товари
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Товари, які ви додали до улюблених
                                </p>
                            </div>

                            {likedProducts.size > 0 && (
                                <button
                                    onClick={clearAllLikes}
                                    className="text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                                >
                                    Очистити все
                                </button>
                            )}
                        </div>
                        <ProductList type='liked' />
                    </section>
                )
            )}
        </>
    );
}
