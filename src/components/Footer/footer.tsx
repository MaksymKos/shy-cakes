"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { productCategories } = useCategories();

  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

            <div className="lg:col-span-1">
              <div className="mb-6">
                <div className="bg-white rounded-lg p-3 inline-block">
                  <Image
                    src="/images/logo-big.png"
                    width={120}
                    height={120}
                    alt='Shy Cakes Logo'
                    className="w-auto h-auto"
                    priority={false}
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4">
                Зв&apos;яжіться з нами
              </h3>

              <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                Створюємо унікальні торти з любов&apos;ю та майстерністю для ваших особливих моментів.
              </p>

              <div className="flex gap-3">
                <Link
                  aria-label="Instagram"
                  href="https://www.instagram.com/shy__cakes/"
                  target='_blank'
                  rel="noreferrer"
                  className="bg-pink-600 p-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </Link>

                <Link
                  href="https://t.me/elin_pak"
                  target='_blank'
                  rel="noreferrer"
                  className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span className="sr-only">Telegram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
                  </svg>
                </Link>

                <Link
                  href="tel:+380636787525"
                  className="bg-green-600 p-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span className="sr-only">Телефон</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

                <div>
                  <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                    Каталог продукції
                  </h3>
                  <nav aria-label="Нижня навігація">
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/catalog" className="text-gray-300 hover:text-white transition-colors">
                          Всі торти
                        </Link>
                      </li>
                      {productCategories.map((category) => (
                        <li key={category.value}>
                          <Link
                            href={`/catalog?category=${encodeURIComponent(category.value)}`}
                            className="text-gray-300 hover:text-white transition-colors"
                          >
                            {category.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                    Інформація
                  </h3>
                  <nav aria-label="Нижня навігація">
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                          Про мене
                        </Link>
                      </li>
                      <li>
                        <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">
                          Портфоліо
                        </Link>
                      </li>
                      <li>
                        <Link href="/reviews" className="text-gray-300 hover:text-white transition-colors">
                          Відгуки
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                          Контакти
                        </Link>
                      </li>
                    </ul>
                  </nav>

                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                    Особистий кабінет
                  </h3>
                  <nav aria-label="Нижня навігація">
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
                          Профіль
                        </Link>
                      </li>
                      <li>
                        <Link href="/orders" className="text-gray-300 hover:text-white transition-colors">
                          Мої замовлення
                        </Link>
                      </li>
                      <li>
                        <Link href="/liked" className="text-gray-300 hover:text-white transition-colors">
                          Улюблені
                        </Link>
                      </li>
                    </ul>
                  </nav>

                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <small className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {currentYear} <span itemProp="name">Shy Cakes.</span> Всі права захищені. Створено з ❤️ у Вінниці
              </small>
              <div className="flex items-center space-x-4">
                <Link area-label="Підтримка" href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Підтримка
                </Link>
                <Link area-label="Політика конфіденційності" href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Політика конфіденційності
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
