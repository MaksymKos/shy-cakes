import {
  HeroSection,
  ServicesSection,
  StatsSection,
  ProcessSection,
  ProductsSection,
  ReviewsSwiperSection,
  FAQSection,
  CTASection
} from '@/components/Home';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <ProductsSection />
      <ProcessSection />
      <ReviewsSwiperSection />
      <ServicesSection />
      <StatsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
