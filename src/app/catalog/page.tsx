'use client';

import CatalogList from '@/components/CatalogList/CatalogList';
import Link from 'next/link';

export default function CatalogPage() {
  return (
    <>
      <CatalogList />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Готові створити щось особливе? 🎂
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Кожен торт - це унікальна історія. Розкажіть мені про ваше свято, і я створю десерт,
              який стане його найсолодшим моментом. Від класичних рецептів до сміливих експериментів -
              я втілюю ваші найкращі ідеї в реальність.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/order"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] text-white font-semibold rounded-full hover:from-[#48cae4] hover:to-[#023e8a] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Зробити замовлення
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};