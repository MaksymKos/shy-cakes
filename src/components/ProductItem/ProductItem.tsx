import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UNIT_LABELS, type ProductUnit } from '@/constants/units';
import type { ProductItemType } from '@/types/productItem';

const ProductItem = ({ product, likedProducts, toggleLike }: { product: ProductItemType, likedProducts: Set<string>, toggleLike: (productId: string, e: React.MouseEvent) => void }) => {
  const router = useRouter();

  const formatPrice = (price: number, unit: ProductUnit = 'kg') => {
    const unitText = UNIT_LABELS[unit].perUnit;
    return `${Math.round(price)} ₴ ${unitText}`;
  };

  const handleProductClick = (productId: string) => {
    router.push(`/catalog/${productId}`);
  };

  const handleOrderProduct = (product: ProductItemType, e: React.MouseEvent) => {
    e.stopPropagation();

    const orderUrl = `/order?productId=${product._id}&productName=${encodeURIComponent(product.name)}&productPrice=${product.price}&productUnit=${product.unit}`;
    router.push(orderUrl);
  };

  return (
    <div
      onClick={() => handleProductClick(product._id)}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
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

        <div className="absolute top-2 left-2">
          <span className="bg-[#90e0ef] text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
            {product.category}
          </span>
        </div>

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

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-[#48cae4]">
            {formatPrice(product.price, product.unit)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={(e) => handleOrderProduct(product, e)}
            className="bg-[#90e0ef] hover:bg-[#48cae4] text-gray-900 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium cursor-pointer flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Замовити
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductItem;