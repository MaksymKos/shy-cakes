import { useEffect, useState } from 'react'
import ProductItem from '../ProductItem/ProductItem'
import type { ProductItemType } from '@/types/productItem';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';

interface ProductListProps {
  type: 'homepage' | 'liked';
}

const ProductList = ({ type }: ProductListProps) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductItemType[]>([]);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch {
        toast.error('Не вдалося завантажити продукти');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    if (type === 'liked') {
      const savedLikes = localStorage.getItem('likedProducts');
      if (savedLikes) {
        try {
          const likesArray = JSON.parse(savedLikes);
          setLikedProducts(new Set(likesArray));
        } catch {
          setLikedProducts(new Set());
        }
      }
    }
  }, [type]);

  const filteredProducts = type === 'homepage'
    ? products.filter(product => product.showOnHomepage)
    : type === 'liked'
      ? products.filter(product => likedProducts.has(product._id))
      : products;

  return (
    <div>

      {loading ? (
        <Loader text='Завантаження товарів...' />
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${type === 'homepage'
            ? 'lg:grid-cols-3'
            : 'lg:grid-cols-3 xl:grid-cols-4'
          }`}>
          {filteredProducts.map((product) => (
            <ProductItem key={product._id} product={product} likedProducts={likedProducts} toggleLike={toggleLike} />
          ))}
        </div>
      )}

    </div>
  );
};

export default ProductList;