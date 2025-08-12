import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';
import PortfolioComponent from '@/components/Portfolio/Portfolio';
import Link from 'next/link';

export default function PortfolioPage() {
  return (
    <section className="">
      <PageBannerSimple
        currentPage='Портфоліо'
        title='Мої роботи'
        text='Кожна робота унікальна та створена з особливою увагою до деталей'
        image="/images/cataloge-banner.jpg"
      />

      <PortfolioComponent />

      { }
      <div className="bg-gradient-to-b from-white to-[#90e0ef]/10 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Мої роботи говорять самі за себе
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Кожен торт - це унікальна історія, створена з любов&apos;ю та майстерністю.
            Від елегантних весільних тортів до яскравих дитячих свят - я втілюю ваші мрії в реальність.
          </p>

          { }
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-[#90e0ef] mb-2">200+</div>
              <div className="text-gray-600 text-sm">Виконаних робіт</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-[#48cae4] mb-2">150+</div>
              <div className="text-gray-600 text-sm">Задоволених клієнтів</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-[#023e8a] mb-2">50+</div>
              <div className="text-gray-600 text-sm">Унікальних дизайнів</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-[#03045e] mb-2">100%</div>
              <div className="text-gray-600 text-sm">Натуральні інгредієнти</div>
            </div>
          </div>

          { }
          <div className="bg-gradient-to-r from-[#90e0ef] to-[#48cae4] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Готові замовити свій унікальний торт?</h3>
            <p className="text-white/90 mb-6">
              Зв&apos;яжіться зі мною, і я створю щось особливе саме для вас
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-[#48cae4] px-8 py-3 rounded-full font-semibold hover:bg-[#48cae4] hover:text-white transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Зв&apos;язатися зі мною
              </Link>
              <Link
                href="/order"
                className="bg-[#48cae4]/20 text-white border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#48cae4] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Зробити замовлення
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
