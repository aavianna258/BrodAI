'use client';

import React, { useState } from 'react';
import { Steps, Row, Col, Card, Typography, Image } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Paragraph } = Typography;

const stepsData = [
  {
    title: 'Keyword Research',
    description: `
If people aren’t searching for what you’re writing about, 
they’ll never find you. BrodAI pinpoints specific words and phrases 
your potential customers actually type into Google, so you’re targeting 
topics people truly care about.
    `,
    image: '/images/keyword-rs.webp',
  },
  {
    title: 'Refine & Select',
    description: `
Some keywords are too competitive—like trying to outrank giant brands 
for “iPhone 16 Pro.” That’s why BrodAI compares search volume and difficulty 
to find realistic targets for your business. Less effort, more results.
    `,
    image: '/images/best-kw.webp',
  },
  {
    title: 'AI Content Generation',
    description: `
Google doesn’t punish AI content; it punishes poor content. 
So BrodAI analyzes top-ranking pages, then crafts in-depth articles 
(2,000 words or more) that are both accurate and engaging. 
No filler text—just real substance.
    `,
    image: '/images/content-generation.webp',
  },
  {
    title: 'On-Page Optimization',
    description: `
Great content alone isn’t enough. Your pages must meet SEO best practices, 
and your site needs strong internal links plus quality external links. 
BrodAI automates these tasks, making sure your site truly stands out.
    `,
    image: '/images/on-page-optimization.webp',
  },
];

export default function SEOProcessTimeline() {
  const [currentStep, setCurrentStep] = useState(0);

  // Switch steps on click
  const onStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div style={{ padding: '60px 20px', background: '#fff' }}>
      {/* Title + Intro */}
      <Row justify="center" style={{ marginBottom: '40px' }}>
        <Col xs={24} sm={22} md={16} lg={12} style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Title level={2} style={{ marginBottom: '16px' }}>
              How BrodAI Empowers Your SEO
            </Title>
            <Paragraph style={{ fontSize: '1rem', color: '#6b7280' }}>
              Our straightforward process finds the keywords people actually 
              search for, creates valuable content they’ll love, and 
              optimizes your site for lasting growth.
            </Paragraph>
          </motion.div>
        </Col>
      </Row>

      {/* Steps - Force center alignment */}
      <Row justify="center" style={{ marginBottom: '40px' }}>
        <Col xs={24} style={{ display: 'flex', justifyContent: 'center' }}>
          <Steps
            direction="horizontal"
            responsive
            type="navigation"
            current={currentStep}
            onChange={onStepChange}
            // Optionally cap the width & auto-center
            style={{
              maxWidth: '1000px',
              margin: 'auto auto',
            }}
            items={stepsData.map((step, index) => ({
              title: step.title,
              description: `Step ${index + 1}`,
            }))}
          />
        </Col>
      </Row>

      {/* ONLY show the active step's content. Others are "collapsed." */}
      <Row justify="center">
        <Col xs={24} sm={22} md={16} lg={12}>
          <AnimatePresence mode="wait">
            {stepsData.map((step, index) => {
              // Render only the active step’s content
              if (index === currentStep) {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '40px' }}
                  >
                    <Card
                      bordered={true}
                      style={{
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        borderRadius: 8,
                      }}
                    >
                      <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={12}>
                          <Title
                            level={4}
                            style={{ color: '#6366f1', marginBottom: 12 }}
                          >
                            {step.title}
                          </Title>
                          <Paragraph
                            style={{
                              whiteSpace: 'pre-line',
                              color: '#374151',
                              marginBottom: 0,
                            }}
                          >
                            {step.description}
                          </Paragraph>
                        </Col>
                        {/* Image column */}
                        <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                          {step.image && (
                            <Image
                              src={step.image}
                              alt={step.title}
                              preview={false}
                              style={{
                                maxWidth: '100%',
                                maxHeight: 220,
                                objectFit: 'contain',
                                borderRadius: 6,
                              }}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card>
                  </motion.div>
                );
              }
              return null;
            })}
          </AnimatePresence>
        </Col>
      </Row>
    </div>
  );
}
