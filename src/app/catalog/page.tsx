'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';
import { FILTER_CATEGORIES, ProductCategoryValue } from '@/constants/categories';
import { UNIT_LABELS, type ProductUnit } from '@/constants/units';
import { toast } from 'react-toastify';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategoryValue;
  images: string[];
  available: boolean;
  unit: ProductUnit; // Updated to use ProductUnit type
  createdAt: string;
}

export default function CatalogPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showOnlyLiked, setShowOnlyLiked] = useState<boolean>(false);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

  // Load liked products from localStorage on component mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedProducts');
    if (savedLikes) {
      try {
        const likesArray = JSON.parse(savedLikes);
        setLikedProducts(new Set(likesArray));
      } catch (error) {
        console.error('Error loading liked products:', error);
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
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (searchTerm) params.append('search', searchTerm);

        const response = await fetch(`/api/products?${params}`);
        if (response.ok) {
          const data = await response.json();
          // Фільтруємо тільки доступні товари та сортуємо по категоріях
          const availableProducts = data.filter((product: Product) => product.available);

          // Фільтруємо за улюбленими товарами якщо активний фільтр
          const filteredProducts = showOnlyLiked
            ? availableProducts.filter((product: Product) => likedProducts.has(product._id))
            : availableProducts;

          // Сортуємо продукти за порядком категорій у FILTER_CATEGORIES
          const sortedProducts = filteredProducts.sort((a: Product, b: Product) => {
            const aIndex = FILTER_CATEGORIES.findIndex(cat => cat.value === a.category);
            const bIndex = FILTER_CATEGORIES.findIndex(cat => cat.value === b.category);

            // Якщо категорія не знайдена, ставимо в кінець
            const aOrder = aIndex === -1 ? 999 : aIndex;
            const bOrder = bIndex === -1 ? 999 : bIndex;

            // Спочатку сортуємо за категоріями, потім за назвою
            if (aOrder !== bOrder) {
              return aOrder - bOrder;
            }
            return a.name.localeCompare(b.name);
          });

          setProducts(sortedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, showOnlyLiked, likedProducts]);

  const formatPrice = (price: number, unit: ProductUnit = 'kg') => {
    const unitText = UNIT_LABELS[unit].perUnit;
    return `${Math.round(price)} ₴ ${unitText}`;
  };

  const handleProductClick = (productId: string) => {
    router.push(`/catalog/${productId}`);
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

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation

    const defaultQuantity = product.unit === 'kg' ? 0.5 : 1;

    addToCart({
      productId: product._id,
      productName: product.name,
      productPrice: product.price,
      productUnit: product.unit,
      productImage: product.images?.[0]
    }, defaultQuantity);

    // Show success message
    toast.success(`${product.name} додано до кошика!`);
  };

  return (
    <div className="">
      <PageBannerSimple
        currentPage='Каталог'
        title='Каталог товарів'
        text='У нашому каталозі ви знайдете мусові та бісквітні торти на будь-який смак — від ніжної класики до креативних новинок. Також пропонуємо кейк попси, ескімо-десерти та яскраві макаронси — ідеальні для свят чи подарунків. Обирайте серед готових подарункових наборів або створіть власний солодкий мікс!'
        image="/images/cataloge-banner.jpg"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Фільтри */}
        <div className="mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Пошук */}
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Пошук товарів..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Категорії */}
              <div className="w-full md:w-1/2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {FILTER_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Додаткові фільтри */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Показати тільки улюблені */}
              <button
                onClick={() => setShowOnlyLiked(!showOnlyLiked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border ${showOnlyLiked
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:text-pink-600'
                  }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>Тільки улюблені</span>
                {likedProducts.size > 0 && (
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                    {likedProducts.size}
                  </span>
                )}
              </button>

              {/* Показати кількість товарів */}
              <div className="text-sm text-gray-600">
                Знайдено товарів: <span className="font-semibold">{products.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Товари */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-2 text-gray-600">Завантаження товарів...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            {showOnlyLiked ? (
              <>
                <div className="text-6xl mb-4">💔</div>
                <p className="text-gray-600 text-lg">
                  {likedProducts.size === 0
                    ? "У вас поки немає улюблених товарів"
                    : "Серед улюблених товарів нічого не знайдено"}
                </p>
                <p className="text-gray-500 mt-2">
                  {likedProducts.size === 0
                    ? "Додайте товари до улюблених, щоб побачити їх тут"
                    : "Спробуйте змінити пошуковий запит або категорію"}
                </p>
                {likedProducts.size === 0 && (
                  <button
                    onClick={() => setShowOnlyLiked(false)}
                    className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Переглянути всі товари
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="text-gray-600 text-lg">Товари не знайдено</p>
                <p className="text-gray-500 mt-2">Спробуйте змінити фільтри або пошуковий запит</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                {/* Зображення товару */}
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

                  {/* Категорія */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>

                  {/* Like button */}
                  <button
                    onClick={(e) => toggleLike(product._id, e)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {likedProducts.has(product._id) ? (
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Інформація про товар */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-pink-600">
                      {formatPrice(product.price, product.unit)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium cursor-pointer flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Кошик
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/order?productId=${product._id}`);
                      }}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium cursor-pointer"
                    >
                      Замовити
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating liked products counter */}
      {likedProducts.size > 0 && (
        <Link
          href="/liked"
          className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-40 group"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {likedProducts.size}
            </span>
          </div>
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Улюблені товари
          </div>
        </Link>
      )}
    </div>
  );
}