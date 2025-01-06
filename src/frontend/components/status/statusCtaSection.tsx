'use client';

import React from 'react';
import { Card, Typography, Button, Space } from 'antd';

const { Title, Paragraph } = Typography;

interface StatusCtaSectionProps {
  accentColor?: string;
  onTryFree?: () => void;
  onBookDemo?: () => void;
}

export default function StatusCtaSection({
  accentColor = '#1677ff',
  onTryFree,
  onBookDemo,
}: StatusCtaSectionProps) {
  return (
    <Card
      style={{ borderRadius: 8, textAlign: 'center', marginTop: 24 }}
      styles={{
        body: {
          padding: 24,
        },
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <Title level={4} style={{ marginBottom: 0 }}>
          Ready to Boost Your Traffic?
        </Title>

        {/* Body text */}
        <Paragraph style={{ maxWidth: 600, margin: '0 auto', color: '#555' }}>
          <strong>
            Our AI solutions can help you increase your conversion rate and boost your
            Google rankings. Turn your site visitors into happy customers today!
          </strong>
        </Paragraph>

        {/* CTA buttons, bigger and centered */}
        <Space size="large" style={{ justifyContent: 'center', display: 'flex' }}>
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: accentColor,
              borderColor: accentColor,
              borderRadius: 6,
              minWidth: 140, // for a bigger, consistent width
            }}
            onClick={onTryFree}
          >
            Try for Free
          </Button>
          <Button
            type="default"
            size="large"
            style={{
              borderRadius: 6,
              minWidth: 140,
            }}
            onClick={onBookDemo}
          >
            Book a Demo
          </Button>
        </Space>
      </Space>
    </Card>
  );
}
