// src/components/keyword-research/KeywordResearchResults.tsx
'use client';

import React from 'react';
import { Card, Table } from 'antd';
import { IBrodAIKeyword } from './KeywordResearchService';

type KeywordResearchResultsProps = {
  mainKeyword: string;
  keywords: IBrodAIKeyword[];
};

export default function KeywordResearchResults({
  mainKeyword,
  keywords,
}: KeywordResearchResultsProps) {
  if (!keywords || keywords.length === 0) {
    return null; // or some empty message
  }

  // columns for the AntD Table
  const columns = [
    { title: 'Keyword', dataIndex: 'keyword', key: 'keyword' },
    { title: 'Traffic', dataIndex: 'traffic', key: 'traffic' },
    { title: 'Difficulty', dataIndex: 'difficulty', key: 'difficulty' },
    { title: 'Perf. Score', dataIndex: 'performance_score', key: 'performance_score' },
  ];

  return (
    <Card style={{ textAlign: 'left', background: '#f9fafb', marginTop: 16 }}>
      <p style={{ fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>
        Top Keywords Found for <span style={{ color: '#059669' }}>{mainKeyword}</span>:
      </p>

      <Table
        columns={columns}
        dataSource={keywords.map((kw, idx) => ({
          key: idx,
          ...kw,
        }))}
        pagination={false}
      />
    </Card>
  );
}
