'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';
import { useCategories } from '@/hooks/useCategories';
import ProductItem from '@/components/ProductItem/ProductItem';
import type { ProductItemType } from '@/types/productItem';



export default function CatalogPage() {
  const { filterCategories } = useCategories();
  const [products, setProducts] = useState<ProductItemType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItemType[]>([]);
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
      } catch {
        // Ignore error - continue without saved likes
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
          setProducts(data.filter((product: ProductItemType) => product.available));
        }
      } catch {
        // Ignore error - will show no products
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm]);

  // Separate effect for filtering and sorting products
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    // Фільтруємо за улюбленими товарами якщо активний фільтр
    const likedFiltered = showOnlyLiked
      ? products.filter((product: ProductItemType) => likedProducts.has(product._id))
      : products;

    // Сортуємо продукти за порядком категорій
    const sortedProducts = likedFiltered.sort((a: ProductItemType, b: ProductItemType) => {
      const aIndex = filterCategories.findIndex(cat => cat.value === a.category);
      const bIndex = filterCategories.findIndex(cat => cat.value === b.category);

      // Якщо категорія не знайдена, ставимо в кінець
      const aOrder = aIndex === -1 ? 999 : aIndex;
      const bOrder = bIndex === -1 ? 999 : bIndex;

      // Спочатку сортуємо за категоріями, потім за назвою
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.name.localeCompare(b.name);
    });

    setFilteredProducts(sortedProducts);
  }, [products, showOnlyLiked, likedProducts, filterCategories]);

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

  return (
    <div className="">
      <PageBannerSimple
        currentPage='Каталог'
        title='Каталог товарів'
        text='У моєму каталозі ви знайдете мусові та бісквітні торти на будь-який смак — від ніжної класики до креативних новинок. Також пропоную кейк попси, ескімо-десерти та яскраві макаронси — ідеальні для свят чи подарунків. Обирайте серед готових подарункових наборів або створіть власний солодкий мікс!'
        image="/images/cataloge-banner.jpg"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <div className="w-full lg:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Пошук товарів..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#90e0ef]/30 focus:border-[#90e0ef] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="pr-2 flex items-center"
                    >
                      <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button className="pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400 hover:text-[#90e0ef] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/3">
              <div className="flex flex-wrap gap-3">
                {filterCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value === selectedCategory ? '' : category.value)}
                    className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 font-medium shadow-sm ${selectedCategory === category.value
                      ? 'bg-[#90e0ef] text-gray-900 border-[#90e0ef] shadow-md scale-105'
                      : 'bg-white/80 text-gray-700 border-gray-200 hover:border-[#90e0ef] hover:text-[#023e8a] hover:bg-[#90e0ef]/10 backdrop-blur-sm'
                      }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#90e0ef]"></div>
            <p className="mt-2 text-gray-600">Завантаження товарів...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
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
                    className="mt-4 bg-[#90e0ef] hover:bg-[#48cae4] text-gray-900 px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
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
            {filteredProducts.map((product) => (
              <ProductItem key={product._id} product={product} likedProducts={likedProducts} toggleLike={toggleLike} />
            ))}
          </div>
        )}
      </div>

      {likedProducts.size > 0 && (
        <Link
          href="/liked"
          className="fixed bottom-6 right-6 bg-[#90e0ef] hover:bg-[#48cae4] text-gray-900 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-40 group"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-[#023e8a] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
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
