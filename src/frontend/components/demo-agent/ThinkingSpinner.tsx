import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function ThinkingSpinner() {
  const spinnerIcon = (
    <LoadingOutlined style={{ fontSize: 32, color: '#2563EB' }} spin />
  );
  return (
    <div style={{ marginTop: 24 }}>
      <Spin
        indicator={spinnerIcon}
        tip="BrodAI is preparing your SEO strategy..."
        style={{ fontSize: '1.2rem' }}
      />
    </div>
  );
}
