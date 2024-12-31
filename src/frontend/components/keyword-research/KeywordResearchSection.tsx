// src/components/keyword-research/KeywordResearchSection.tsx
'use client';

import React, { useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { motion } from 'framer-motion';
import { LoadingOutlined } from '@ant-design/icons';

import KeywordResearchForm from './KeywordResearchForm';
import KeywordResearchResults from './KeywordResearchResults';
import { IBrodAIKeyword } from './KeywordResearchService';

export default function KeywordResearchSection() {
  const [keywords, setKeywords] = useState<IBrodAIKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [mainKeyword, setMainKeyword] = useState('');

  const spinnerIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />;

  const handleSearchComplete = (data: IBrodAIKeyword[]) => {
    setKeywords(data);
  };

  const handleLoadingChange = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  return (
    <div
      className="bg-gradient-to-r from-[#e0ecff] to-[#f0f4ff] text-center"
      style={{ padding: '60px 20px' }}
    >
      <Row justify="center">
        <Col xs={24} sm={20} md={14} lg={12}>
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '2rem',
              color: '#059669',
              marginBottom: '16px',
              fontWeight: 'bold',
            }}
          >
            Keyword Research
          </motion.h1>

          {/* The form */}
          {!loading && keywords.length === 0 && (
            <KeywordResearchForm
              onSearchComplete={(data) => {
                setMainKeyword(data.length > 0 ? data[0].keyword : '');
                handleSearchComplete(data);
              }}
              onLoadingChange={handleLoadingChange}
            />
          )}

          {/* Show a spinner if loading */}
          {loading && (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{
                margin: '0 auto',
                width: '50px',
                height: '50px',
                color: '#059669',
              }}
            >
              <Spin indicator={spinnerIcon} />
            </motion.div>
          )}

          {/* Results */}
          {!loading && keywords.length > 0 && (
            <KeywordResearchResults mainKeyword={mainKeyword} keywords={keywords} />
          )}
        </Col>
      </Row>
    </div>
  );
}
