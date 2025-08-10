import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="">
      <PageBannerSimple
        currentPage='Про мене'
        title='Про мене'
        text='Дізнайтеся більше про нашу історію та підхід до створення солодощів'
        image="/images/cataloge-banner.jpg"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Моя історія</h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-center">
                Ласка запрошую до світу вишуканих десертів та тортів, що народжуються з любов&apos;ю!
                Я - Аліна, майстер, який протягом декількох років вдосконалює свої навички у
                кондитерському мистецтві.
              </p>

              <p className="text-gray-600 mb-6 leading-relaxed text-center">
                Постійно покращую як теоретичну, так і практичну базу своїх вмінь.
                Від елегантних тортів на пам&apos;ятні дати до казкових маленьких десертів які
                прикрасять кожен Ваш день.
              </p>

              <p className="text-gray-600 mb-8 leading-relaxed text-center">
                Приєднуйтесь до цієї захоплюючої подорожі світом смаків та ароматів, де кожен
                торт розповідає свою історію, а кожен шматочок - це радість та задоволення.
              </p>

              {}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-pink-600 mb-2">200+</div>
                  <div className="text-gray-700 font-medium">Виконаних робіт</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
                  <div className="text-gray-700 font-medium">Задоволених клієнтів</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-pink-500 mb-2">50+</div>
                  <div className="text-gray-700 font-medium">Унікальних дизайнів</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-500 mb-2">100%</div>
                  <div className="text-gray-700 font-medium">Натуральні інгредієнти</div>
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/about/alinka1.jpg"
                  alt="Аліна - майстер кондитер"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/about/alinka2.jpg"
                  alt="Робочий процес кондитера"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Наша місія</h2>
            <p className="text-gray-700 text-center text-lg leading-relaxed max-w-4xl mx-auto">
              Створювати не просто десерти, а справжні витвори мистецтва, які приносять радість
              та роблять кожне свято незабутнім. Ми віримо, що кожен торт має свою душу та історію,
              а наше завдання - втілити ваші мрії у найсмачніших формах.
            </p>
          </div>

          {}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Мої сертифікати</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-lg overflow-hidden shadow-lg bg-white">
                <Image
                  src="/images/about/cert1.jpg"
                  alt="Сертифікат 1 - професійне навчання кондитера"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg bg-white">
                <Image
                  src="/images/about/cert2.jpg"
                  alt="Сертифікат 2 - підвищення кваліфікації"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <p className="text-gray-600 mt-6 text-center">
              Постійне навчання та вдосконалення професійних навичок - основа якісної роботи
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
