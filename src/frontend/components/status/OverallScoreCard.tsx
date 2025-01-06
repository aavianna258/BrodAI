'use client';

import React from 'react';
import { Card, Typography, Space, Progress } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface OverallScoreCardProps {
  // e.g., 50 means 50% out of 100
  scoreNumeric: number;
  performanceRating: string; // e.g. "Needs Improvement"
  nextSteps: string[];
  accentColor?: string;
}

export default function OverallScoreCard({
  scoreNumeric,
  performanceRating,
  nextSteps,
  accentColor = '#3B82F6',
}: OverallScoreCardProps) {
  // Decide color for rating
  const getColorByRating = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'excellent':
        return '#52c41a'; // green
      case 'good':
        return '#faad14'; // orange
      default:
        return '#fadb14'; // yellow for "Needs Improvement"
    }
  };

  return (
    <Card
      style={{
        borderRadius: 8,
        border: `2px solid ${accentColor}20`,
      }}
      styles={{ body: { padding: 24 } }}
    >
      <Title level={4} style={{ marginBottom: 16, color: accentColor }}>
        Overall Score
      </Title>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Circle Score: show "XX/100" */}
        <Progress
          type="circle"
          percent={scoreNumeric}
          size={100}
          strokeColor={getColorByRating(performanceRating)}
          // This will display e.g. "50/100" instead of a letter grade
          format={(p) => `${p}/100`}
        />

        {/* Performance rating text */}
        <div>
          <Title level={5} style={{ marginBottom: 4 }}>
            Performance Rating
          </Title>
          <Text
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: getColorByRating(performanceRating),
            }}
          >
            {performanceRating}
          </Text>
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ marginTop: 24 }}>
        <Space direction="horizontal" align="center">
          <InfoCircleOutlined style={{ fontSize: 16, color: accentColor }} />
          <Text style={{ fontWeight: 500 }}>Next Steps</Text>
        </Space>
        <ul style={{ marginTop: 8 }}>
          {nextSteps.map((step, idx) => (
            <li key={idx} style={{ marginBottom: 4 }}>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
