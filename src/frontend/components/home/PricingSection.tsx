'use client';

import React from 'react';
import { Row, Col, Card, Typography, Button } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

export default function PricingSection() {
  return (
    <div style={{ background: '#f9fafb', padding: '60px 20px' }}>
      <Row justify="center" style={{ marginBottom: '40px' }}>
        <Col xs={24} sm={22} md={16} lg={12} style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Title level={2} style={{ marginBottom: '16px' }}>
              Simple, Transparent Pricing
            </Title>
            <Paragraph style={{ color: '#6b7280', fontSize: '1rem' }}>
              We’re just launching BrodAI—experience powerful SEO content and 
              optimization at a fraction of the usual cost. Try us out for free, 
              then pick a plan that grows with your business.
            </Paragraph>
          </motion.div>
        </Col>
      </Row>

      {/* 3 Pricing Cards */}
      <Row gutter={[24, 24]} justify="center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* FREE TEST TIER */}
        <Col xs={24} sm={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card
              hoverable
              style={{ borderRadius: '8px', textAlign: 'center', minHeight: '450px' }}
            >
              <Title level={4} style={{ marginBottom: 0 }}>Free Test</Title>
              <Paragraph type="secondary" style={{ marginBottom: 20 }}>
                0 € / month
              </Paragraph>

              <ul style={{ textAlign: 'left', marginBottom: 24, paddingLeft: '1.25rem' }}>
                <li>Up to 5 blog posts</li>
                <li>Integration with Shopify or WordPress</li>
                <li>API-based content generation</li>
                <li>No credit card required</li>
              </ul>

              <Button type="primary" size="large" style={{ borderRadius: '6px' }}>
                Try for Free
              </Button>
            </Card>
          </motion.div>
        </Col>

        {/* EARLY ACCESS TIER */}
        <Col xs={24} sm={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card
              hoverable
              style={{
                borderRadius: '8px',
                textAlign: 'center',
                minHeight: '450px',
                background: '#fff',
                border: '2px solid #6366f1',
              }}
            >
              {/* Highlight the "Early Access" plan with a border or badge */}
              <Title level={4} style={{ marginBottom: 0 }}>Early Access</Title>
              <Paragraph style={{ marginBottom: 20, color: '#6366f1' }}>
                29,90 € / month
              </Paragraph>

              <ul style={{ textAlign: 'left', marginBottom: 24, paddingLeft: '1.25rem' }}>
                <li>20 blog posts / month</li>
                <li>Unlimited keyword research</li>
                <li>Competitor analysis</li>
                <li>CMS integration (Shopify, WordPress, etc.)</li>
              </ul>

              <Button
                type="primary"
                size="large"
                style={{
                  backgroundColor: '#6366f1',
                  borderColor: '#6366f1',
                  borderRadius: '6px',
                }}
              >
                Get Early Access
              </Button>
            </Card>
          </motion.div>
        </Col>

        {/* CUSTOM OFFER TIER */}
        <Col xs={24} sm={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Card
              hoverable
              style={{ borderRadius: '8px', textAlign: 'center', minHeight: '450px' }}
            >
              <Title level={4} style={{ marginBottom: 0 }}>Custom Offer</Title>
              <Paragraph type="secondary" style={{ marginBottom: 20 }}>
                Contact Us
              </Paragraph>

              <ul style={{ textAlign: 'left', marginBottom: 24, paddingLeft: '1.25rem' }}>
                <li>Full site & page analysis</li>
                <li>Unlimited page optimization suggestions</li>
                <li>Custom # of blog posts & audits</li>
                <li>Integration with Google/Bing & dev team collaboration</li>
                <li>Performance monitoring & advanced reporting</li>
              </ul>

              <Button type="default" size="large" style={{ borderRadius: '6px' }}>
                Contact Sales
              </Button>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}
