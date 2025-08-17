import React from 'react'
import { useRouter } from 'next/navigation';
import { ProductItemType } from '@/types/productItem';

interface CatalogItemBreadCrumbsProps {
  product: ProductItemType;
  likedProducts: Set<string>;
}

const CatalogItemBreadCrumbs = ({ product, likedProducts }: CatalogItemBreadCrumbsProps) => {
    const router = useRouter();

  return (
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
  )
}

export default CatalogItemBreadCrumbs;