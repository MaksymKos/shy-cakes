import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';

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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Моя історія</h2>
          <p className="text-gray-600 mb-6">
            Тут буде розповідь про вашу історію, досвід у кондитерській справі
            та підхід до створення унікальних десертів.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Наша місія</h2>
          <p className="text-gray-600 mb-6">
            Опишіть вашу місію та цінності у створенні солодощів.
          </p>
        </div>
      </div>
    </div>
  );
}