'use client';

import React, { useState } from 'react';
import { message } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';

import HeroSection from '@/components/demo-agent/HeroSection';
import TopicsDisplay from '@/components/demo-agent/TopicsDisplay';
import ArticlesCarousel from '@/components/demo-agent/ArticlesCarousel';
import CTASection from '@/components/demo-agent/CTASection';
import BrodAIStepProcess from '@/components/demo-agent/BrodAIStepProcess';

export default function DemoAgentPage() {
  // 1) States
  const [domain, setDomain] = useState('');
  const [showWorkingSteps, setShowWorkingSteps] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 2) Fake Data
  const fakeTopics = [
    {
      title: '🌱 Eco-friendly Products',
      detail: 'Low competition + stable 5k monthly searches!',
    },
    {
      title: '✈️ Budget Travel Tips',
      detail: 'Moderate competition, but 10k monthly searches!',
    },
    {
      title: '🥗 Healthy Meal Prep',
      detail: 'Rising trend, 8k monthly searches, low competition!',
    },
  ];

  const fakeArticles = [
    {
      title: '10 Eco-friendly Products That Will Save the Planet 🌎',
      preview:
        'Learn about bamboo toothbrushes, reusable grocery bags, and solar-powered gadgets that reduce carbon footprint...',
      query: 'eco-friendly products',
    },
    {
      title: 'Travel on a Tiny Budget ✈️',
      preview:
        'Discover hidden gems, cheap flight hacks, and local experiences that won’t break the bank...',
      query: 'budget travel tips',
    },
    {
      title: 'Meal Prep to Stay Healthy & Save Time 🥦',
      preview:
        'Cook once, eat all week. Quick recipes that keep you energized and stress-free...',
      query: 'healthy meal prep',
    },
  ];

  // 3) Handler: when user clicks "Analyze"
  const handleAnalyze = () => {
    if (!domain.trim()) {
      message.warning('Please enter a valid domain');
      return;
    }
    // Hide final results (if any), show the step process
    setShowResults(false);
    setShowWorkingSteps(true);
  };

  // Called after the 5-step process finishes
  const handleStepsFinished = () => {
    setShowWorkingSteps(false);
    setShowResults(true);
  };

  // 4) Page-Level Animations
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, staggerChildren: 0.2 },
    },
  };

  // 5) Render
  return (
    <div style={{ background: '#f8f9ff' }}>
      {/* Hero with typed heading, input, mini steps */}
      <HeroSection
        domain={domain}
        setDomain={setDomain}
        onAnalyze={handleAnalyze}
        showWorkingSteps={showWorkingSteps}
        showResults={showResults} // <-- NEW
      />

      {/* BrodAI "thinking" process, placed immediately below the Hero */}
      {showWorkingSteps && (
        <div style={{ margin: '20px auto 60px auto' }}>
          <BrodAIStepProcess onFinished={handleStepsFinished} />
        </div>
      )}
     <div>

      {/* Final Results, after the process finishes */}
      <AnimatePresence>
        {showResults && !showWorkingSteps && (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            style={{
              maxWidth: 800,
              margin: '40px auto 0 auto',
              textAlign: 'left',
              padding: '0 16px 40px',
            }}
          >
            <TopicsDisplay domain={domain} topics={fakeTopics} />
            {/* <ArticlesCarousel articles={fakeArticles} /> */}
            <CTASection domain={domain} />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
