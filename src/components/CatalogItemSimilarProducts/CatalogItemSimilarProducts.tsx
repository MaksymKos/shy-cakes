import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import ProductItem from '../ProductItem/ProductItem';
import { ProductItemType } from '@/types/productItem';

export default function CatalogItemSimilarProducts({ currentProduct }: { currentProduct: ProductItemType }) {
  const [similarProducts, setSimilarProducts] = useState<ProductItemType[]>([]);
  const [loading, setLoading] = useState(true);
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
            .filter((product: ProductItemType) =>
              product._id !== currentProduct._id && product.available
            )
            .slice(0, 4);
          setSimilarProducts(filtered);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProduct]);

  const toggleLike = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();

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
      <Loader text="Завантаження товарів..." />
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
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Схожі товари</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarProducts.map((product) => (
          <ProductItem key={product._id} product={product} likedProducts={likedProducts} toggleLike={toggleLike} />
        ))}
      </div>
    </div>
  );
}