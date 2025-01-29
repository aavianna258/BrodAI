'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, message, Spin } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

import DomainAnalysisReport from '@/components/domain-analysis/DomainAnalysisReport';
import fetchDomainAnalysis from '@/components/domain-analysis/fetchDomainAnalysis';
import { IBrodAIKeyword } from '@/components/domain-analysis/fetchKeywordResearch';

export default function HeroSection() {
  // --------------------------------------------------------------------------
  // 1) Setup for TYPING TEXT
  // --------------------------------------------------------------------------
  const lines = [
    'Rank 10x faster at 95% lower cost.',
    'The next era of frictionless SEO.',
    'No SEO experience required, run BrodAI, succeed',
  ];

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTypingForward, setIsTypingForward] = useState(true);

  // Speeds & delays (in ms)
  const TYPING_SPEED = 50;
  const DELETING_SPEED = 40;
  const PAUSE_AFTER_LINE = 700;

  useEffect(() => {
    let typingTimeout: ReturnType<typeof setTimeout>;
    const currentLine = lines[currentLineIndex];

    function handleTyping() {
      if (isTypingForward) {
        // Typing forward
        if (displayText.length < currentLine.length) {
          setDisplayText(currentLine.slice(0, displayText.length + 1));
          typingTimeout = setTimeout(handleTyping, TYPING_SPEED);
        } else {
          typingTimeout = setTimeout(() => setIsTypingForward(false), PAUSE_AFTER_LINE);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
          typingTimeout = setTimeout(handleTyping, DELETING_SPEED);
        } else {
          // Move to next line
          const nextIndex = (currentLineIndex + 1) % lines.length;
          setCurrentLineIndex(nextIndex);
          setIsTypingForward(true);
        }
      }
    }

    typingTimeout = setTimeout(
      handleTyping,
      isTypingForward ? TYPING_SPEED : DELETING_SPEED
    );

    return () => clearTimeout(typingTimeout);
  }, [displayText, isTypingForward, currentLineIndex, lines]);

  // --------------------------------------------------------------------------
  // 2) State for Domain, Analysis, and Suggested Keywords
  // --------------------------------------------------------------------------
  const [domain, setDomain] = useState('');
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [suggestedKeywords, setSuggestedKeywords] = useState<IBrodAIKeyword[] | null>(null);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------------------------------
  // 3) Handler to call the backend
  // --------------------------------------------------------------------------
  const handleDomainAnalyze = async () => {
    if (!domain.trim()) {
      message.warning('Please enter a valid domain.');
      return;
    }

    setLoading(true);
    setAnalysisData(null);
    setSuggestedKeywords(null);

    try {
      // 1) Fetch domain analysis (which includes suggested_keywords in the same response)
      const result = await fetchDomainAnalysis(domain);

      // 2) Store the analysis data
      setAnalysisData(result);

      // 3) Also check if the backend returned suggested keywords
      if (result.suggested_keywords) {
        setSuggestedKeywords(result.suggested_keywords);
      }

    } catch (error: any) {
      message.error(error.message || 'Error analyzing domain');
      // Optionally store error in analysisData so DomainAnalysisReport can display it
      setAnalysisData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // 4) Render
  // --------------------------------------------------------------------------
  return (
    <div
      className="bg-gradient-to-r from-[#e0ecff] to-[#f0f4ff] text-center"
      style={{ padding: '60px 20px', minHeight: '50vh' }}
    >
      <Row justify="center">
        <Col xs={24} sm={20} md={14} lg={12}>
          {/* Title */}
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

          {/* Typed text */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentLineIndex + (isTypingForward ? '_typing' : '_deleting')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ marginBottom: 24, fontSize: '1.2rem', minHeight: '60px' }}
            >
              <div>{displayText}</div>
            </motion.div>
          </AnimatePresence>

          {/* Domain Input & Button */}
          <div
            style={{
              margin: '0 auto',
              maxWidth: '400px',
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
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
              onClick={handleDomainAnalyze}
              style={{ backgroundColor: '#2563EB', borderColor: '#2563EB' }}
            >
              Analyze
            </Button>
          </div>

          {/* If loading, show a spinner or some feedback */}
          {loading && (
            <div style={{ marginTop: 24 }}>
              <Spin tip="Analyzing your domain..." />
            </div>
          )}

          {/* Show results if we have them */}
          {analysisData && !loading && (
            <div style={{ marginTop: 40 }}>
              <DomainAnalysisReport
                domain={domain}
                analysisData={analysisData}
                suggestedKeywords={suggestedKeywords}
              />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
