'use client';

import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

import DomainInputSection from '@/components/demo-agent/DomainInputSection';

type HeroSectionProps = {
  domain: string;
  setDomain: (value: string) => void;
  onAnalyze: () => void;
  showWorkingSteps: boolean;
  showResults: boolean;
};

export default function HeroSection({
  domain,
  setDomain,
  onAnalyze,
  showWorkingSteps,
  showResults,
}: HeroSectionProps) {
  // Typed heading
  const [text] = useTypewriter({
    words: [
      'A 24/7 SEO Consultant...',
      'Daily Site Audits & Error Fixes...',
      'Trend Research & Fresh Content...',
      'Link Building & Publications...',
    ],
    loop: 0,
    typeSpeed: 60,
    deleteSpeed: 50,
    delaySpeed: 1200,
  });

  // Fade-up for each mini “How It Works” step
  const stepVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  // Mini steps with images
  // The last step has isLast: true so we apply a different background
  const miniSteps = [
    {
      text: 'Daily SEO Audits & Automatic Error Fixes',
    },
    {
      text: 'Research Trending Keywords & Create Fresh Content',
    },
    {
      text: 'Build Backlinks',
    },
    {
      text: 'Automatically Publishes on Your Website',
    },
    {
      text: 'Repeat 24/7',
      isLast: true, // We'll check this below
    },
  ];

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      {/* Animated heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          fontSize: '2rem',
          color: '#2563EB',
          marginBottom: '16px',
          fontWeight: 'bold',
        }}
      >
        BrodAI: 
        <span style={{ marginLeft: 8 }}>{text}</span>
        <Cursor cursorColor="#2563EB" />
      </motion.h1>

      {/* Subheading */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        style={{
          color: '#555',
          marginBottom: 24,
          fontSize: '1.15rem',
          maxWidth: 800,
          margin: '0 auto',
          lineHeight: 1.5,
        }}
      >
        BrodAI is your <strong>24/7</strong> SEO consultant. Every day, it audits your site,
        fixes errors, researches <strong>trending keywords</strong>, and publishes new articles.
      </motion.h2>

      {/* Domain Input */}
      <Row justify="center" style={{ marginTop: 20, marginBottom: 20 }}>
        <Col xs={24} sm={20} md={14} lg={12}>
          <DomainInputSection
            domain={domain}
            setDomain={setDomain}
            onAnalyze={onAnalyze}
          />
        </Col>
      </Row>

      {/* Only show mini steps if user hasn't started working steps AND final results not shown */}
      {!showWorkingSteps && !showResults && (
        <>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '1.15rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#333',
            }}
          >
            How It Works
          </motion.h3>

          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'left' }}>
            {miniSteps.map((step, i) => {
              const isLastStep = !!step.isLast;

              return (
                <motion.div
                  key={step.text}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={stepVariants}
                  style={{
                    marginBottom: '1rem',
                    background: isLastStep ? '#e0f2fe' : '#fff', // Different BG for last step
                    borderRadius: 8,
                    padding: '1rem 1.2rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  {/* Step number circle */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#2563EB',
                      color: '#fff',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Step content: image + text */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.4 }}>
                      {step.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
