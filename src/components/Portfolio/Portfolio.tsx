'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
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
      } catch {
        // Ignore error - will show no portfolio items
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
            <p className="text-body text-gray-500">Скоро тут з&apos;являться мої найкращі роботи</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">

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
      </div>
    </section>
  )
}
