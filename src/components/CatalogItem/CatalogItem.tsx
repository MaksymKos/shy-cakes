import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';

import { ProductItemType } from '@/types/productItem';

import CatalogItemSimilarProducts from '@/components/CatalogItemSimilarProducts/CatalogItemSimilarProducts';
import CatalogItemBreadCrumbs from '@/components/CatalogItemBreadCrumbs/CatalogItemBreadCrumbs';
import CatalogItemInformation from '@/components/CatalogItemInformation/CatalogItemInformation';
import Loader from '../Loader/Loader';

const CatalogItem = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);

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

    const orderUrl = `/order?productId=${product._id}&productName=${encodeURIComponent(product.name)}&productPrice=${product.price}&productUnit=${product.unit}&quantity=${quantity}`;
    router.push(orderUrl);
  };

  if (loading) {
    return (
      <Loader text="Завантаження товару..." />
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <CatalogItemBreadCrumbs product={product} likedProducts={likedProducts} />

      <CatalogItemInformation
        product={product}
        selectedImageIndex={selectedImageIndex}
        setSelectedImageIndex={setSelectedImageIndex}
        likedProducts={likedProducts}
        toggleLike={toggleLike}
        quantity={quantity}
        handleQuantityChange={handleQuantityChange}
        handleOrderProduct={handleOrderProduct}
      />

      {/* Схожі товари */}
      <CatalogItemSimilarProducts currentProduct={product} />

    </div>
  );
};

export default CatalogItem;