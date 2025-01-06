'use client';

import React from 'react';
import { Card, Typography, List, Button } from 'antd';

const { Title, Paragraph, Text } = Typography;

interface BlogPost {
  title: string;
  snippet: string;
}

interface BlogPostsSectionProps {
  blogPosts: BlogPost[];
  accentColor?: string;
}

export default function BlogPostsSection({
  blogPosts,
  accentColor = '#3B82F6',
}: BlogPostsSectionProps) {
  return (
    <Card
      style={{ borderRadius: 8, border: `2px solid ${accentColor}20`, marginTop: 24 }}
      styles={{ body: { padding: 24 } }}
    >
      <Title level={4} style={{ marginBottom: 16, color: accentColor }}>
        AI-Created Blog Posts
      </Title>
      <Paragraph>
        BrodAI can generate optimized articles for your niche, helping you rank for the 
        keywords that matter. See a few examples below:
      </Paragraph>

      <List
        itemLayout="vertical"
        dataSource={blogPosts}
        renderItem={(item) => (
          <List.Item style={{ padding: '12px 0' }}>
            <Title level={5} style={{ marginBottom: 4 }}>
              {item.title}
            </Title>
            <Text type="secondary">
              {item.snippet}
            </Text>
            <div style={{ marginTop: 8 }}>
              <Button type="link" style={{ padding: 0 }}>
                Read more
              </Button>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
