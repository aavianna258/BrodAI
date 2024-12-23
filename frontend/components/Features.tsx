// app/components/Features.tsx
'use client';

import React from 'react';
import { Card, Typography, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

/** Some mock data for each feature */
const featuresData = [
  {
    title: 'Keyword Analysis',
    description:
      'Our AI automatically identifies the top-performing keywords for your niche, boosting your search visibility.',
  },
  {
    title: 'Competitor Insights',
    description:
      'Stay ahead of the competition with data-driven insights, comparing their performance to yours.',
  },
  {
    title: 'Automated Suggestions',
    description:
      'Receive instant, AI-powered recommendations to optimize your content and improve ranking.',
  },
];

export default function Features() {
  return (
    <>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
        Key Features
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {featuresData.map((feature, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card hoverable style={{ minHeight: 200 }}>
              <Title level={4}>{feature.title}</Title>
              <Paragraph>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
