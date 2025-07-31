'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PhotoReview {
  _id: string;
  cakeName: string;
  cakeDescription: string;
  totalPrice: number;
  totalWeight: number;
  images: string[];
  completedDate: string;
  isApproved: boolean;
}

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  isActive: boolean;
}

export default function Home() {
  const [photoReviews, setPhotoReviews] = useState<PhotoReview[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Завантажуємо схвалені фото-відгуки
      const reviewsResponse = await fetch('/api/photo-reviews?approved=true');
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setPhotoReviews(reviewsData.slice(0, 6)); // Останні 6 відгуків
      }

      // Завантажуємо портфоліо
      const portfolioResponse = await fetch('/api/portfolio');
      if (portfolioResponse.ok) {
        const portfolioData = await portfolioResponse.json();
        setPortfolioItems(portfolioData.filter((item: PortfolioItem) => item.isActive).slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `${Math.round(price)} ₴`;
  };

  const formatWeight = (weight: number) => {
    return `${weight.toFixed(1)} кг`;
  };

  const services = [
    {
      icon: "🎂",
      title: "Весільні торти",
      description: "Створюємо неповторні торти для найважливішого дня у вашому житті",
      features: ["Індивідуальний дизайн", "Натуральні інгредієнти", "Різні смаки"]
    },
    {
      icon: "🎈",
      title: "Дитячі торти",
      description: "Яскраві та смачні торти, які зроблять свято незабутнім",
      features: ["Безпечні барвники", "Улюблені персонажі", "Інтерактивні елементи"]
    },
    {
      icon: "🎊",
      title: "Корпоративні торти",
      description: "Професійні торти для бізнес-заходів та корпоративів",
      features: ["Брендинг компанії", "Великі обсяги", "Швидка доставка"]
    },
    {
      icon: "🌸",
      title: "Торти на замовлення",
      description: "Реалізуємо будь-які ваші ідеї та фантазії",
      features: ["Унікальний дизайн", "Консультація кондитера", "3D моделювання"]
    }
  ];

  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video (primary) */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full h-full object-cover"
            poster="/images/homepage-background.jpeg"
            onCanPlay={() => console.log('Video can play')}
            onError={(e) => console.log('Video error:', e)}
            onLoadStart={() => console.log('Video load start')}
            preload="metadata"
          >
            <source src="/videos/large.mp4" type="video/mp4" />
            <source src="/videos/large.webm" type="video/webm" />
            Ваш браузер не підтримує відео.
          </video>
        </div>

        {/* Background Image (fallback) - тільки якщо відео не завантажується */}
        <div className="absolute inset-0 z-[-1]">
          <Image
            src="/images/homepage-background.jpeg"
            alt="Кондитерська Shy Cakes"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-black bg-opacity-30"></div>

        {/* Decorative elements */}
        <div className="absolute inset-0 z-20">
          <div className="absolute top-20 left-10 w-20 h-20 bg-pink-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-pink-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-pink-500/20 rounded-full blur-lg animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 bg-pink-400/15 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-30 text-center text-white px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Створюємо <span className="text-pink-400 animate-pulse">солодкі</span><br />
              <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
                моменти життя
              </span>
            </h1>
          </div>
          <div className="animate-fade-in-up delay-300">
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
              Авторські торти, капкейки та десерти, створені з любов&apos;ю та натуральними інгредієнтами
            </p>
          </div>
          <div className="animate-fade-in-up delay-500">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/catalog"
                className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Переглянути каталог
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
              >
                Зробити замовлення
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Про нашу <span className="text-pink-600">кондитерську</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Ми створюємо не просто торти - ми створюємо спогади. Кожен наш десерт - це поєднання
                майстерності, творчості та найкращих інгредієнтів. Наша команда досвідчених кондитерів
                втілює у життя найсміливіші ідеї наших клієнтів.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                З 2020 року ми радуємо киян неповторними тортами та десертами. Наша філософія проста:
                якість, креативність та індивідуальний підхід до кожного замовлення.
              </p>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Щасливих клієнтів</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">1000+</div>
                  <div className="text-sm text-gray-600">Створених тортів</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">4</div>
                  <div className="text-sm text-gray-600">Роки досвіду</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/homepage-background.jpeg"
                  alt="Наша кондитерська"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-pink-600 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-white text-3xl">🎂</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Наші <span className="text-pink-600">послуги</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ми спеціалізуємося на створенні унікальних тортів для будь-яких подій та святкувань
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 text-center">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{service.title}</h3>
                <p className="text-gray-600 mb-4 text-center">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-pink-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Reviews Section */}
      {!loading && photoReviews.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Наші <span className="text-pink-600">роботи</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ділимося нашими останніми творіннями та відгуками задоволених клієнтів
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {photoReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {review.images.length > 0 && (
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={review.images[0]}
                        alt={review.cakeName}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{review.cakeName}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{review.cakeDescription}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-600 font-bold">
                        {formatPrice(review.totalPrice)} / {formatWeight(review.totalWeight)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.completedDate).toLocaleDateString('uk-UA')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/reviews"
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Дивитися всі відгуки
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Section */}
      {!loading && portfolioItems.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Наше <span className="text-pink-600">портфоліо</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Колекція наших найкращих робіт різних категорій та стилів
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolioItems.map((item) => (
                <div
                  key={item._id}
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {item.images.length > 0 && (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                      <p className="text-sm opacity-90 line-clamp-2">{item.description}</p>
                      <span className="inline-block bg-pink-600 text-xs px-2 py-1 rounded-full mt-2">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/portfolio"
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Дивитися повне портфоліо
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Готові створити ваш ідеальний торт?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Зв&apos;яжіться з нами сьогодні, і ми перетворимо ваші ідеї в солодку реальність
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
            >
              Зробити замовлення
            </Link>
            <Link
              href="/catalog"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-pink-600 px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
            >
              Переглянути каталог
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
