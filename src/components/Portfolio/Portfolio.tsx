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
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-2 text-gray-600">Завантаження портфоліо...</p>
          </div>
        </div>
      </section>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Портфоліо поки що порожнє</p>
            <p className="text-gray-400 mt-2">Скоро тут з&apos;являться наші роботи</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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