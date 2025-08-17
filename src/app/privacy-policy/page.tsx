export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-[#90e0ef]">Політика конфіденційності</h1>
      <div className="space-y-6 text-gray-800 text-base">
        <p>Ваша конфіденційність важлива для нас. Ми прагнемо захищати ваші персональні дані та використовувати їх лише для цілей, пов&apos;язаних із обробкою замовлень, покращенням сервісу та комунікацією з вами.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-[#90e0ef]">Які дані ми збираємо?</h2>
        <ul className="list-disc pl-6">
          <li>Ім&apos;я та прізвище</li>
          <li>Контактний номер телефону</li>
          <li>Email (за бажанням)</li>
          <li>Адреса доставки</li>
          <li>Деталі замовлення</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-[#90e0ef]">Як ми використовуємо ваші дані?</h2>
        <ul className="list-disc pl-6">
          <li>Для обробки та виконання ваших замовлень</li>
          <li>Для зв&apos;язку з вами щодо замовлення або сервісу</li>
          <li>Для покращення якості обслуговування</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-[#90e0ef]">Захист даних</h2>
        <p>Ми не передаємо ваші персональні дані третім особам, окрім випадків, передбачених законодавством України. Всі дані зберігаються на захищених серверах.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-[#90e0ef]">Ваші права</h2>
        <ul className="list-disc pl-6">
          <li>Ви можете запросити видалення або зміну ваших даних у будь-який час</li>
          <li>Ви можете звернутися до нас для отримання інформації про ваші дані</li>
        </ul>
        <p>З усіх питань щодо конфіденційності звертайтеся за контактами, вказаними на сайті.</p>
      </div>
    </div>
  );
}
