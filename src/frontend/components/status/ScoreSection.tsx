// components/status/ScoreSection.tsx
'use client';

import React from 'react';
import { Typography, Progress } from 'antd';

const { Title, Paragraph } = Typography;

function getScoreColor(score: number) {
  if (score < 50) return '#ff4d4f'; // rouge
  if (score < 80) return '#faad14'; // orange
  return '#52c41a';                // vert
}

function getScoreLabel(score: number) {
  if (score < 50) return 'Needs Improvement';
  if (score < 80) return 'Moderate';
  return 'Great!';
}

interface ScoreSectionProps {
  score: number;
}

export default function ScoreSection({ score }: ScoreSectionProps) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      <Title level={4}>BrodAI Score</Title>
      <Progress
        type="circle"
        percent={score}
        strokeColor={getScoreColor(score)}
        format={(p) => `${p}/100`}
      />
      <Paragraph strong style={{ marginTop: 16, color: getScoreColor(score) }}>
        {getScoreLabel(score)}
      </Paragraph>
    </div>
  );
}
