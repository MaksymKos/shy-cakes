import PageBannerSimple from '@/components/PageBannerSimple/pagebannersimple';
import PortfolioComponent from '@/components/Portfolio/Portfolio';


export default function PortfolioPage() {
  return (
    <section className="">
      <PageBannerSimple
        currentPage='Портфоліо'
        title='Портфоліо'
        text='Портфоліо' 
        image="/images/cataloge-banner.jpg"
      />
      <PortfolioComponent />
    </section>
  );
}