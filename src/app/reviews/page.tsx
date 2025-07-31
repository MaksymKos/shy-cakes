'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';

interface PhotoReview {
  _id: string;
  cakeName: string;
  cakeDescription: string;
  totalPrice: number;
  totalWeight: number;
  images: string[];
  isApproved: boolean;
  createdAt: string;
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<PhotoReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<PhotoReview | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/photo-reviews?approved=true');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSame = (review: PhotoReview) => {
    router.push(`/contact?description=${encodeURIComponent(review.cakeDescription)}&price=${review.totalPrice}&weight=${review.totalWeight}`);
  };

  const nextImage = () => {
    if (selectedReview && selectedImageIndex < selectedReview.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const formatPrice = (price: number) => {
    return `${Math.round(price)} ₴`;
  };

  const formatWeight = (weight: number) => {
    return `${Math.round(weight)} кг`;
  };

  return (
    <div>
      <PageBannerSimple
        currentPage="Відгуки"
        title="Відгуки наших клієнтів"
        text="Переглядайте реальні роботи та замовляйте схожі торти"
        image="/images/cataloge-banner.jpg"
      />

      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Відгуки */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              <p className="mt-2 text-gray-600">Завантаження відгуків...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8M9 12h6" />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900">Відгуків поки немає</h3>
              <p className="mt-1 text-gray-500">Скоро тут з&apos;являться відгуки наших клієнтів</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Головне зображення */}
                  <div className="relative h-48 bg-gray-200">
                    {review.images.length > 0 && (
                      <Image
                        src={review.images[0]}
                        alt="Торт"
                        fill
                        className="object-cover cursor-pointer"
                        onClick={() => {
                          setSelectedReview(review);
                          setSelectedImageIndex(0);
                        }}
                      />
                    )}
                    {review.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        +{review.images.length - 1} фото
                      </div>
                    )}
                  </div>

                  {/* Контент */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{review.cakeName}</h3>
                      <span className="text-pink-600 font-bold">
                        {formatPrice(review.totalPrice)} / {formatWeight(review.totalWeight)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {review.cakeDescription.length > 120
                        ? `${review.cakeDescription.substring(0, 120)}...`
                        : review.cakeDescription}
                    </p>

                    <div className="text-xs text-gray-500 mb-4">
                      {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setSelectedImageIndex(0);
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded text-sm transition-colors"
                      >
                        Переглянути
                      </button>
                      <button
                        onClick={() => handleOrderSame(review)}
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 px-3 rounded text-sm transition-colors"
                      >
                        Замовити
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Модальне вікно перегляду */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Кнопка закриття */}
              <button
                onClick={() => setSelectedReview(null)}
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-600 hover:text-gray-900 rounded-full p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Слайдер зображень */}
              <div className="relative h-96">
                <Image
                  src={selectedReview.images[selectedImageIndex]}
                  alt={`Торт ${selectedImageIndex + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Стрілки навігації */}
                {selectedReview.images.length > 1 && (
                  <>
                    {selectedImageIndex > 0 && (
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}

                    {selectedImageIndex < selectedReview.images.length - 1 && (
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </>
                )}

                {/* Індикатор поточного зображення */}
                {selectedReview.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {selectedReview.images.length}
                  </div>
                )}
              </div>

              {/* Мініатюри */}
              {selectedReview.images.length > 1 && (
                <div className="p-4 border-b">
                  <div className="flex space-x-2 overflow-x-auto">
                    {selectedReview.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${index === selectedImageIndex ? 'ring-2 ring-pink-500' : ''
                          }`}
                      >
                        <Image
                          src={image}
                          alt={`Торт ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Інформація про торт */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedReview.cakeName}</h3>
                  <span className="text-pink-600 font-bold text-xl">
                    {formatPrice(selectedReview.totalPrice)} / {formatWeight(selectedReview.totalWeight)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Опис торта:</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedReview.cakeDescription}</p>
                  </div>

                  <div className="text-sm text-gray-500">
                    Створено: {new Date(selectedReview.createdAt).toLocaleDateString('uk-UA')}
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => handleOrderSame(selectedReview)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
                  >
                    Замовити такий самий торт
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
