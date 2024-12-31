// app/keyword-research/page.tsx or pages/keyword-research.tsx
'use client'; // for Next.js 13 with App Router

import React, { useState } from 'react';
import { Row, Col, Input, Button, Spin, message, Table } from 'antd';
import { motion } from 'framer-motion';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchKeywords, IBrodAIKeyword } from '@/components/keyword-research/KeywordResearchService';

export default function KeywordResearchPage() {
  const [mainKeyword, setMainKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<IBrodAIKeyword[]>([]);

  const spinnerIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />;

  const handleSearch = async () => {
    if (!mainKeyword.trim()) {
      message.warning('Please enter a main keyword or phrase.');
      return;
    }
    setLoading(true);
    setKeywords([]);
    try {
      const data = await fetchKeywords(mainKeyword);
      setKeywords(data);
    } catch (error: any) {
      message.error(error.message || 'Error fetching keyword data');
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    { title: 'Keyword', dataIndex: 'keyword', key: 'keyword' },
    { title: 'Traffic', dataIndex: 'traffic', key: 'traffic' },
    { title: 'Difficulty', dataIndex: 'difficulty', key: 'difficulty' },
    { title: 'Perf. Score', dataIndex: 'performance_score', key: 'performance_score' },
  ];

  return (
    <div
      style={{
        padding: '60px 20px',
        textAlign: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(90deg, #e0ecff 0%, #f0f4ff 100%)',
      }}
    >
      <Row justify="center">
        <Col xs={24} sm={20} md={14} lg={12}>
          <motion.h2
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '2rem',
              color: '#2563EB',
              marginBottom: '16px',
              fontWeight: 'bold',
            }}
          >
            Keyword Research
          </motion.h2>

          <div style={{ marginBottom: 24 }}>
            <Input
              placeholder="Enter your main keyword or phrase"
              value={mainKeyword}
              onChange={(e) => setMainKeyword(e.target.value)}
              style={{ maxWidth: 400, marginRight: 8 }}
            />
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>

          {loading && (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{
                margin: '0 auto',
                width: '50px',
                height: '50px',
                color: '#2563EB',
              }}
            >
              <Spin indicator={spinnerIcon} />
            </motion.div>
          )}

          {!loading && keywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                background: '#f9fafb',
                textAlign: 'left',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <h3 style={{ textAlign: 'center', fontWeight: 600, marginBottom: 16 }}>
                Top Keywords Related to "{mainKeyword}"
              </h3>
              <Table
                columns={columns}
                dataSource={keywords.map((item, idx) => ({ key: idx, ...item }))}
                pagination={false}
              />
            </motion.div>
          )}
        </Col>
      </Row>
    </div>
  );
}
