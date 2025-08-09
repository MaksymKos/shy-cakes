'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';

export default function ContactPage() {
  const [_hoveredContact, setHoveredContact] = useState<string | null>(null);

  const contactMethods = [
    {
      id: 'instagram',
      title: 'Instagram',
      subtitle: '@shy__cakes',
      description: 'Переглядайте наші останні роботи та отримуйте натхнення',
      href: 'https://www.instagram.com/shy__cakes/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
    },
    {
      id: 'telegram',
      title: 'Telegram',
      subtitle: '@elin_pak',
      description: 'Швидкі консультації та оперативні відповіді на запитання',
      href: 'https://t.me/elin_pak',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'phone',
      title: 'Телефон',
      subtitle: '+380 63 678 7525',
      description: 'Персональні консультації та детальне обговорення замовлень',
      href: 'tel:+380636787525',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
    },
  ];

  const workingHours = [
    { days: 'Понеділок - П\'ятниця', hours: '9:00 – 20:00', icon: '🌅' },
    { days: 'Субота - Неділя', hours: '10:00 – 13:00', icon: '🌤️' },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <PageBannerSimple
        currentPage='Контакти'
        title='Зв&apos;яжіться з нами'
        text='Оберіть зручний спосіб зв&apos;язку та отримайте персональну консультацію'
        image="/images/cataloge-banner.jpg"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Methods */}
          <div className="lg:col-span-2">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Консультації та замовлення
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Оберіть найзручніший для вас спосіб зв&apos;язку. Ми завжди готові відповісти на ваші запитання та допомогти з оформленням замовлення.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {contactMethods.map((method) => (
                <a
                  key={method.id}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative overflow-hidden rounded-2xl border-2 ${method.borderColor} ${method.bgColor} p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2`}
                  onMouseEnter={() => setHoveredContact(method.id)}
                  onMouseLeave={() => setHoveredContact(null)}
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  {/* Floating animation elements */}
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="animate-bounce">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {method.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                      {method.title}
                    </h3>

                    <p className="text-lg font-semibold text-gray-700 mb-3">
                      {method.subtitle}
                    </p>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {method.description}
                    </p>

                    {/* Hover indicator */}
                    <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-pink-600 transition-colors duration-300">
                      <span>Зв&apos;язатися</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Animated border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
                </a>
              ))}
            </div>
          </div>

          {/* Working Hours Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Working Hours Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Час роботи</h3>
                  <p className="text-gray-600">Ми працюємо для вас</p>
                </div>

                <div className="space-y-4">
                  {workingHours.map((schedule, index) => (
                    <div key={index} className="flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-pink-50 hover:to-purple-50 transition-all duration-300 group">
                      <span className="text-2xl mr-4 group-hover:animate-pulse">{schedule.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{schedule.days}</p>
                        <p className="text-lg font-bold text-gray-900">{schedule.hours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Tips Card */}
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Швидкі поради</h3>
                  <ul className="text-sm space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">✨</span>
                      <span>Замовляйте за 2-3 дні до потрібної дати</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">📱</span>
                      <span>Telegram - найшвидший спосіб зв&apos;язку</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">🎂</span>
                      <span>Індивідуальні торти обговорюються персонально</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-20">
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Готові створити щось особливе? 🎂
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Кожен торт - це унікальна історія. Розкажіть нам про ваше свято, і ми створимо десерт,
                який стане його найсолодшим моментом. Від класичних рецептів до сміливих експериментів -
                ми втілюємо ваші найкращі ідеї в реальність.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Переглянути каталог
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-pink-300 hover:text-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                  </svg>
                  Наші роботи
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}