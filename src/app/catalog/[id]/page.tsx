'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  available: boolean;
  unit: 'kg' | 'piece'; // New field for unit type
  packaging?: string;
  importantInfo?: string;
  storageConditions?: string;
  recommendations?: string;
  createdAt: string;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);
  const [shareButtonText, setShareButtonText] = useState('📤 Поділитися');

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
  }, []);

  // Save liked products to localStorage whenever it changes
  useEffect(() => {
    if (likedProducts.size > 0) {
      localStorage.setItem('likedProducts', JSON.stringify(Array.from(likedProducts)));
    } else {
      localStorage.removeItem('likedProducts');
    }
  }, [likedProducts]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.available) {
            setProduct(data);
            // Set initial quantity based on unit type
            setQuantity(data.unit === 'kg' ? 0.5 : 1);
          } else {
            router.push('/catalog');
          }
        } else {
          router.push('/catalog');
        }
      } catch {
        router.push('/catalog');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  const formatPrice = (price: number, unit: 'kg' | 'piece' = 'kg') => {
    const unitText = unit === 'kg' ? '/ кг' : '/ шт';
    return `${Math.round(price)} ₴ ${unitText}`;
  };

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;

    const minQuantity = product.unit === 'kg' ? 0.5 : 1;
    const maxQuantity = product.unit === 'kg' ? 20 : 100;

    if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleOrderProduct = () => {
    if (!product) return;

    // Redirect to order page with product and quantity
    const orderUrl = `/order?productId=${product._id}&productName=${encodeURIComponent(product.name)}&productPrice=${product.price}&productUnit=${product.unit}&quantity=${quantity}`;
    router.push(orderUrl);
  };

  const handleShareProduct = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      setShareButtonText('✅ Скопійовано!');

      // Reset button text after 2 seconds
      setTimeout(() => {
        setShareButtonText('📤 Поділитися');
      }, 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShareButtonText('✅ Скопійовано!');
        setTimeout(() => {
          setShareButtonText('📤 Поділитися');
        }, 2000);
      } catch {
        setShareButtonText('❌ Помилка');
        setTimeout(() => {
          setShareButtonText('📤 Поділитися');
        }, 2000);
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p className="mt-2 text-gray-600">Завантаження товару...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Товар не знайдено</h1>
          <button
            onClick={() => router.push('/catalog')}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Повернутись до каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button
                onClick={() => router.push('/')}
                className="hover:text-pink-600 transition-colors cursor-pointer"
              >
                Головна
              </button>
            </li>
            <li>/</li>
            <li>
              <button
                onClick={() => router.push('/catalog')}
                className="hover:text-pink-600 transition-colors cursor-pointer"
              >
                Каталог
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium flex items-center gap-2">
              {product.name}
              {likedProducts.has(product._id) && (
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Галерея зображень */}
          <div className="space-y-4">
            {/* Головне зображення */}
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📸</div>
                    <p className="text-gray-500">Немає фото</p>
                  </div>
                </div>
              )}

              {/* Like button on main image */}
              <button
                onClick={() => toggleLike(product._id)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {likedProducts.has(product._id) ? (
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Мініатюри */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${selectedImageIndex === index
                      ? 'border-pink-500'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Інформація про товар */}
          <div className="space-y-6">
            {/* Категорія */}
            <div>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            {/* Назва */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Ціна */}
            <div className="text-4xl font-bold text-pink-600">
              {formatPrice(product.price, product.unit)}
            </div>

            {/* Опис */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Опис</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Кількість і кнопки дій */}
            <div className="space-y-4">
              {/* Селектор кількості */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {product.unit === 'kg' ? 'Вага (кг)' : 'Кількість (шт)'}
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - (product.unit === 'kg' ? 0.5 : 1))}
                    className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:border-pink-500 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>

                  <div className="text-center min-w-[100px]">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0)}
                      min={product.unit === 'kg' ? 0.5 : 1}
                      max={product.unit === 'kg' ? 20 : 100}
                      step={product.unit === 'kg' ? 0.5 : 1}
                      className="w-20 text-center border border-gray-300 rounded px-3 py-2 text-lg font-semibold"
                    />
                  </div>

                  <button
                    onClick={() => handleQuantityChange(quantity + (product.unit === 'kg' ? 0.5 : 1))}
                    className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:border-pink-500 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Загальна сума: <span className="font-semibold text-pink-600">{Math.round(product.price * quantity)} ₴</span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handleOrderProduct}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-colors cursor-pointer"
                >
                  🛒 Замовити зараз
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => toggleLike(product._id)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer ${likedProducts.has(product._id)
                    ? 'bg-red-50 border border-red-500 text-red-600'
                    : 'border border-gray-300 hover:border-pink-500 text-gray-700 hover:text-pink-600'
                    }`}
                >
                  {likedProducts.has(product._id) ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      В улюблених
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      У бажання
                    </>
                  )}
                </button>
                <button
                  onClick={handleShareProduct}
                  className="border border-gray-300 hover:border-pink-500 text-gray-700 hover:text-pink-600 py-3 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  {shareButtonText}
                </button>
              </div>
            </div>

            {/* Додаткова інформація */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Додаткова інформація</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Категорія:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Наявність:</span>
                  <span className="font-medium text-blue-600">Виготовляємо під замовлення</span>
                </div>
                <div className="flex justify-between">
                  <span>Одиниця виміру:</span>
                  <span className="font-medium">{product.unit === 'kg' ? 'кг' : 'шт'}</span>
                </div>
              </div>
            </div>

            {/* Інформація про упаковку та зберігання - показуємо тільки якщо є хоча б одне поле */}
            {(product.packaging || product.importantInfo || product.storageConditions || product.recommendations) && (
              <div className="border-t pt-6">
                <div className="space-y-6">
                  {/* Упаковка - показуємо тільки якщо є інформація */}
                  {product.packaging && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Упаковка</h3>
                      <p className="text-gray-600">
                        {product.packaging}
                      </p>
                    </div>
                  )}

                  {/* Важливо знати - показуємо тільки якщо є інформація */}
                  {product.importantInfo && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Важливо знати</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {product.importantInfo}
                      </p>
                    </div>
                  )}

                  {/* Умови зберігання - показуємо тільки якщо є інформація */}
                  {product.storageConditions && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Умови зберігання</h3>
                      <p className="text-gray-600 mb-3">
                        {product.storageConditions}
                      </p>
                      {product.recommendations && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800">
                            <span className="font-semibold">Порада:</span> {product.recommendations}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Показуємо рекомендації окремо, якщо немає умов зберігання */}
                  {!product.storageConditions && product.recommendations && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Рекомендації</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          <span className="font-semibold">Порада:</span> {product.recommendations}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Схожі товари */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Схожі товари</h2>
          <SimilarProducts currentProduct={product} />
        </div>
      </div>
    </main>
  );
}

// Компонент для схожих товарів
function SimilarProducts({ currentProduct }: { currentProduct: Product }) {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const router = useRouter();

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
  }, []);

  // Save liked products to localStorage whenever it changes
  useEffect(() => {
    if (likedProducts.size > 0) {
      localStorage.setItem('likedProducts', JSON.stringify(Array.from(likedProducts)));
    } else {
      localStorage.removeItem('likedProducts');
    }
  }, [likedProducts]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await fetch(`/api/products?category=${currentProduct.category}`);
        if (response.ok) {
          const data = await response.json();
          const filtered = data
            .filter((product: Product) =>
              product._id !== currentProduct._id && product.available
            )
            .slice(0, 4);
          setSimilarProducts(filtered);
        }
      } catch {
        // Ignore error - will show "no similar products" message
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProduct]);

  const formatPrice = (price: number, unit: 'kg' | 'piece' = 'kg') => {
    const unitText = unit === 'kg' ? '/ кг' : '/ шт';
    return `${Math.round(price)} ₴ ${unitText}`;
  };

  const toggleLike = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking like button

    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (similarProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Схожі товари не знайдено</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {similarProducts.map((product) => (
        <div
          key={product._id}
          onClick={() => router.push(`/catalog/${product._id}`)}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        >
          <div className="relative h-48 bg-gray-200">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-3xl">📸</div>
              </div>
            )}

            {/* Like button */}
            <button
              onClick={(e) => toggleLike(product._id, e)}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {likedProducts.has(product._id) ? (
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-pink-600">
                {formatPrice(product.price, product.unit)}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/order?productId=${product._id}`);
                }}
                className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Замовити
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
