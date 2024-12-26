// components/status/TrafficOverview.tsx
'use client';

import React from 'react';
import { Typography, Row, Col, Statistic } from 'antd';

const { Title } = Typography;

interface TrafficOverviewProps {
  monthlyTraffic: number;
  avgMonthlyClicks: number;
}

export default function TrafficOverview({
  monthlyTraffic,
  avgMonthlyClicks,
}: TrafficOverviewProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={4}>Traffic Overview</Title>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Statistic
            title="Monthly Traffic"
            value={monthlyTraffic}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Avg. Monthly Clicks"
            value={avgMonthlyClicks}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
      </Row>
    </div>
  );
}
