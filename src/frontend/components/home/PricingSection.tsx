'use client';

import React, { useState } from 'react';
import {
  Typography,
  Card,
  Space,
  Badge,
  Divider,
  Button,
  Switch,
  Row,
  Col,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function PricingSection() {
  const accentColor = '#3B82F6';
  const [isAnnual, setIsAnnual] = useState(false);

  // Example monthly price
  const monthlyPrice = 39.99;
  // 25% discount if annual
  const annualPrice = parseFloat((monthlyPrice * 0.75).toFixed(2));

  return (
    <div id="pricing" style={{ marginTop: 80, textAlign: 'center' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2} style={{ marginBottom: 0 }}>
          Explore BrodAI Plans
        </Title>

        {/* Monthly / Annual Switch */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <Text>Monthly</Text>
          <Switch
            checked={isAnnual}
            onChange={(checked) => setIsAnnual(checked)}
            checkedChildren="Annual"
            unCheckedChildren=""
            style={{ backgroundColor: isAnnual ? accentColor : undefined }}
          />
          {isAnnual && (
            <Text style={{ color: accentColor, fontWeight: 600 }}>
              Save 25%
            </Text>
          )}
        </div>

        {/* Early Access Info Card */}
        <Card
          style={{
            maxWidth: 800,
            margin: '0 auto',
            borderRadius: 8,
            backgroundColor: '#f9f9f9',
            textAlign: 'left',
          }}
          styles={{
            body: {
              padding: 24,
            },
          }}
        >
          <Space direction="vertical" size="middle">
            <Badge
              color={accentColor}
              style={{ color: '#fff' }}
              count="Early Access Pricing"
            />
            <Paragraph style={{ color: '#555', margin: 0 }}>
              As an early user, you get exclusive beta pricing. In return, 
              we’d love your feedback to shape BrodAI further. You’ll also 
              secure priority discounts when we launch officially!
            </Paragraph>
          </Space>
        </Card>

        {/* Plans Row */}
        <Row
          gutter={[24, 24]}
          justify="center"
          style={{ maxWidth: 1200, margin: '0 auto', marginTop: 32 }}
        >
          {/* Early Access Plan */}
          <Col xs={24} sm={12} md={8}>
            <Card
              style={{
                borderRadius: 8,
                textAlign: 'left',
                height: '100%',
                position: 'relative', // allows absolute positioning inside
              }}
              styles={{
                body: {
                  padding: 24,
                },
              }}
            >
              <Badge
                style={{
                  backgroundColor: accentColor,
                  position: 'relative',
                  top: 'auto',
                  right: '16',
                  zIndex: 1,
                }}
                count="Early Access"
              />

              <Title level={4} style={{ marginTop: 20 }}>
                Basic Plan
              </Title>
              <Title
                level={2}
                style={{ margin: 0, color: '#222', fontWeight: 700 }}
              >
                ${isAnnual ? annualPrice : monthlyPrice}
                <span style={{ fontSize: '1rem', color: '#888', marginLeft: 4 }}>
                  /month
                </span>
              </Title>
              <Divider />

              <Space direction="vertical" size="small" style={{ marginTop: 8 }}>
                <Text>✔ Site Audit & Technical SEO Fixes</Text>
                <Text>✔ Automatic keyword research</Text>
                <Text>✔ 5 SEO blog posts per week</Text>
                <Text>✔ CMS integration (auto posting)</Text>
              </Space>

              <div style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  style={{
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                    borderRadius: 6,
                  }}
                >
                  Get 7 Days Free
                </Button>
              </div>
            </Card>
          </Col>

          {/* Full-Service Plan */}
          <Col xs={24} sm={12} md={8}>
            <Card
              style={{
                borderRadius: 8,
                textAlign: 'left',
                height: '100%',
                position: 'relative',
              }}
              styles={{
                body: {
                  padding: 24,
                },
              }}
            >
              {/* Badge top-right corner INSIDE the card */}
              <Badge
                style={{
                  backgroundColor: accentColor,
                  position: 'relative',
                  top: 'auto',
                  right: 'auto',
                  zIndex: 1,
                }}
                count="Early Access"
              />

              <Title level={4} style={{ marginTop: 20 }}>
                Full-Service Plan
              </Title>
              <Title
                level={2}
                style={{ margin: 0, color: '#222', fontWeight: 700 }}
              >
                Custom Pricing
              </Title>
              <Divider />

              <Space direction="vertical" size="small" style={{ marginTop: 8 }}>
                <Text>✔ Everything in Early Access Plan</Text>
                <Text>✔ Dedicated SEO Expert</Text>
                <Text>✔ Monthly Strategy Planning</Text>
                <Text>✔ 24/7 Support</Text>
              </Space>

              <div style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  style={{
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                    borderRadius: 6,
                  }}
                >
                  Book A Demo
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}
