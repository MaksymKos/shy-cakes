'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  completedDate: string;
}

function ReviewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reviews, setReviews] = useState<PhotoReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<PhotoReview | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const closeModal = useCallback(() => {
    setSelectedReview(null);
    setSelectedImageIndex(0);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('open');
    router.replace(`/reviews${newParams.toString() ? `?${newParams.toString()}` : ''}`);
  }, [searchParams, router]);

  useEffect(() => {
    const openReviewId = searchParams.get('open');
    if (openReviewId && reviews.length > 0) {
      const reviewToOpen = reviews.find(review => review._id === openReviewId);
      if (reviewToOpen) {
        setSelectedReview(reviewToOpen);
        setSelectedImageIndex(0);
      }
    }
  }, [searchParams, reviews]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedReview) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedReview, closeModal]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/photo-reviews?approved=true');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSame = (review: PhotoReview) => {
    router.push(`/order?description=${encodeURIComponent(review.cakeDescription)}&price=${review.totalPrice}&weight=${review.totalWeight}&reviewId=${review._id}&cakeName=${encodeURIComponent(review.cakeName)}`);
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
    return `${price} ₴`;
  };

  const formatWeight = (weight: number) => {
    return `${weight} кг`;
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

          { }
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
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex flex-col lg:flex-row lg:items-stretch">
                    { }
                    <div className="flex flex-row items-center space-x-2 w-full lg:w-60 lg:min-w-[240px] p-4">
                      {review.images.length > 0 && (
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                          <Image
                            src={review.images[0]}
                            alt="Торт"
                            fill
                            className="object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => {
                              setSelectedReview(review);
                              setSelectedImageIndex(0);
                            }}
                          />
                          {review.images.length > 1 && (
                            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold shadow-lg">
                              +{review.images.length - 1}
                            </div>
                          )}
                        </div>
                      )}
                      { }
                      {review.images.length > 1 && (
                        <div className="flex flex-col space-y-1 sm:space-y-2 ml-2">
                          {review.images.slice(1, 4).map((img, idx) => (
                            <div
                              key={idx}
                              className="relative w-8 h-8 sm:w-12 sm:h-12 rounded overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 hover:ring-pink-400"
                              onClick={() => {
                                setSelectedReview(review);
                                setSelectedImageIndex(idx + 1);
                              }}
                            >
                              <Image
                                src={img}
                                alt={`Торт ${idx + 2}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {review.images.length > 4 && (
                            <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 font-semibold">
                              +{review.images.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    { }
                    <div className="flex-1 p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 lg:pr-6 mb-4 lg:mb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight mb-2 sm:mb-0">{review.cakeName}</h3>
                          <div className="flex items-center space-x-2 sm:space-x-3 sm:ml-4">
                            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full font-bold text-xs sm:text-sm">
                              {formatPrice(review.totalPrice)}
                            </div>
                            <div className="bg-gray-100 text-gray-700 px-2 py-1 sm:px-3 sm:py-1 rounded-full font-semibold text-xs sm:text-sm">
                              {formatWeight(review.totalWeight)}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2 sm:line-clamp-3">
                          {review.cakeDescription.length > 100
                            ? `${review.cakeDescription.substring(0, 100)}...`
                            : review.cakeDescription}
                        </p>

                      </div>

                      { }
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setSelectedImageIndex(0);
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          Переглянути
                        </button>
                        <button
                          onClick={() => handleOrderSame(review)}
                          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          Замовити
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      { }
      {selectedReview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-7xl w-full h-[95vh] sm:h-[90vh] overflow-hidden shadow-2xl">
            { }
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-full p-2 sm:p-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            { }
            <div className="flex flex-col lg:flex-row h-full">
              { }
              <div className="w-full lg:w-1/2 relative bg-gradient-to-br from-gray-100 to-gray-200 h-1/2 lg:h-full">
                <Image
                  src={selectedReview.images[selectedImageIndex]}
                  alt={`Торт ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                />

                { }
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>

                { }
                {selectedReview.images.length > 1 && (
                  <>
                    {selectedImageIndex > 0 && (
                      <button
                        onClick={prevImage}
                        className="absolute left-2 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer"
                      >
                        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}

                    {selectedImageIndex < selectedReview.images.length - 1 && (
                      <button
                        onClick={nextImage}
                        className="absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer"
                      >
                        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </>
                )}

                { }
                {selectedReview.images.length > 1 && (
                  <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                    {selectedImageIndex + 1} / {selectedReview.images.length}
                  </div>
                )}

                { }
                {selectedReview.images.length > 1 && (
                  <div className="hidden lg:block absolute bottom-4 left-4 right-4">
                    <div className="flex space-x-2 scrollbar-hide overflow-x-auto">
                      {selectedReview.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all duration-300 ${index === selectedImageIndex
                            ? 'ring-2 ring-pink-500 shadow-lg scale-105'
                            : 'ring-1 ring-white/50 hover:ring-white hover:scale-105'
                            }`}
                        >
                          <Image
                            src={image}
                            alt={`Торт ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {index === selectedImageIndex && (
                            <div className="absolute inset-0 bg-pink-500/20"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              { }
              <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-1/2 lg:h-full overflow-y-auto">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3 sm:mb-0">{selectedReview.cakeName}</h3>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-sm sm:text-lg lg:text-xl shadow-lg">
                        {formatPrice(selectedReview.totalPrice)}
                      </div>
                      <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-sm sm:text-base lg:text-lg">
                        {formatWeight(selectedReview.totalWeight)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">{selectedReview.cakeDescription}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 space-y-2 sm:space-y-0">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Виконано: {new Date(selectedReview.completedDate).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Готовий до замовлення
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4 sm:mt-6">
                  <button
                    onClick={() => handleOrderSame(selectedReview)}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg lg:text-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 cursor-pointer w-full sm:w-auto"
                  >
                    🍰 Замовити такий торт
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

export default function ReviewsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-2 text-gray-600">Завантаження відгуків...</p>
          </div>
        </div>
      </div>
    }>
      <ReviewsContent />
    </Suspense>
  );
}
