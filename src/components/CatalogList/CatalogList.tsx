import { useState, useEffect, useMemo } from 'react';

import { useCategories } from '@/hooks/useCategories';
import type { ProductItemType } from '@/types/productItem';

import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';
import ProductItem from '@/components/ProductItem/ProductItem';
import Loader from '@/components/Loader/Loader';
import CatalogActions from '@/components/CatalogActions/CatalogActions';

const CatalogList = () => {
  const { filterCategories } = useCategories();
  const [products, setProducts] = useState<ProductItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const sortedProducts = useMemo(() => {
    if (products.length === 0) return [];
    return products
      .sort((a, b) => {
        const aIndex = filterCategories.findIndex(cat => cat.value === a.category);
        const bIndex = filterCategories.findIndex(cat => cat.value === b.category);
        const aOrder = aIndex === -1 ? 999 : aIndex;
        const bOrder = bIndex === -1 ? 999 : bIndex;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.name.localeCompare(b.name);
      });
  }, [products, filterCategories]);

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
          <CatalogActions
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategories={filterCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {loading ? (
            <Loader />
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Товари не знайдено</p>
              <p className="text-gray-500 mt-2">Спробуйте змінити фільтри або пошуковий запит</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductItem key={product._id} product={product} likedProducts={likedProducts} toggleLike={toggleLike} />
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default CatalogList;