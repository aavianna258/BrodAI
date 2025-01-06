// components/AppFooter.tsx
'use client';

import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';

const { Footer } = Layout;
const { Text, Title } = Typography;

export default function AppFooter() {
  return (
    <Footer style={{ backgroundColor: '#f9f9f9', padding: '40px 24px' }}>
      <Row gutter={[24, 24]}>
        {/* Example: Left Column */}
        <Col xs={24} md={8}>
          <Title level={4}>BrodAI</Title>
          <Text type="secondary">
            Drive more traffic and conversions with our AI solutions.
          </Text>
        </Col>

        {/* Example: Middle Column (Quick Links) */}
        <Col xs={24} md={8}>
          <Title level={5}>Quick Links</Title>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/status?url=your-website.com">Status Report</a>
            </li>
            <li>
              <a href="/articles">AI Articles</a>
            </li>
          </ul>
        </Col>

        {/* Example: Right Column (Contact) */}
        <Col xs={24} md={8}>
          <Title level={5}>Contact Us</Title>
          <Text>Email: contact@brodai.ai</Text>
          <br />
          <Text>Phone: +1 (555) 123-4567</Text>
        </Col>
      </Row>

      <Row style={{ marginTop: 40 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Text type="secondary">
            © {new Date().getFullYear()} BrodAI - All rights reserved
          </Text>
        </Col>
      </Row>
    </Footer>
  );
}
