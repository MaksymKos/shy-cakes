export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#90e0ef] via-[#48cae4] to-[#00b4d8] flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-[#90e0ef]">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-[#00b4d8] text-center tracking-tight drop-shadow-lg transition hover:text-[#0077b6]">Умови використання</h1>
        <div className="space-y-8 text-gray-800 text-base">
          <p className="text-lg">Вітаємо на сайті <span className="font-semibold text-[#0077b6]">Shy Cakes</span>! Користуючись нашим сервісом, ви погоджуєтесь з наступними умовами:</p>
          <h2 className="text-xl font-bold mt-8 mb-3 text-[#48cae4] hover:text-[#00b4d8] transition-colors">1. Реєстрація та акаунт</h2>
          <ul className="list-disc pl-6">
            <li>Ви зобов&apos;язуєтесь надавати правдиву інформацію при реєстрації</li>
            <li>Ви несете відповідальність за безпеку свого акаунту</li>
          </ul>
          <h2 className="text-xl font-bold mt-8 mb-3 text-[#48cae4] hover:text-[#00b4d8] transition-colors">2. Замовлення та оплата</h2>
          <ul className="list-disc pl-6">
            <li>Всі замовлення підтверджуються після внесення передоплати</li>
            <li>Вартість та умови доставки узгоджуються індивідуально</li>
          </ul>
          <h2 className="text-xl font-bold mt-8 mb-3 text-[#48cae4] hover:text-[#00b4d8] transition-colors">3. Відповідальність</h2>
          <ul className="list-disc pl-6">
            <li>Ми не несемо відповідальності за затримки, спричинені форс-мажорними обставинами</li>
            <li>У разі виникнення питань звертайтеся до служби підтримки</li>
          </ul>
          <h2 className="text-xl font-bold mt-8 mb-3 text-[#48cae4] hover:text-[#00b4d8] transition-colors">4. Зміни умов</h2>
          <p>Ми залишаємо за собою право змінювати умови використання. Оновлені умови публікуються на цій сторінці.</p>
          <p className="font-semibold text-center text-[#0077b6] mt-8">Дякуємо, що обираєте Shy Cakes!</p>
        </div>
      </div>
    </div>
  );
}
