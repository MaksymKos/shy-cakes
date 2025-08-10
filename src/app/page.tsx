import {
  HeroSection,
  ServicesSection,
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
      <ReviewsSwiperSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
