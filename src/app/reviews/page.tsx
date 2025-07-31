import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';

export default function ReviewsPage() {
  return (
    <div className="">
      <PageBannerSimple
        currentPage='Відгуки'
        title='Відгуки клієнтів'
        text='Дізнайтеся, що кажуть наші клієнти про наші солодощі'
        image="/images/cataloge-banner.jpg"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Відгуки поки що не додані</p>
          <p className="text-gray-400 mt-2">Скоро тут з&apos;являться відгуки наших клієнтів</p>
        </div>
      </div>
    </div>
  );
}