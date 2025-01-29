'use client'; // if Next.js 13 in /app folder

import React, { useState } from 'react';
import { Row, Col, Input, Button, message, Card, Carousel } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

import BrodAIStepProcess from '@/components/demo-agent/BrodAIStepProcess'; // The new step-by-step

export default function DemoAgentPage() {
  // -------------------------------------------------------------------------
  // 1) States
  // -------------------------------------------------------------------------
  const [domain, setDomain] = useState('');
  const [showWorkingSteps, setShowWorkingSteps] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // -------------------------------------------------------------------------
  // 2) Fake Data
  // -------------------------------------------------------------------------
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
      title: '10 Eco-friendly Products That Save the Planet 🌎',
      preview:
        'Learn about bamboo toothbrushes, reusable grocery bags, and solar-powered gadgets that reduce carbon footprint...',
    },
    {
      title: 'Travel on a Tiny Budget ✈️',
      preview:
        'Discover hidden gems, cheap flight hacks, and local experiences that won’t break the bank...',
    },
    {
      title: 'Meal Prep for a Busy Lifestyle 🥦',
      preview:
        'Batch-cook quick, nutritious recipes that keep you energized and stress-free all week...',
    },
  ];

  // -------------------------------------------------------------------------
  // 3) Handler
  // -------------------------------------------------------------------------
  const handleAnalyze = () => {
    if (!domain.trim()) {
      message.warning('Please enter a valid domain');
      return;
    }

    // Hide previous results
    setShowResults(false);
    // Show step-by-step for ~5 seconds
    setShowWorkingSteps(true);
  };

  // Called after steps are done
  const handleStepsFinished = () => {
    setShowWorkingSteps(false);
    setShowResults(true);
  };

  // -------------------------------------------------------------------------
  // 4) Animations
  // -------------------------------------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  // -------------------------------------------------------------------------
  // 5) Render
  // -------------------------------------------------------------------------
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #e0ecff, #f8f9ff 70%)',
        padding: '60px 20px',
        textAlign: 'center',
      }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontSize: '3rem',
          color: '#2563EB',
          marginBottom: '16px',
          fontWeight: 'bold',
        }}
      >
        BrodAI: Your Automated SEO Partner 🤖
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ color: '#555', marginBottom: 32, fontSize: '1.25rem' }}
      >
        BrodAI <strong>analyzes</strong> your site, finds untapped 
        <strong> “arbitrage” opportunities</strong>, writes 
        <strong> high-quality blog posts</strong>, and is ready to publish!
      </motion.h2>

      {/* Domain Input */}
      <Row justify="center">
        <Col xs={24} sm={20} md={14} lg={12}>
          <div
            style={{
              maxWidth: 450,
              margin: '0 auto 24px auto',
              display: 'flex',
              gap: '8px',
            }}
          >
            <Input
              placeholder="Enter your domain..."
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              style={{
                backgroundColor: '#2563EB',
                borderColor: '#2563EB',
                fontWeight: 'bold',
              }}
              onClick={handleAnalyze}
            >
              Analyze
            </Button>
          </div>
        </Col>
      </Row>

      {/* Step-by-step component (5s) */}
      {showWorkingSteps && (
        <BrodAIStepProcess onFinished={handleStepsFinished} />
      )}

      {/* Show final results after steps finish */}
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
            }}
          >
            {/* Topics */}
            <motion.div
              variants={itemVariants}
              style={{
                background: '#fff',
                borderRadius: 8,
                padding: 24,
                marginBottom: 32,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <h2 style={{ color: '#059669', marginBottom: 16 }}>
                BrodAI Found Low-Competition Topics for <strong>{domain}</strong>
              </h2>
              <p style={{ marginBottom: 16, color: '#333' }}>
                BrodAI also inserts <strong>rich media</strong>, 
                adds <strong>strategic backlinks</strong>, and handles 
                everything so Google <em>falls in love</em> with your site.
              </p>
              <ul style={{ marginLeft: 20 }}>
                {fakeTopics.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 12 }}>
                    <strong style={{ color: '#2563EB' }}>
                      {item.title}
                    </strong>{' '}
                    — {item.detail}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Articles */}
            <motion.div
              variants={itemVariants}
              style={{
                background: '#fff',
                borderRadius: 8,
                padding: 24,
                marginBottom: 32,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <h2 style={{ color: '#ff5200', marginBottom: 16 }}>
                BrodAI’s Ready-to-Publish Articles
              </h2>
              <p style={{ marginBottom: 16, color: '#333', fontSize: '1rem' }}>
                Each article is detailed, high-quality, and loaded with 
                the perfect on-page SEO to rank quickly.
              </p>
              <Carousel autoplay style={{ marginBottom: 16 }}>
                {fakeArticles.map((article, idx) => (
                  <div key={idx}>
                    <Card
                      title={article.title}
                      bordered={false}
                      style={{
                        margin: '0 auto',
                        maxWidth: 600,
                        textAlign: 'left',
                        minHeight: 220,
                      }}
                    >
                      <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                        {article.preview}
                      </p>
                    </Card>
                  </div>
                ))}
              </Carousel>
              <p style={{ color: '#333', fontSize: '1rem' }}>
                Ready to publish and get visitors?
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={itemVariants}
              style={{
                background: '#fff',
                borderRadius: 8,
                padding: 24,
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: 32,
              }}
            >
              <h2 style={{ color: '#2563EB', marginBottom: 12 }}>
                Ready to Watch Your Traffic Soar?
              </h2>
              <p style={{ maxWidth: 500, margin: '0 auto', color: '#333' }}>
                Let BrodAI handle everything! We'll publish these articles, 
                add link building, and optimize your <strong>{domain}</strong> 
                for top Google rankings.
              </p>
              <Button
                type="primary"
                size="large"
                style={{
                  marginTop: 16,
                  backgroundColor: '#2563EB',
                  borderColor: '#2563EB',
                  fontWeight: 'bold',
                }}
              >
                Publish & Grow Now
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
