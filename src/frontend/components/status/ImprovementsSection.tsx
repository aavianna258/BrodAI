'use client';

import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';

const { Title, Paragraph, Text } = Typography;

interface ImprovementKeyword {
  keyword: string;
  reason: string;
}

interface ImprovementsProps {
  improvementKeywords: ImprovementKeyword[];
  accentColor?: string;
}

export default function ImprovementsSection({
  improvementKeywords,
  accentColor = '#3B82F6',
}: ImprovementsProps) {
  return (
    <Card
      style={{ borderRadius: 8, border: `2px solid ${accentColor}20`, marginTop: 24 }}
      styles={{ body: { padding: 24 } }}
    >
      <Title level={4} style={{ marginBottom: 16, color: accentColor }}>
        How to Improve
      </Title>
      <Paragraph>
        BrodAI recommends targeting these high‐potential keywords for better SEO results. 
        We’ll explain why each keyword is valuable, so you can create highly relevant content.
      </Paragraph>

      <Space direction="vertical" style={{ width: '100%' }}>
        {improvementKeywords.map((kw, idx) => (
          <div key={idx} style={{ backgroundColor: '#fafafa', padding: '12px 16px', borderRadius: 6 }}>
            <Tag color={accentColor} style={{ marginRight: 8 }}>
              {kw.keyword}
            </Tag>
            <Text type="secondary">{kw.reason}</Text>
          </div>
        ))}
      </Space>
    </Card>
  );
}
