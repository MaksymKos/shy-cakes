import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';

export default function CatalogPage() {
  return (
    <div className="">
      <PageBannerSimple 
        currentPage='Каталог'
        title='Каталог'
        text='У нашому каталозі ви знайдете мусові та бісквітні торти на будь-який смак — від ніжної класики до креативних новинок. Також пропонуємо кейк попси, ескімо-десерти та яскраві макаронси — ідеальні для свят чи подарунків. Обирайте серед готових подарункових наборів або створіть власний солодкий мікс!' 
        image="/images/cataloge-banner.jpg"
      />
    </div>
  );
}