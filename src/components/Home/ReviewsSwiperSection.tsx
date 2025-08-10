'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { usePhotoReviews } from '@/store';
import type { PhotoReview } from '@/types/database';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ReviewsSwiperSection() {
    const [isClient, setIsClient] = useState(false);

    // Use Zustand store for data fetching with automatic caching
    const {
        data: photoReviews,
        isLoading: loading,
        error,
        clearError
    } = usePhotoReviews({
        approvedOnly: true,
        autoFetch: true,
        refreshInterval: 5 * 60 * 1000 // Refresh every 5 minutes
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Clear error on component mount
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [error, clearError]);

    const formatPrice = (price: number) => {
        return `${Math.round(price)} ₴`;
    };

    const formatWeight = (weight: number) => {
        return `${weight.toFixed(1)} кг`;
    };

    const formatDate = (date: Date | string) => {
        if (!isClient) return '';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return dateObj.toLocaleDateString('uk-UA');
        } catch {
            return '';
        }
    };

    if (!isClient || loading || photoReviews.length === 0) {
        return null;
    }

    // Display only the latest 6 reviews
    const displayReviews = photoReviews.slice(0, 6);

    return (
        <section className="py-24 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Наші роботи
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Кожен торт - це унікальна історія. Перегляньте наші останні творіння та відгуки задоволених клієнтів
                    </p>
                </div>

                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        centeredSlides={false}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        speed={300}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                            dynamicMainBullets: 3,
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        breakpoints={{
                            480: {
                                slidesPerView: 1.2,
                                spaceBetween: 20,
                            },
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                            1280: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                        }}
                        className="reviews-swiper"
                    >
                        {displayReviews.map((review: PhotoReview) => (
                            <SwiperSlide key={review._id?.toString()}>
                                <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
                                    {}
                                    {review.images.length > 0 && (
                                        <div className="aspect-square relative overflow-hidden">
                                            <Image
                                                src={review.images[0]}
                                                alt={review.cakeName}
                                                fill
                                                className="object-cover"
                                            />

                                            {}
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                                                {formatPrice(review.totalPrice)}
                                            </div>

                                            {}
                                            {review.images.length > 1 && (
                                                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                                                    📸 {review.images.length} фото
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {review.cakeName}
                                            </h3>
                                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                                                {formatWeight(review.totalWeight)}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                            {review.cakeDescription}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(review.completedDate)}
                                            </span>

                                            <Link
                                                href={`/reviews?open=${review._id?.toString()}`}
                                                className="text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center transition-colors duration-200"
                                            >
                                                Детальніше
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {}
                    <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
                        <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
                        <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/reviews"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-full hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Переглянути всі відгуки
                    </Link>
                </div>
            </div>
        </section>
    );
}
