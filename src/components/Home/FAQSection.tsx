'use client';

import { useState, useEffect } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [faqData, setFaqData] = useState<FAQItem[]>([
    {
      id: 1,
      question: "Питання 1?",
      answer: "Відповідь на перше питання. Тут буде детальна інформація."
    },
    {
      id: 2,
      question: "Декор",
      answer: "Ваш торт може бути будь-якого кольору, з бажаним надписом, прикрашений шоколадними або живими квітами, шоколадними фігурками, кульками, цукровими картинками, ручним розписом, макаронами, мусовими серцями, сезонними ягодами тощо. Фінальна вартість десерта з декором розраховується окремо, залежно від оформлення і розміру торта."
    },
    {
      id: 3,
      question: "За скільки часу робити замовлення?",
      answer: "Ми завжди маємо вільні торти «на сьогодні» вагою 1 кг, замовити можна навіть в останній момент і не турбуватись про свято! В такому випадку ми запропонуємо вам наявні смаки з меню. Замовлення будь-якого смаку з меню приймаємо за 7 днів до потрібної дати. Якщо ви бажаєте прикрасити свій торт декором, що виготовляється спеціально для вас, наприклад іменні топпери, картинки з фото – тоді замовлення варто робити раніше."
    },
    {
      id: 4,
      question: "Як забрати замовлення?",
      answer: "Забрати десерти можна щодня з 11:00 до 20:00 години, або ж скористатись доставкою: діє на замовлення від 450 грн в межах 3 км, від 600 грн в межах 3-10 км і від 1000 грн понад 10 км та найближче передмістя Вінниці. Працює щодня з 12:30 до 21:00 години, коштує 90 грн."
    }
  ]);

  // Load FAQ data from API
  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        const response = await fetch('/api/faq');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setFaqData(data);
          }
        }
      } catch {
        // Keep default data if API fails
      }
    };

    fetchFAQData();
  }, []);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Часті питання
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Знайдіть відповіді на найпоширеніші питання про наші торти
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800 pr-4">
                  {item.question}
                </h3>
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-transform duration-300 ${openItem === item.id ? 'rotate-180' : ''
                  }`}>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openItem === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="px-6 pb-5">
                  <div className="h-px bg-gradient-to-r from-pink-200 to-purple-200 mb-4"></div>
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        { }
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-3">
              Не знайшли відповідь?
            </h3>
            <p className="text-pink-100 mb-6">
              Зв&apos;яжіться з нами, і ми відповімо на всі ваші питання!
            </p>
            <button className="bg-white text-pink-600 font-semibold px-8 py-3 rounded-full hover:bg-pink-50 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Зв&apos;язатися з нами
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
