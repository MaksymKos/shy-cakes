import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

export default function ContactPage() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">

      <Breadcrumbs path="Контакти" />

      <h1 className="text-3xl font-bold mb-8 text-center">Контакти</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-md rounded-lg p-6">

        {/* Ліва колонка */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-gray-800">Консультації та замовлення</h4>
          <p className="mb-2">
            <a
              href="https://www.instagram.com/shy__cakes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline"
            >
              Instagram
            </a>
          </p>
          <p className="mb-2">
            <a
              href="https://t.me/elin_pak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Telegram
            </a>
          </p>
          <p className="mb-2">
            <a
              href="tel:+380636787525"
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:underline"
            >
              +380 63 678 7525
            </a>
          </p>
        </div>

        {/* Права колонка */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-gray-800">Час роботи</h4>
          <p className="mb-1">Пн-Пт: <span className="text-gray-700">9:00 – 20:00</span></p>
          <p className="mb-1">Сб: <span className="text-gray-700">10:00 – 13:00</span></p>
          <p className="mb-1">Нд: <span className="text-gray-700">10:00 – 13:00</span></p>
        </div>
      </div>
    </div>

  );
}