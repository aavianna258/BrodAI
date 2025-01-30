// app/keyword-research/page.tsx or pages/keyword-research.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Input, Button, Spin, message, Table } from 'antd';
import { motion } from 'framer-motion';
import { LoadingOutlined } from '@ant-design/icons';

import { fetchKeywords, IBrodAIKeyword } from '@/components/keyword-research/KeywordResearchService';

export default function KeywordResearchPage() {
  const [mainKeyword, setMainKeyword] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<IBrodAIKeyword[]>([]);

  const router = useRouter();
  const spinnerIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />;

  async function handleSearch() {
    if (!mainKeyword.trim()) {
      message.warning('Please enter a valid domain.');
      return;
    }
    setLoading(true);
    setKeywords([]);

    try {
      const data = await fetchKeywords(mainKeyword);
      setKeywords(data);
    } catch (error: any) {
      message.error(error.message || 'Error fetching keywords');
    } finally {
      setLoading(false);
    }
  }

  function handleWriteArticle(keyword: string) {
    router.push(`/create-article?keyword=${encodeURIComponent(keyword)}`);
  }

  // Table columns
  const columns = [
    { title: 'Keyword', dataIndex: 'keyword', key: 'keyword' },
    { title: 'Traffic', dataIndex: 'traffic', key: 'traffic' },
    { title: 'Difficulty', dataIndex: 'difficulty', key: 'difficulty' },
    { title: 'Perf. Score', dataIndex: 'performance_score', key: 'performance_score' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: IBrodAIKeyword) => (
        <Button type="primary" onClick={() => handleWriteArticle(record.keyword)}>
          Write an article
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: '60px 20px',
        textAlign: 'center',
        minHeight: '70vh',
        background: 'linear-gradient(90deg, #e0ecff 0%, #f0f4ff 100%)',
      }}
    >
      {/* 1) Title + Intro (from demo_agent’s “HeroSection”-like content) */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '40px' }}
      >
        <h1 style={{ fontSize: '2.5rem', color: '#2563EB', fontWeight: 'bold', marginBottom: '16px' }}>
          Discover Profitable Topics for Your Domain
        </h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
          Our AI can analyze your website or domain and uncover fresh, low-competition keyword ideas
          that help you rank faster. Simply enter your domain below and let’s get started!
        </p>
      </motion.div>

      {/* 2) Existing Input + Table Section */}
      <Row justify="center">
        <Col xs={24} sm={20} md={14} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 24 }}
          >
            <Input
              placeholder="Enter your domain"
              value={mainKeyword}
              onChange={(e) => setMainKeyword(e.target.value)}
              style={{ maxWidth: 400, marginRight: 8 }}
            />
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </motion.div>

          {/* Loading Spinner */}
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

          {/* Keyword Results Table */}
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
                Top Keywords Related to &quot;{mainKeyword}&quot;
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

      {/* 3) How It Works (2-step version) — placed AFTER the table/columns */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          margin: '40px auto 0 auto',
          padding: '24px',
          maxWidth: '800px',
          backgroundColor: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'left',
        }}
      >
        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: 16 }}>
          How It Works
        </h2>
        <ol style={{ lineHeight: 1.8, paddingLeft: '20px' }}>
          <li style={{ marginBottom: '12px' }}>
            <strong>Step 1:</strong> We analyze your domain’s strengths and current SEO signals.
          </li>
          <li>
            <strong>Step 2:</strong> We uncover the top keyword opportunities that offer high traffic
            but low competition.
          </li>
        </ol>
      </motion.div>

      {/* 4) Removed "Experience Our Powerful Keyword Research Agent" section entirely */}
    </div>
  );
}
