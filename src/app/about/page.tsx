import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';

export default function AboutPage() {
  return (
    <div className="">
      <PageBannerSimple 
        currentPage='Про мене'
        title='Про мене'
        text='Про мене' 
        image="/images/cataloge-banner.jpg"
      />
    </div>
  );
}