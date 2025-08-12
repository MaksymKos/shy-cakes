'use client';

import Link from 'next/link';
import ProductList from '../ProductList/ProductList';

export default function ProductsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] bg-clip-text text-transparent">
            Мої продукти
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Всі мої вироби створюються індивідуально під замовлення для найкращої свіжості та якості
          </p>
        </div>

        <ProductList type='homepage' />

        <div className="text-center mt-12">
          <Link
            href="/catalog"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] text-gray-900 font-semibold rounded-full hover:from-[#48cae4] hover:to-[#023e8a] hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Переглянути весь каталог
          </Link>
        </div>
      </div>
    </section>
  );
}
