'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Masonry from 'react-masonry-css';

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import './Portfolio.scss'

interface PortfolioItem {
  _id: string;
  title: string;
  image: string;
  createdAt: string;
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

export default function PortfolioComponent() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          setPortfolioItems(data);
        }
      } catch (error) {
        console.error('Fetch portfolio error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    if (portfolioItems.length > 0) {
      Fancybox.bind("[data-fancybox]", {
        // Your custom options
      });
    }
  }, [portfolioItems]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-pink-200 border-t-pink-500 mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Завантаження портфоліо...</p>
          </div>
        </div>
      </section>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-heading text-gray-800 mb-4">Портфоліо готується</h3>
            <p className="text-body text-gray-500">Скоро тут з&apos;являться наші найкращі роботи</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-heading text-gray-900 mb-4">Наші роботи</h2>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            Кожна робота унікальна та створена з особливою увагою до деталей
          </p>
          <div className="mt-6 w-16 h-1 bg-pink-500 mx-auto rounded"></div>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="portfolio-grid"
          columnClassName="portfolio-grid_column"
        >
          {portfolioItems.map((item) => (
            <div key={item._id} className="portfolio-item">
              <Image
                data-fancybox="gallery"
                src={item.image}
                alt={item.title}
                width={300}
                height={300}
                style={{ width: '100%', height: 'auto' }}
                title={item.title}
              />
              <div className="portfolio-overlay">
                <span className="portfolio-title">{item.title}</span>
              </div>
            </div>
          ))}
        </Masonry>

        {/* Bottom Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Сподобалися наші роботи?
            </h3>
            <p className="text-gray-600 mb-6">
              Замовте консультацію, і ми обговоримо ваш унікальний дизайн
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Почати обговорення
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}