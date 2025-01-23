// app/keyword-research/page.tsx or pages/keyword-research.tsx
'use client'; // for Next.js 13 with App Router

import React, { useState } from 'react';
import { Row, Col, Input, Button, Spin, message, Table } from 'antd';
import { motion } from 'framer-motion';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchKeywords, IBrodAIKeyword } from '@/components/keyword-research/KeywordResearchService';
import { useRouter } from 'next/navigation';



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

  const router = useRouter();

  function handleWriteArticle(keyword: string) {
    // On peut pousser vers /create-article en passant la query `keyword`
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
        // Exemple avec Link :
        // <Link href={`/create-article?keyword=${encodeURIComponent(record.keyword)}`}>
        //   <Button type="primary">Write an article</Button>
        // </Link>
  
        // OU exemple avec un handleWriteArticle :
        <Button type="primary" onClick={() => handleWriteArticle(record.keyword)}>
          Write an article
        </Button>
      )
    },
  ];

  return (
    <div
      style={{
        padding: '60px 20px',
        textAlign: 'center',
        minHeight: '70vh', // Reduced to avoid a very tall layout initially
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

          {/* Additional section: highlights the power of the Keyword Research Agent & free trial */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              marginTop: 40,
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: 16 }}>
              Experience Our Powerful Keyword Research Agent
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: 24 }}>
              Our agent analyzes your ideas, phrases, or keywords to instantly find the best
              keywords that will help you rank on Google's first page. Get keywords with high
              search volume, strong conversion intent, and very low difficulty.
              <br />
              BrodAI is offering a free trial of this tool, with 50 free uses to discover its power.
            </p>
            <Button type="primary" size="large">
              Get Your Free Trial (50 Uses)
            </Button>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}
