// components/status/KeywordDetails.tsx
'use client';

import React from 'react';
import { Typography, Tag } from 'antd';

const { Title, Text } = Typography;

interface Keyword {
  keyword: string;
  rating: string;
  position: number;
}

interface KeywordDetailsProps {
  details: Keyword[];
}

export default function KeywordDetails({ details }: KeywordDetailsProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={5}>Keyword Details</Title>
      {details.map((item, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <Tag color="blue" style={{ marginRight: 8 }}>
            {item.keyword}
          </Tag>
          <Text type="secondary">Rating: {item.rating}</Text> &middot;{' '}
          <Text>Position: {item.position}</Text>
        </div>
      ))}
    </div>
  );
}
