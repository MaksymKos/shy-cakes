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
      <ServicesSection />
      <ProductsSection />
      <StatsSection />
      <ReviewsSwiperSection />
      <ProcessSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
