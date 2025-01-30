// src/components/demo-agent/BrodAIStepProcess.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BrodAIStep = {
  title: string;
  text: string;
  duration: number; // milliseconds
};

type BrodAIStepProcessProps = {
  onFinished: () => void;
};

export default function BrodAIStepProcess({ onFinished }: BrodAIStepProcessProps) {
  const steps: BrodAIStep[] = [
    {
      title: 'Step 1: Identifying High-Opportunity Keywords',
      text: 'BrodAI is scanning your niche to find hidden SEO gems with strong traffic potential.',
      duration: 2000, 
    },
    {
      title: 'Step 2: Analyzing Competitor Gaps',
      text: 'Evaluating what competitors are missing so you can rank faster with less competition.',
      duration: 2000,
    },
    // {
    //   title: 'Step 3: Writing Article #1',
    //   text: 'Drafting a comprehensive, data-driven piece designed to capture top positions on Google.',
    //   duration: 1500,
    // },
    // {
    //   title: 'Step 4: Writing Article #2',
    //   text: 'Adding strategic links, visuals, and expert insights to create another SEO-ready post.',
    //   duration: 1500, 
    // },
    // {
    //   title: 'Step 5: Writing Article #3',
    //   text: 'Finalizing a third rich-media article to diversify your content and boost authority.',
    //   duration: 1500,
    // },
    {
      title: 'Step 3: Refining High-Impact Keywords',
      text: 'BrodAI is fine-tuning your keyword strategy to maximize search engine visibility and drive targeted traffic.',
      duration: 2000, 
    },
    ];

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const currentStepDuration = steps[stepIndex].duration;
    const timer = setTimeout(() => {
      if (stepIndex === steps.length - 1) {
        // Final step
        setTimeout(() => onFinished(), 800);
      } else {
        setStepIndex(stepIndex + 1);
      }
    }, currentStepDuration);

    return () => clearTimeout(timer);
  }, [stepIndex, onFinished, steps]);

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: { opacity: 0, y: 10 },
  };

  const currentStep = steps[stepIndex];

  return (

    <div style={{ margin: '20px auto 200px auto', textAlign: 'center' }}>
      <AnimatePresence mode="wait">
        {/* Title */}
        <motion.h3
          key={`title-${stepIndex}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            marginBottom: 8,
            color: '#2563EB',
            fontSize: '1.8rem',
            fontWeight: 'bold',
          }}
        >
          {currentStep.title}
        </motion.h3>

        {/* The container with the descriptive text */}
        <motion.div
          key={`text-${stepIndex}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            margin: '0 auto',
            maxWidth: 600,
            background: '#f5faff',
            padding: 16,
            borderRadius: 8,
            minHeight: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <p style={{ margin: 10, color: '#333', fontSize: '1.1rem' }}>
            {currentStep.text}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
