import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Form, Input, Button, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function HeroSection() {
  const accentColor = '#3B82F6';
  const [urlValue, setUrlValue] = useState('');
  const router = useRouter();

  const handleAnalyze = (values: any) => {
    router.push(`/status?url=${encodeURIComponent(values.productUrl)}`);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
      <div>
        <Title
          level={1}
          style={{
            marginBottom: 0,
            fontSize: '3rem',
            color: accentColor,
            fontWeight: 700,
          }}
        >
          BrodAI SEO Agent
        </Title>
        <Text style={{ fontSize: '1.2rem', color: '#555' }}>
          SEO made Simple, BrodAI can do it for you 70 times cheaper than any consultant
        </Text>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <Form
          layout="inline"
          onFinish={handleAnalyze}
          style={{ gap: 0 }}  
        >
          <Form.Item
            name="productUrl"
            style={{ margin: 0 }}  
            rules={[{ required: true, message: 'Please enter your site URL!' }]}
          >
            <Input
              size="large"
              placeholder="example.com"
              style={{
                width: 400,
                borderRadius: '9999px 0 0 9999px',
                borderRight: 'none',
              }}
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
            />
          </Form.Item>

          <Form.Item style={{ margin: 0 }}> {/* remove default margin */}
            <Button
              type="primary"
              size="large"
              style={{
                borderRadius: '0 9999px 9999px 0',
                backgroundColor: accentColor,
                borderColor: accentColor,
              }}
              icon={<ArrowRightOutlined />}
              htmlType="submit"
            >
              x10 your traffic
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Space>
  );
}
