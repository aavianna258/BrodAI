'use client';

import React from 'react';
import { Card, Space, Typography } from 'antd';

const { Title } = Typography;

export default function LoadingPlaceholder() {
  // Reusable style for gray skeleton blocks
  const blockStyle = {
    backgroundColor: '#f3f3f3',
    borderRadius: 6,
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Overall Score placeholder */}
      <Card style={{ border: '2px solid #e0e0e0', borderRadius: 8 }} styles={{ body : {padding: 24 }}}>
        <Title level={4} style={{ marginBottom: 16 }}>
          Overall Score
        </Title>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Circle placeholder */}
          <div
            style={{
              width: 100,
              height: 100,
              ...blockStyle,
            }}
          />
          {/* Performance Rating placeholder */}
          <div style={{ width: 150, height: 20, ...blockStyle }} />
        </div>

        <div style={{ marginTop: 24, ...blockStyle, height: 80 }} />
      </Card>

      {/* AI Content Creation placeholder */}
      <Card style={{ border: '2px solid #e0e0e0', borderRadius: 8 }} styles={{ body : {padding: 24 }}}>
        <Title level={4} style={{ marginBottom: 16 }}>
          AI Content Creation
        </Title>

        <div style={{ width: 200, height: 16, ...blockStyle, marginBottom: 16 }} />
        <div style={{ width: '100%', height: 20, ...blockStyle, marginBottom: 8 }} />
        <div style={{ width: '80%', height: 20, ...blockStyle, marginBottom: 8 }} />
        <div style={{ width: '90%', height: 20, ...blockStyle }} />
      </Card>
    </Space>
  );
}
