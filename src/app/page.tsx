import {
  HeroSection,
  ServicesSection,
  ReviewsSwiperSection,
  CTASection
} from '@/components/Home';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <ServicesSection />
      <ReviewsSwiperSection />
      <CTASection />
    </div>
  );
}
