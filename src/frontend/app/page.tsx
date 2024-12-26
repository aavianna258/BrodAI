'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Ant Design + Icons
import { Layout, Menu, Card, Typography, Form, Input, Button, Space } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';

// Next.js 13 "App Router" will treat this file as your Home Page (/).

// 1. Dynamically load react-typed so it runs client-side only

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

// 2. Simple NavBar using Menu "items" (no more children)
function NavBar() {
  const menuItems = [
    {
      key: 'home',
      label: <Link href="/">Home</Link>,
    },
    {
      key: 'status',
      label: <Link href="/status?url=your-website.com">Status</Link>,
    },
    {
      key: 'articles',
      label: <Link href="/articles">Articles</Link>,
    },
  ];

  return (
    <Header style={{ backgroundColor: '#fff', boxShadow: '0 2px 8px #f0f1f2' }}>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={['home']}
        style={{ borderBottom: 'none' }}
        items={menuItems}
      />
    </Header>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [urlValue, setUrlValue] = useState('');

  // On form submit, redirect to /status?url=...
  const onFinish = (values: any) => {
    router.push(`/status?url=${encodeURIComponent(values.productUrl)}`);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 3. NavBar at top */}
      <NavBar />

      <Content style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <Card
          style={{
            maxWidth: 800,
            width: '100%',
            borderRadius: 8,
            textAlign: 'center',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* --- HERO SECTION --- */}
            <div style={{ marginTop: 40 }}>
              <Title level={2} style={{ marginBottom: 16 }}>
                Meet Our{' '}
                <span style={{ color: '#1890ff' }}>
                  {/* Animated text (type & erase) */}

                </span>{' '}
                SEO AI Agent
              </Title>

              <Paragraph style={{ fontSize: '1.1rem', color: '#555' }}>
                Harness the power of artificial intelligence to analyze your website
                and generate up to <strong>10x more traffic</strong>.
                <br />
                Enter your URL and let BrodAI do the rest!
              </Paragraph>
            </div>

            {/* --- ANIMATED ARROW --- */}
            <div
              style={{
                fontSize: 32,
                animation: 'bounceArrow 1.5s infinite',
                marginTop: 16,
                color: '#1890ff',
              }}
            >
              <ArrowDownOutlined />
            </div>
            {/* Keyframes for arrow bounce */}
            <style jsx>{`
              @keyframes bounceArrow {
                0% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(8px);
                }
                100% {
                  transform: translateY(0);
                }
              }
            `}</style>

            {/* --- FORM TO INPUT URL --- */}
            <div style={{ marginTop: 16 }}>
              <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                  name="productUrl"
                  rules={[{ required: true, message: 'Please enter your site URL!' }]}
                >
                  <Input
                    placeholder="https://www.yourwebsite.com"
                    size="large"
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block>
                    Analyze My Website
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
}
