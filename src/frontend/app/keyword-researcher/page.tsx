'use client';

import React, { useState } from 'react';
import { Row, Col, Typography, Input, Button, List, Spin, message } from 'antd';

const { Title } = Typography;

interface IBrodAIKeyword {
  keyword: string;
  traffic: number;
  difficulty: number;
  performance_score: number;
}

export default function KeywordResearcherPage() {
  const [mainKeyword, setMainKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<IBrodAIKeyword[]>([]);

  const onSearch = async () => {
    if (!mainKeyword.trim()) {
      message.warning('Please enter a main keyword.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/keyword_research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ main_keyword: mainKeyword }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch keywords from FastAPI');
      }

      const data = await response.json();
      // Make sure this key matches what your API returns
      setKeywords(data.target_kw_report || []);
    } catch (error: any) {
      message.error(error.message || 'Error fetching keywords');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row
      justify="center"
      style={{
        minHeight: 'calc(100vh - 64px)', // Adjust if your NavBar has a different height
        background: '#fff',
        textAlign: 'center',
        padding: '60px 20px',
        margin: 0,
      }}
      align="top"
    >
      <Col xs={24} md={16} lg={12}>
        <Title level={2} style={{ marginBottom: 20 }}>
          Keyword Researcher
        </Title>
        <div style={{ marginBottom: 20 }}>
          <Input
            placeholder="Enter your main keyword"
            value={mainKeyword}
            onChange={(e) => setMainKeyword(e.target.value)}
            style={{ width: 300, marginRight: 10 }}
          />
          <Button type="primary" onClick={onSearch}>
            Find Best Keywords
          </Button>
        </div>

        {loading ? (
          <div style={{ marginTop: 20 }}>
            <Spin tip="Researching keywords..." spinning={loading} />
          </div>
        ) : (
          <List
            style={{ marginTop: 20 }}
            bordered
            dataSource={keywords}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.keyword}
                  description={
                    <>
                      <div>Traffic: {item.traffic}</div>
                      <div>Difficulty: {item.difficulty}</div>
                      <div>Performance Score: {item.performance_score}</div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Col>
    </Row>
  );
}
