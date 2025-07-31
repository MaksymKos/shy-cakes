'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ProductCategoryValue } from '@/constants/categories';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategoryValue;
  images: string[];
  available: boolean;
  createdAt: string;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.available) {
            setProduct(data);
          } else {
            router.push('/catalog');
          }
        } else {
          router.push('/catalog');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/catalog');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  const formatPrice = (price: number) => {
    return `${Math.round(price)} ₴`;
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
            <li className="text-gray-900 font-medium">{product.name}</li>
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
              {formatPrice(product.price)} / кг
            </div>

            {/* Опис */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Опис</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Кнопки дій */}
            <div className="space-y-4">
              <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-colors cursor-pointer">
                🛒 Замовити товар
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button className="border border-gray-300 hover:border-pink-500 text-gray-700 hover:text-pink-600 py-3 px-4 rounded-lg transition-colors cursor-pointer">
                  💝 У бажання
                </button>
                <button className="border border-gray-300 hover:border-pink-500 text-gray-700 hover:text-pink-600 py-3 px-4 rounded-lg transition-colors cursor-pointer">
                  📤 Поділитися
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
                  <span className="font-medium text-green-600">В наявності</span>
                </div>
                <div className="flex justify-between">
                  <span>Одиниця виміру:</span>
                  <span className="font-medium">кг</span>
                </div>
              </div>
            </div>
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
  const router = useRouter();

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
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProduct]);

  const formatPrice = (price: number) => {
    return `${Math.round(price)} ₴`;
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
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <div className="text-lg font-bold text-pink-600">
              {formatPrice(product.price)} / кг
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
