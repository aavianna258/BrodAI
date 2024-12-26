// components/home/FeaturesSection.tsx
'use client';

import React, { useState } from 'react';
import { Typography, Card, Space, Row, Col, Button } from 'antd';

const { Title, Paragraph } = Typography;

export default function FeaturesSection() {
  const accentColor = '#3B82F6';
  const [activeTab, setActiveTab] = useState<string>('auto-seo-fixes');

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  return (
    <div id="features" style={{ marginTop: 80, textAlign: 'center' }}>
      <Title level={2} style={{ marginBottom: 16 }}>
        BrodAI Features
      </Title>

      {/* Tabs / Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Button
          type={activeTab === 'auto-seo-fixes' ? 'primary' : 'default'}
          onClick={() => handleTabClick('auto-seo-fixes')}
          style={{
            backgroundColor: activeTab === 'auto-seo-fixes' ? accentColor : undefined,
            borderColor: activeTab === 'auto-seo-fixes' ? accentColor : undefined,
          }}
        >
          Auto SEO Fixes
        </Button>
        <Button
          type={activeTab === 'ai-keyword-research' ? 'primary' : 'default'}
          onClick={() => handleTabClick('ai-keyword-research')}
          style={{
            backgroundColor: activeTab === 'ai-keyword-research' ? accentColor : undefined,
            borderColor: activeTab === 'ai-keyword-research' ? accentColor : undefined,
          }}
        >
          AI Keyword Research
        </Button>
        <Button
          type={activeTab === 'scalable-seo-content' ? 'primary' : 'default'}
          onClick={() => handleTabClick('scalable-seo-content')}
          style={{
            backgroundColor: activeTab === 'scalable-seo-content' ? accentColor : undefined,
            borderColor: activeTab === 'scalable-seo-content' ? accentColor : undefined,
          }}
        >
          Scalable Content
        </Button>
      </div>

      <Paragraph style={{ maxWidth: 800, margin: '0 auto', marginTop: 16, color: '#555' }}>
        BrodAI writes content around keywords your customers are searching for. This 
        is the most direct way for you to get more visitors on your site.
      </Paragraph>

      {/* Feature Cards */}
      <Row
        gutter={[24, 24]}
        justify="center"
        style={{ marginTop: 32, maxWidth: 1000, marginInline: 'auto' }}
      >
        {/* Card 1 */}
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{ borderRadius: 8, textAlign: 'left', height: '100%' }}
            styles={{
              body: {
                padding: 24,
              },
            }}
          >
            <Title level={5}>Human-Like Writing</Title>
            <Paragraph type="secondary" style={{ fontSize: '0.9rem', marginTop: 8 }}>
              BrodAI’s engine mimics experienced writers: selects topics, does research, 
              creates outlines, and sources relevant info.
            </Paragraph>
          </Card>
        </Col>
        {/* Card 2 */}
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{ borderRadius: 8, textAlign: 'left', height: '100%' }}
            styles={{
              body: {
                padding: 24,
              },
            }}
          >
            <Title level={5}>Up-to-Date Info</Title>
            <Paragraph type="secondary" style={{ fontSize: '0.9rem', marginTop: 8 }}>
              We use the latest web sources to ensure your content is accurate 
              and backed by trustworthy data.
            </Paragraph>
          </Card>
        </Col>
        {/* Card 3 */}
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{ borderRadius: 8, textAlign: 'left', height: '100%' }}
            styles={{
              body: {
                padding: 24,
              },
            }}
          >
            <Title level={5}>Collaborative Outlines</Title>
            <Paragraph type="secondary" style={{ fontSize: '0.9rem', marginTop: 8 }}>
              You can provide input on the outline stage, guiding the structure 
              and direction of your articles.
            </Paragraph>
          </Card>
        </Col>
        {/* Card 4 */}
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{ borderRadius: 8, textAlign: 'left', height: '100%' }}
            styles={{
              body: {
                padding: 24,
              },
            }}
          >
            <Title level={5}>Strategic Keyword Use</Title>
            <Paragraph type="secondary" style={{ fontSize: '0.9rem', marginTop: 8 }}>
              BrodAI targets high-traffic, low-competition keywords that are
              highly relevant to your audience.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
