import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';
import PortfolioComponent from '@/components/Portfolio/Portfolio';
import Link from 'next/link';

export default function PortfolioPage() {
  return (
    <section className="">
      <PageBannerSimple
        currentPage='Портфоліо'
        title='Портфоліо'
        text='Перегляньте наші найкращі роботи та надихніться для свого замовлення'
        image="/images/cataloge-banner.jpg"
      />

      <PortfolioComponent />

      {/* Enhanced Introduction Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Наші роботи говорять самі за себе
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Кожен торт - це унікальна історія, створена з любов&apos;ю та майстерністю.
            Від елегантних весільних тортів до яскравих дитячих свят - ми втілюємо ваші мрії в реальність.
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-pink-600 mb-2">200+</div>
              <div className="text-gray-600 text-sm">Виконаних робіт</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
              <div className="text-gray-600 text-sm">Задоволених клієнтів</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-pink-500 mb-2">50+</div>
              <div className="text-gray-600 text-sm">Унікальних дизайнів</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-purple-500 mb-2">100%</div>
              <div className="text-gray-600 text-sm">Натуральні інгредієнти</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Готові замовити свій унікальний торт?</h3>
            <p className="text-pink-100 mb-6">
              Зв&apos;яжіться з нами, і ми створимо щось особливе саме для вас
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Зв&apos;язатися з нами
              </Link>
              <Link
                href="/catalog"
                className="bg-pink-600 bg-opacity-20 text-white border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Переглянути каталог
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}