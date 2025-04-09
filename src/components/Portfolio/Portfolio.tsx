'use client'
import Image from 'next/image';
import Masonry from 'react-masonry-css';

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import './Portfolio.scss'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const items = [
  '/images/portfolio/portfolio-1.jpg',
  '/images/portfolio/portfolio-2.jpg',
  '/images/portfolio/portfolio-3.jpg',
  '/images/portfolio/portfolio-4.jpg',
  '/images/portfolio/portfolio-5.jpg',
  '/images/portfolio/portfolio-6.jpg',
  '/images/portfolio/portfolio-7.jpg',
  '/images/portfolio/portfolio-8.jpg',
  '/images/portfolio/portfolio-9.jpg',
  '/images/portfolio/portfolio-10.jpg',
  '/images/portfolio/portfolio-11.jpg',
  '/images/portfolio/portfolio-12.jpg'
]

export default function PortfolioComponent() {
  Fancybox.bind("[data-fancybox]", {
    // Your custom options
  });

  return (
    <section className="p-12">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="portfolio-grid"
        columnClassName="portfolio-grid_column"
      >
        {items.map((item, i) => (
          <div key={i}>
            <Image
              data-fancybox="gallery"
              src={item}
              alt="portfolio image"
              width={300}
              height={300}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        ))}
      </Masonry>
    </section>
  )
}