// app/page.tsx
'use client';

import React from 'react';
import { Typography, Row, Col, Space, Button, Divider } from 'antd';
import Link from 'next/link';
import Features from '../components/Features';

const { Title, Paragraph } = Typography;

// Adjust to match the actual NavBar height (64px, 80px, etc.)
const NAVBAR_HEIGHT = 64;

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Row
        align="middle"
        justify="center"
        style={{
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          background: '#f5f5f5',
          textAlign: 'center',
          margin: 0,
          padding: '60px 20px',
        }}
      >
        <Col xs={24} md={16} lg={12}>
          <Title level={1} style={{ marginBottom: 10 }}>
            Meet the Most Powerful AI SEO Agent
          </Title>
          <Paragraph style={{ fontSize: 16, lineHeight: 1.7 }}>
            Harness the power of artificial intelligence to turbocharge your
            website’s visibility on search engines. Our AI SEO Agent analyzes
            your content, researches optimal keywords, and provides
            data-driven strategies to outrank your competition.
          </Paragraph>
          <Paragraph style={{ fontSize: 16, lineHeight: 1.7 }}>
            Whether you’re new to SEO or an experienced marketer, our agent
            guides you step-by-step to achieve sustainable growth and higher
            conversions. Start optimizing your content now, and watch your
            traffic skyrocket!
          </Paragraph>

          <Space size="large" style={{ marginTop: 20 }}>
            <Link href="/keyword-researcher">
              <Button type="primary" size="large">
                Go to Keyword Researcher
              </Button>
            </Link>
            <Button size="large" href="https://example.com" target="_blank" rel="noopener noreferrer">
              Learn More
            </Button>
          </Space>
        </Col>
      </Row>

      <Divider style={{ margin: 0 }} />

      {/* Features Section */}
      <Row
        justify="center"
        style={{
          padding: '50px 20px',
          background: '#fff',
        }}
      >
        <Col xs={24} md={16} lg={12}>
          <Features />
        </Col>
      </Row>
    </>
  );
}
