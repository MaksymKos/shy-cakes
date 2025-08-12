import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-[#90e0ef]/5 via-white to-[#48cae4]/5">
      <PageBannerSimple
        currentPage='Про мене'
        title='Про мене'
        text='Дізнайтеся більше про мою історію та підхід до створення солодощів'
        image="/images/cataloge-banner.jpg"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          {/* Основна історія */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-[#023e8a] to-[#03045e] bg-clip-text text-transparent mb-6">
                  Моя історія
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] mx-auto mb-8 rounded-full"></div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Ласкаво прошу до світу <span className="font-semibold text-[#023e8a]">SHY CAKES</span> — місця, де кожен торт чи десерт створюється з любов&apos;ю та турботою.
                  Мене звати <span className="font-semibold text-[#023e8a]">Аліна</span> – я майстер, який протягом декількох років вдосконалює свої навички у кондитерському мистецтві.
                  Постійно покращую як теоретичну, так і практичну базу своїх вмінь.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mt-4">
                  Від елегантних тортів на пам&apos;ятні дати до казкових маленьких десертів які прикрасять кожен Ваш день.
                  Приєднуйтесь до цієї захоплюючої подорожі світом смаків та ароматів, де кожен торт розповідає свою історію,
                  а кожен шматочок - це радість та задоволення.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-[#90e0ef]/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-[#023e8a] mb-2">200+</div>
                  <div className="text-gray-700 font-medium">Виконаних робіт</div>
                </div>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-[#48cae4]/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-[#03045e] mb-2">150+</div>
                  <div className="text-gray-700 font-medium">Задоволених клієнтів</div>
                </div>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-[#90e0ef]/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-[#023e8a] mb-2">50+</div>
                  <div className="text-gray-700 font-medium">Унікальних дизайнів</div>
                </div>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-[#48cae4]/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-[#03045e] mb-2">100%</div>
                  <div className="text-gray-700 font-medium">Натуральні інгредієнти</div>
                </div>
              </div>
            </div>

            {/* Фото секція */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              <div className="relative group">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm border-4 border-[#90e0ef]/30">
                  <Image
                    src="/images/about/alinka1.jpg"
                    alt="Аліна - майстер кондитер"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#023e8a]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="relative group">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm border-4 border-[#48cae4]/30">
                  <Image
                    src="/images/about/alinka2.jpg"
                    alt="Робочий процес кондитера"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#03045e]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          {/* Місія */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 mb-16 border-2 border-[#90e0ef]/30 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#90e0ef] via-[#48cae4] to-[#90e0ef]"></div>
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#023e8a] to-[#03045e] bg-clip-text text-transparent mb-6">
                Моя місія
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] mx-auto mb-8 rounded-full"></div>
              <p className="text-gray-700 text-xl leading-relaxed max-w-4xl mx-auto">
                Створювати не просто десерти, а справжні витвори мистецтва, які приносять радість
                та роблять кожне свято незабутнім. Я вірю, що кожен торт має свою душу та історію,
                а моє завдання - втілити ваші мрії у найсмачніших формах.
              </p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-[#90e0ef]/20 to-[#48cae4]/20 rounded-full blur-xl"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-[#48cae4]/20 to-[#90e0ef]/20 rounded-full blur-xl"></div>
          </div>

          {/* Сертифікати */}
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#023e8a] to-[#03045e] bg-clip-text text-transparent mb-6">
              Мої сертифікати
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] mx-auto mb-12 rounded-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="group relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm border-4 border-[#90e0ef]/30 hover:border-[#90e0ef]/60 transition-all duration-300">
                  <Image
                    src="/images/about/cert1.jpg"
                    alt="Сертифікат 1 - професійне навчання кондитера"
                    width={500}
                    height={375}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#023e8a]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="group relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm border-4 border-[#48cae4]/30 hover:border-[#48cae4]/60 transition-all duration-300">
                  <Image
                    src="/images/about/cert2.jpg"
                    alt="Сертифікат 2 - підвищення кваліфікації"
                    width={500}
                    height={375}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#03045e]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#90e0ef]/30 shadow-lg max-w-3xl mx-auto">
              <p className="text-gray-700 text-lg font-medium">
                Постійне навчання та вдосконалення професійних навичок - основа якісної роботи
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
