// app/page.tsx
import CTASection from '../components/home/CTASection';
import SEOProcessTimeline from '@/components/home/SEOProcessTimeline';
import PricingSection from '@/components/home/PricingSection';
import HeroSection from '@/components/home/HeroSection'; 
import FaqSection from '@/components/home/FaqSection';
import BrodAIAnalysisSection from '@/components/home/BrodaiAnalysisSection';
import BrodAIHeroAnalysis from '@/components/home/testsection';

export default function HomePage() {
  return (
    <>
      <BrodAIHeroAnalysis />
      {/* <BrodAIAnalysisSection /> */}
      <SEOProcessTimeline />
      <PricingSection />
      <FaqSection />
      <CTASection />
    </>
  );
}
