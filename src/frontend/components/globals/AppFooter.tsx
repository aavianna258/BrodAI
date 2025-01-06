'use client';

import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { LinkedinOutlined, TwitterOutlined, GithubOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text } = Typography;

export default function AppFooter() {
  const accentColor = '#3B82F6';

  return (
    <Footer style={{ backgroundColor: '#f9f9f9', padding: '40px' }}>
      <Row gutter={[24, 24]} align="top" justify="center">
        {/* Brand / Mission Column */}
        <Col xs={24} sm={12} md={6}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            {/* Circle as brand logo placeholder */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: accentColor,
                marginRight: 8,
              }}
            />
            <Title level={4} style={{ margin: 0 }}>
              BrodAI
            </Title>
          </div>
          <Text type="secondary" style={{ display: 'block' }}>
            Starting with SEO to get you more visitors from Google
          </Text>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            © 2024 - All rights reserved
          </Text>

          {/* Social icons */}
          <Space size="middle" style={{ marginTop: 16 }}>
            <LinkedinOutlined style={{ fontSize: 20, color: '#555' }} />
            <TwitterOutlined style={{ fontSize: 20, color: '#555' }} />
            <GithubOutlined style={{ fontSize: 20, color: '#555' }} />
          </Space>
        </Col>

        {/* Contact Column */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ marginBottom: 16 }}>
            CONTACT
          </Title>
          <Text type="secondary" style={{ display: 'block' }}>
            Email: admin@brodai.ai
          </Text>
        </Col>

        {/* Legal Column */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ marginBottom: 16 }}>
            LEGAL
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Terms of Service
          </Text>
          <Text type="secondary" style={{ display: 'block' }}>
            Privacy Policy
          </Text>
        </Col>

        {/* Blog Column */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ marginBottom: 16 }}>
            BLOG
          </Title>
          <Text type="secondary" style={{ display: 'block' }}>
            <a href="/blog" style={{ color: 'inherit' }}>
              All Posts
            </a>
          </Text>
        </Col>
      </Row>
    </Footer>
  );
}
