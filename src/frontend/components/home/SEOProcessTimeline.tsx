'use client';

import React from 'react';
import { Row, Col, Card, Typography, Image } from 'antd';
import { motion } from 'framer-motion';

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

export default function SEOProcessGrid() {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px', // slightly smaller padding
        background: '#fff',
      }}
    >
      <Row justify="center" style={{ marginBottom: '24px' }}>
        <Col xs={24} style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Title level={3} style={{ marginBottom: '8px' }}>
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

      {/* Two cards per row on md+ screens, one card on xs/sm */}
      <Row 
        gutter={[24, 24]} 
        align="stretch"    // Make each Col stretch in height
      >
        {stepsData.map((step, index) => (
          <Col 
            key={index} 
            xs={24} 
            md={12} 
            // This ensures each card is the same height within a row
            style={{ display: 'flex' }} 
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }} 
            >
              <Card
                bordered
                style={{
                  height: '100%',           // Fill the parent Col
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  borderRadius: 8,
                }}
              >
                <Row 
                  gutter={[16, 16]} 
                  align="middle"
                  style={{ height: '100%' }}
                >
                  {/* Text column (left) */}
                  <Col xs={24} sm={14}>
                    <Title 
                      level={4} 
                      style={{ color: '#6366f1', marginBottom: 12 }}
                    >
                      {step.title}
                    </Title>
                    <Paragraph style={{ color: '#374151', fontSize: '0.95rem' }}>
                      {step.description}
                    </Paragraph>
                  </Col>
                  {/* Image column (right) */}
                  <Col xs={24} sm={10} style={{ textAlign: 'center' }}>
                    {step.image && (
                      <Image
                        src={step.image}
                        alt={step.title}
                        preview={false}
                        style={{
                          maxWidth: '100%',
                          maxHeight: 160,       // make image smaller
                          objectFit: 'contain',
                          borderRadius: 6,
                        }}
                      />
                    )}
                  </Col>
                </Row>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
