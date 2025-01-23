// app/page.tsx
import CTASection from '../components/home/CTASection';
import SEOProcessTimeline from '@/components/home/SEOProcessTimeline';
import PricingSection from '@/components/home/PricingSection';
import HeroSection from '@/components/home/HeroSection'; 
import FaqSection from '@/components/home/FaqSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SEOProcessTimeline />
      <PricingSection />
      <FaqSection />
      <CTASection />
    </>
  );
}
