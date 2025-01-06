// components/home/BrandIcons.tsx
'use client';

import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Text } = Typography;

export default function BrandIcons() {
  return (
    <div style={{ marginTop: 48, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
      <Row gutter={[24, 24]} justify="center">
        <Col xs={12} sm={8} md={4} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32 }}>🔗</div>
          <Text style={{ display: 'block', marginTop: 8 }}>Random Brand 1</Text>
        </Col>
        <Col xs={12} sm={8} md={4} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32 }}>💡</div>
          <Text style={{ display: 'block', marginTop: 8 }}>Random Brand 2</Text>
        </Col>
        <Col xs={12} sm={8} md={4} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32 }}>⚙️</div>
          <Text style={{ display: 'block', marginTop: 8 }}>Random Brand 3</Text>
        </Col>
      </Row>
    </div>
  );
}
