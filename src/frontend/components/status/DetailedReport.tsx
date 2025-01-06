'use client';

import React from 'react';
import { Card, Typography, Table } from 'antd';

const { Title, Paragraph } = Typography;

interface DetailedKeyword {
  keyword: string;
  currentPosition: number;
  potentialTraffic: number;
  competitionLevel: string;
}

interface DetailedReportProps {
  detailedKeywords: DetailedKeyword[];
  accentColor?: string;
}

export default function DetailedReport({
  detailedKeywords,
  accentColor = '#3B82F6',
}: DetailedReportProps) {
  // Create columns for an AntD Table, or you can use your own custom list
  const columns = [
    {
      title: 'Keyword',
      dataIndex: 'keyword',
      key: 'keyword',
    },
    {
      title: 'Current Position',
      dataIndex: 'currentPosition',
      key: 'currentPosition',
    },
    {
      title: 'Potential Traffic',
      dataIndex: 'potentialTraffic',
      key: 'potentialTraffic',
    },
    {
      title: 'Competition',
      dataIndex: 'competitionLevel',
      key: 'competitionLevel',
    },
  ];

  return (
    <Card
      style={{
        borderRadius: 8,
        border: `2px solid ${accentColor}20`,
        marginTop: 24,
      }}
      styles={{
        body: { padding: 24 },
      }}
    >
      <Title level={4} style={{ marginBottom: 16, color: accentColor }}>
        Detailed Keyword Report
      </Title>
      <Paragraph>
        Here are some additional keywords you’re currently missing or not ranking highly for. 
        Improving your position on these could bring more traffic.
      </Paragraph>

      <Table
        columns={columns}
        dataSource={detailedKeywords.map((item, idx) => ({ ...item, key: idx }))}
        pagination={false}
      />
    </Card>
  );
}
