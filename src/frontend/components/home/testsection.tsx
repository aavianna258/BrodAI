'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, message, Spin, Modal, Typography } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Paragraph } = Typography;

// ---------------------------------------------------------------------
// 1) Types
// ---------------------------------------------------------------------
interface IDomainAnalysis {
  scoreNumeric?: number;
  monthlyTraffic?: number;
  performanceRating?: string;  // “Website authority” ou similaire
  // ... adapter si l'API renvoie d'autres champs
}

interface ITechRecommendation {
  priority: string;
  issue: string;
  recommendation: string;
}

interface IWebAuditResponse {
  recommendations?: ITechRecommendation[];
  // ... adapter si besoin
}

// ---------------------------------------------------------------------
// 2) Composant principal
// ---------------------------------------------------------------------
export default function BrodAIHeroAnalysis() {
  // ********************* TYPED TEXT LOGIC ****************************
  const lines = [
    'Rank 10x faster at 95% lower cost.',
    'The next era of frictionless SEO.',
    'No SEO experience required, run BrodAI, succeed!',
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

  // ********************* ANALYSIS LOGIC ******************************
  const [domain, setDomain] = useState('');
  const [analysisData, setAnalysisData] = useState<IDomainAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // For the technical audit
  const [techRecommendations, setTechRecommendations] = useState<ITechRecommendation[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // ---------------------------------------------------------------------
  // 3) Handler: fetch domain analysis
  // ---------------------------------------------------------------------
  const handleAnalyzeDomain = async () => {
    if (!domain.trim()) {
      message.warning('Please enter a valid domain.');
      return;
    }
    setAnalysisData(null);
    setTechRecommendations([]);
    setLoadingAnalysis(true);

    try {
      // 1) Fetch domain analysis
      const res = await fetch('https://test-deploy-cpho.onrender.com/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch domain analysis');
      }
      const data = await res.json();
      if (data.status !== 200) {
        throw new Error(data.data?.error || 'Analysis returned an error');
      }
      setAnalysisData(data.data);  // stocker { scoreNumeric, monthlyTraffic, ... }
    } catch (error: any) {
      console.error(error);
      message.error(error.message || 'Error analyzing domain');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // ---------------------------------------------------------------------
  // 4) Handler: fetch technical audit
  // ---------------------------------------------------------------------
  const handleFetchAudit = async () => {
    if (!domain.trim()) {
      message.warning('Please enter a domain first.');
      return;
    }
    setLoadingAudit(true);
    try {
      const resp = await fetch('http://localhost:8000/webAuditNoCheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: domain }),
      });
      if (!resp.ok) {
        throw new Error(`Server error: ${resp.status}`);
      }
      const data: IWebAuditResponse = await resp.json();
      setTechRecommendations(data.recommendations || []);
      setAuditModalOpen(true);
    } catch (err: any) {
      console.error(err);
      message.error('Could not perform web audit');
    } finally {
      setLoadingAudit(false);
    }
  };

  // ---------------------------------------------------------------------
  // 5) Rendering
  // ---------------------------------------------------------------------
  return (
    <div
      className="bg-gradient-to-r from-[#e0ecff] to-[#f0f4ff] text-center"
      style={{ padding: '60px 20px', minHeight: '60vh' }}
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
            BrodAI Analysis
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

          {/* Domain Input & Analyze Button */}
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
              onClick={handleAnalyzeDomain}
              style={{ backgroundColor: '#2563EB', borderColor: '#2563EB' }}
            >
              Analyze
            </Button>
          </div>

          {/* Analysis result area */}
          {loadingAnalysis && (
            <div style={{ marginTop: 24 }}>
              <Spin tip="Analyzing your domain..." />
            </div>
          )}

          {analysisData && !loadingAnalysis && (
            <div style={{ marginTop: 24, textAlign: 'left' }}>
              {/* BrodAI SEO Score */}
              <Paragraph>
                <strong>BrodAI SEO score: </strong>
                {analysisData.scoreNumeric ?? 'N/A'}
              </Paragraph>
              {/* Monthly Traffic */}
              <Paragraph>
                <strong>Monthly traffic: </strong>
                {analysisData.monthlyTraffic ?? 'N/A'}
              </Paragraph>
              {/* Website Authority (Performance Rating) */}
              <Paragraph>
                <strong>Website authority: </strong>
                {analysisData.performanceRating ?? 'N/A'}
              </Paragraph>

              <Button
                onClick={handleFetchAudit}
                loading={loadingAudit}
                style={{ marginTop: 16, backgroundColor: '#2563EB', borderColor: '#2563EB', color: '#fff' }}
              >
                Technical audit results
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Modal with Technical Audit */}
      <Modal
        title="Technical Audit Report"
        open={auditModalOpen}
        onCancel={() => setAuditModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setAuditModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {techRecommendations.length === 0 ? (
          <Paragraph>No recommendations found or parse error.</Paragraph>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {techRecommendations.map((rec, idx) => (
              <li key={idx} style={{ marginBottom: '1rem' }}>
                <Paragraph>
                  <strong>Priority:</strong> {rec.priority}
                </Paragraph>
                <Paragraph>
                  <strong>Issue:</strong> {rec.issue}
                </Paragraph>
                <Paragraph>
                  <strong>Recommendation:</strong> {rec.recommendation}
                </Paragraph>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
