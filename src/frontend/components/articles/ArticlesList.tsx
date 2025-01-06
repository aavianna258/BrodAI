// components/articles/ArticlesList.tsx
'use client';

import React from 'react';
import { List, Avatar, Typography, Button, Tag } from 'antd';

const { Paragraph, Title } = Typography;

interface Article {
  title: string;
  keywords: string[];
  snippet: string;
}

interface ArticlesListProps {
  articles: Article[];
  // highlightKeywords is removed because it's no longer used
}

export default function ArticlesList({ articles }: ArticlesListProps) {
  return (
    <List
      itemLayout="vertical"
      dataSource={articles}
      renderItem={(item) => (
        <List.Item style={{ marginBottom: 24 }}>
          <List.Item.Meta
            avatar={<Avatar style={{ backgroundColor: '#87d068' }}>AI</Avatar>}
            title={<Title level={4} style={{ marginBottom: 4 }}>{item.title}</Title>}
            description={
              <div style={{ marginBottom: 8 }}>
                {item.keywords.map((kw, idx) => (
                  <Tag color="blue" key={idx} style={{ marginBottom: 4 }}>
                    {kw}
                  </Tag>
                ))}
              </div>
            }
          />
          <Paragraph style={{ fontSize: '1rem' }}>
            {item.snippet}
            <Button type="link" style={{ paddingLeft: 8 }}>
              Read more
            </Button>
          </Paragraph>
        </List.Item>
      )}
    />
  );
}
