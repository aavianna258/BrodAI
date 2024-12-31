'use client';

import React, { useState } from 'react';
import { Row, Col, Input, Button, Card, Spin, message, Table, Progress } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingOutlined } from '@ant-design/icons';

// Types for domain analysis
interface ITopKeyword {
  keyword: string;
  position: number;
  volume: number;
}

interface IDomainAnalysisData {
  monthlyTraffic?: number;
  scoreNumeric?: number;       // e.g. 0-100
  performanceRating?: string;  // "Needs Improvement", "Good", ...
  topKeywords?: ITopKeyword[];
  nextSteps?: string[];
  error?: string;
}

// Types for keyword research
interface IBrodAIKeyword {
  keyword: string;
  traffic: number;
  difficulty: number;
  performance_score: number;
}

// -------------- Services -------------- //
// In a real app, you'd put these in /services/*.ts

async function fetchDomainAnalysis(domain: string): Promise<IDomainAnalysisData> {
  const response = await fetch('http://localhost:8000/analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch domain analysis');
  }
  const data = await response.json();
  if (data.status !== 200) {
    throw new Error(data.data?.error || 'Analysis returned an error');
  }
  return data.data; 
}

async function fetchKeywordResearch(mainKeyword: string): Promise<IBrodAIKeyword[]> {
  const response = await fetch('http://localhost:8000/keyword_research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ main_keyword: mainKeyword }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch keyword research');
  }
  const data = await response.json();
  // data.target_kw_report is the array
  return data.target_kw_report || [];
}

// -------------------------------------- //

export default function HeroSection() {
  const [domain, setDomain] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<IDomainAnalysisData | null>(null);

  // Combined list of newly researched keywords from the domain’s top keywords
  const [allSuggestedKeywords, setAllSuggestedKeywords] = useState<IBrodAIKeyword[]>([]);

  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [isFetchingKeywords, setIsFetchingKeywords] = useState(false);

  const spinnerIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />;

  // 1) Handler: Analyze Domain
  const handleAnalyzeDomain = async () => {
    if (!domain.trim()) {
      message.warning('Please enter a valid domain.');
      return;
    }
    setIsRunningAnalysis(true);
    setAnalysisLoading(true);
    setAnalysisData(null);
    setAllSuggestedKeywords([]);
    try {
      const result = await fetchDomainAnalysis(domain);
      setAnalysisData(result);
    } catch (error: any) {
      message.error(error.message || 'Error analyzing domain');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // 2) Handler: For the domain’s top keywords, do a “keyword research” call
  const handleFetchSuggestedKeywords = async () => {
    if (!analysisData || !analysisData.topKeywords) return;

    setIsFetchingKeywords(true);
    setAllSuggestedKeywords([]);
    try {
      let combinedResults: IBrodAIKeyword[] = [];

      // For each top domain keyword, call /keyword_research
      for (const kw of analysisData.topKeywords) {
        const res = await fetchKeywordResearch(kw.keyword);
        combinedResults = [...combinedResults, ...res];
      }

      // Sort all results by performance_score desc
      const sortedByPerf = combinedResults.sort(
        (a, b) => b.performance_score - a.performance_score
      );
      // Take top 10
      const top10 = sortedByPerf.slice(0, 10);
      setAllSuggestedKeywords(top10);
    } catch (error: any) {
      message.error(error.message || 'Error fetching new keywords');
    } finally {
      setIsFetchingKeywords(false);
    }
  };

  // Table columns for the final "Top 10 new keywords" we suggest
  const suggestedColumns = [
    {
      title: 'Keyword',
      dataIndex: 'keyword',
      key: 'keyword',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Avg. Search Volume',
      dataIndex: 'traffic',
      key: 'traffic',
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
    },
    {
      title: 'Perf. Score',
      dataIndex: 'performance_score',
      key: 'performance_score',
    },
  ];

  return (
    <div
      className="bg-gradient-to-r from-[#e0ecff] to-[#f0f4ff] text-center"
      // Start smaller, allow it to expand as new cards appear
      style={{ padding: '60px 20px', minHeight: '50vh' }}
    >
      {/* --------------- Input / Title --------------- */}
      <Row justify="center">
        <Col xs={24} sm={20} md={14} lg={12}>
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '2.5rem',
              color: '#2563EB',
              marginBottom: '16px',
              fontWeight: 'bold',
            }}
          >
            Your AI SEO Agent
          </motion.h1>

          {/* Domain Input */}
          {!isRunningAnalysis && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                margin: '0 auto',
                maxWidth: '400px',
                display: 'flex',
                gap: '8px',
              }}
            >
              <Input
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                onClick={handleAnalyzeDomain}
                style={{ backgroundColor: '#2563EB', borderColor: '#2563EB' }}
              >
                Analyze
              </Button>
            </motion.div>
          )}
        </Col>
      </Row>

      {/* --------------- Analysis Flow --------------- */}
      {isRunningAnalysis && (
        <Row justify="center" style={{ marginTop: '24px' }}>
          <Col xs={24} sm={20} md={14} lg={12}>
            {/* Loader while we wait for domain analysis */}
            {analysisLoading && (
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

            {/* Once we have the analysis */}
            {!analysisLoading && analysisData && !analysisData.error && (
              <>
                {/* 1) Show the domain scoring with animation */}
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      background: '#f9fafb',
                      marginTop: '16px',
                      textAlign: 'left',
                      padding: '16px',
                      borderRadius: '8px',
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        marginBottom: '16px',
                        textAlign: 'center',
                        fontSize: '1.25rem',
                      }}
                    >
                      SEO Score for {domain}
                    </p>
                    <div
                      style={{
                        background: '#fff',
                        borderLeft: '4px solid #059669',
                        padding: 12,
                      }}
                    >
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>Score (out of 100):</strong>{' '}
                        {analysisData.scoreNumeric ?? 0}
                      </p>
                      <Progress
                        percent={analysisData.scoreNumeric ?? 0}
                        status="active"
                        strokeColor={{
                          '0%': '#34d399',
                          '100%': '#059669',
                        }}
                      />
                      <p style={{ marginTop: 8 }}>
                        <strong>Performance Rating:</strong>{' '}
                        {analysisData.performanceRating ?? 'N/A'}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* 2) Show top keywords with explanation */}
                {analysisData.topKeywords && analysisData.topKeywords.length > 0 && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      style={{
                        background: '#f9fafb',
                        marginTop: '16px',
                        textAlign: 'left',
                        padding: '16px',
                        borderRadius: '8px',
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 600,
                          marginBottom: '16px',
                          textAlign: 'center',
                          fontSize: '1.25rem',
                        }}
                      >
                        Top Keywords for {domain}
                      </p>
                      <div
                        style={{
                          background: '#fff',
                          borderLeft: '4px solid #2563EB',
                          padding: 12,
                        }}
                      >
                        <p style={{ marginBottom: 12, fontStyle: 'italic', color: '#6b7280' }}>
                          These keywords reflect your **current** position in Google search
                          for that query. <strong>"Volume"</strong> below is the **average monthly search volume** 
                          for each keyword.
                        </p>
                        {analysisData.topKeywords.map((k, idx) => (
                          <div
                            key={idx}
                            style={{
                              marginBottom: '8px',
                            }}
                          >
                            <strong>{k.keyword}</strong> — Position: {k.position}, Avg. Search Volume: {k.volume}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* 3) Button to "Generate new suggestions" */}
                {analysisData.topKeywords && analysisData.topKeywords.length > 0 && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      style={{ textAlign: 'center', marginTop: '16px' }}
                    >
                      <Button
                        type="primary"
                        onClick={handleFetchSuggestedKeywords}
                        style={{
                          backgroundColor: '#059669',
                          borderColor: '#059669',
                        }}
                      >
                        Find 10 New Keywords to Target
                      </Button>
                    </motion.div>
                  </AnimatePresence>
                )}
              </>
            )}

            {/* 4) If domain analysis returned an error */}
            {!analysisLoading && analysisData?.error && (
              <Card
                style={{
                  marginTop: '16px',
                  textAlign: 'left',
                  background: '#f9fafb',
                }}
                bordered={false}
              >
                <p style={{ color: 'red', fontWeight: 600 }}>
                  Error: {analysisData.error}
                </p>
              </Card>
            )}
          </Col>
        </Row>
      )}

      {/* --------------- Show the newly discovered 10 Keywords --------------- */}
      {isRunningAnalysis && (
        <Row justify="center" style={{ marginTop: '24px' }}>
          <Col xs={24} sm={20} md={14} lg={12}>
            {isFetchingKeywords && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ margin: '0 auto', width: '50px', height: '50px', color: '#059669' }}
              >
                <Spin indicator={spinnerIcon} />
              </motion.div>
            )}

            {!isFetchingKeywords && allSuggestedKeywords.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  background: '#f9fafb',
                  marginTop: '16px',
                  textAlign: 'left',
                  padding: '16px',
                  borderRadius: '8px',
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    marginBottom: '16px',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                  }}
                >
                  10 New Keywords You Can Target
                </p>
                <div
                  style={{
                    background: '#fff',
                    borderLeft: '4px solid #059669',
                    padding: 12,
                  }}
                >
                  <Table
                    columns={suggestedColumns}
                    dataSource={allSuggestedKeywords.map((item, idx) => ({
                      key: idx,
                      ...item,
                    }))}
                    pagination={false}
                    style={{ marginBottom: 16 }}
                  />
                  <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                    <strong>Note:</strong> With good on-page SEO (and potentially no backlinks),
                    you can sometimes rank on Google's first page for these keywords.
                  </p>

                  {/* Animated "Write a blog post" button */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ textAlign: 'center', marginTop: 16 }}
                  >
                    <Button
                      style={{
                        backgroundColor: '#2563EB',
                        borderColor: '#2563EB',
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                      onClick={() => {
                        // For now, do nothing
                        message.info("This feature is coming soon!");
                      }}
                    >
                      Write a blog post for these keywords and x10 your monthly traffic with BrodAI
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
}
