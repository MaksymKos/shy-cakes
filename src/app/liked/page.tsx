'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';

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

export default function LikedProductsPage() {
    const router = useRouter();
    const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Load liked products from localStorage
    useEffect(() => {
        const savedLikes = localStorage.getItem('likedProducts');
        if (savedLikes) {
            try {
                const likesArray = JSON.parse(savedLikes);
                setLikedProducts(new Set(likesArray));
            } catch {
                // Ignore error - just continue without saved likes
            }
        }
        setLoading(false);
    }, []);

    // Fetch product details for liked products
    useEffect(() => {
        const fetchLikedProducts = async () => {
            if (likedProducts.size === 0) {
                setProducts([]);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch('/api/products');
                if (response.ok) {
                    const allProducts = await response.json();
                    const likedProductsData = allProducts.filter((product: Product) =>
                        likedProducts.has(product._id) && product.available
                    );
                    setProducts(likedProductsData);
                }
            } catch {
                // Ignore error - will show no products
            } finally {
                setLoading(false);
            }
        };

        fetchLikedProducts();
    }, [likedProducts]);

    const formatPrice = (price: number, unit: 'kg' | 'piece' = 'kg') => {
        const unitText = unit === 'kg' ? '/ кг' : '/ шт';
        return `${Math.round(price)} ₴ ${unitText}`;
    };

    const handleProductClick = (productId: string) => {
        router.push(`/catalog/${productId}`);
    };

    const toggleLike = (productId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        const newLiked = new Set(likedProducts);
        newLiked.delete(productId);
        setLikedProducts(newLiked);

        // Update localStorage
        if (newLiked.size > 0) {
            localStorage.setItem('likedProducts', JSON.stringify(Array.from(newLiked)));
        } else {
            localStorage.removeItem('likedProducts');
        }
    };

    const clearAllLikes = () => {
        setLikedProducts(new Set());
        localStorage.removeItem('likedProducts');
    };

    return (
        <div className="">
            <PageBannerSimple
                currentPage='Улюблені товари'
                title='Мої улюблені товари'
                text='Тут зібрані всі товари, які ви додали до улюблених. Можете легко переглянути їх та зробити замовлення.'
                image="/images/cataloge-banner.jpg"
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                        <p className="mt-2 text-gray-600">Завантаження улюблених товарів...</p>
                    </div>
                ) : likedProducts.size === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💔</div>
                        <p className="text-gray-600 text-lg mb-4">У вас поки немає улюблених товарів</p>
                        <p className="text-gray-500 mb-6">Перегляньте наш каталог та додайте товари, які вам сподобались</p>
                        <button
                            onClick={() => router.push('/catalog')}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                        >
                            Перейти до каталогу
                        </button>
                    </div>
                ) : (
                    <>
                        { }
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Ваші улюблені товари ({likedProducts.size})
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

                        { }
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    onClick={() => handleProductClick(product._id)}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                >
                                    { }
                                    <div className="relative h-64 bg-gray-200">
                                        {product.images && product.images.length > 0 ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center">
                                                    <div className="text-gray-400 text-4xl mb-2">📸</div>
                                                    <p className="text-gray-500 text-sm">Немає фото</p>
                                                </div>
                                            </div>
                                        )}

                                        { }
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                {product.category}
                                            </span>
                                        </div>

                                        { }
                                        <button
                                            onClick={(e) => toggleLike(product._id, e)}
                                            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
                                            title="Видалити з улюблених"
                                        >
                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </button>
                                    </div>

                                    { }
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-1">
                                            {product.name}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-pink-600">
                                                {formatPrice(product.price, product.unit)}
                                            </span>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // TODO: Implement quick order
                                                }}
                                                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium cursor-pointer"
                                            >
                                                Замовити
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
