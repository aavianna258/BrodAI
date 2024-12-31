'use client';

import React from 'react';
import HeroSection from '@/components/home/HeroSection2';
import BrandIcons from '@/components/home/BrandIcons';
import FeaturesSection from '@/components/home/FeaturesSection';
import PricingSection from '@/components/home/PricingSection';
import FaqSection from '@/components/home/FaqSection';

export default function HomePage() {
  return (
    // Since NavBar is in layout.tsx, we only show content here
    <div style={{ padding: '60px 24px', background: '#fff' }}>
      <HeroSection />
      <BrandIcons />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
    </div>
  );
}
