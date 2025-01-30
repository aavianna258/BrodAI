'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Typography, Spin, message } from 'antd';

const { Title, Paragraph } = Typography;

// Types renvoyés par /analysis
interface IDomainAnalysisResponse {
  scoreNumeric?: number;       // "BrodAI SEO score"
  monthlyTraffic?: number;     // Trafic mensuel
  performanceRating?: string;  // "Website authority" ou un label similaire
  // ... d'autres champs si besoin
}

// Types renvoyés par /webAuditNoCheck
interface ITechRecommendation {
  priority: string;
  issue: string;
  recommendation: string;
}

interface IWebAuditResponse {
  recommendations?: ITechRecommendation[];
  original_content?: string;
  // ... d'autres champs éventuels
}

type BrodAIAnalysisSectionProps = {
  domain: string;  // domain ou URL à analyser
  onPublishContent?: () => void; 
};

export default function BrodAIAnalysisSection({
  domain,
  onPublishContent,
}: BrodAIAnalysisSectionProps) {
  // --------------------------------------------------------
  // States
  // --------------------------------------------------------
  const [analysisData, setAnalysisData] = useState<IDomainAnalysisResponse | null>(null);
  const [techRecommendations, setTechRecommendations] = useState<ITechRecommendation[]>([]);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // --------------------------------------------------------
  // 1) Fetch Domain Analysis ( /analysis ) au montage
  // --------------------------------------------------------
  useEffect(() => {
    if (!domain) return;
    fetchDomainAnalysis(domain);
  }, [domain]);

  const fetchDomainAnalysis = async (domainValue: string) => {
    setLoadingAnalysis(true);
    try {
      const response = await fetch('https://test-deploy-cpho.onrender.com/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainValue }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch domain analysis');
      }
      const data = await response.json();
      // Vérifier qu’on a bien data.data / data.status
      if (data.status !== 200) {
        throw new Error(data.data?.error || 'Analysis returned an error');
      }
      setAnalysisData(data.data);
    } catch (error: any) {
      console.error(error);
      message.error(error.message || 'Error fetching domain analysis');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // --------------------------------------------------------
  // 2) Fetch Technical Audit ( /webAuditNoCheck ) au clic
  // --------------------------------------------------------
  const handleFetchAudit = async () => {
    if (!domain) {
      message.warning('No domain/URL provided');
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

  // --------------------------------------------------------
  // 3) Rendu
  // --------------------------------------------------------
  const { scoreNumeric, monthlyTraffic, performanceRating } = analysisData || {};

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px' }}>
      
      {/* ---------- BrodAI analysis ---------- */}
      <Card
        bordered={false}
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 24 }}
      >
        <Title level={3} style={{ textAlign: 'center' }}>
          BrodAI analysis
        </Title>

        {loadingAnalysis ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Spin tip="Loading domain analysis..." />
          </div>
        ) : analysisData ? (
          <>
            <Paragraph>
              <strong>BrodAI SEO score:</strong> {scoreNumeric ?? 'N/A'}
            </Paragraph>
            <Paragraph>
              <strong>Monthly traffic:</strong> {monthlyTraffic ?? 'N/A'}
            </Paragraph>
            <Paragraph>
              <strong>Website authority:</strong>{' '}
              {performanceRating ?? 'N/A'}
            </Paragraph>
          </>
        ) : (
          <Paragraph type="secondary">No data yet.</Paragraph>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="primary" onClick={handleFetchAudit} loading={loadingAudit}>
            Technical audit results
          </Button>
        </div>
      </Card>

      {/* ---------- Proposed solutions ---------- */}
      <Card
        bordered={false}
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Title level={4} style={{ textAlign: 'center' }}>
          Proposed solutions
        </Title>
        <ul style={{ listStyle: 'disc', marginLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>
            <Button
              type="link"
              onClick={onPublishContent}
              style={{ padding: 0, height: 'auto', lineHeight: 1.4 }}
            >
              Publish high-quality content
            </Button>
            <span style={{ marginLeft: 8 }}>
              (redirects to “High-potential topics…”)
            </span>
          </li>
          <li style={{ marginBottom: 8, color: '#999' }}>
            Correct technical issues <em>(Available soon)</em>
          </li>
        </ul>
      </Card>

      {/* ---------- Modal Audit Technique ---------- */}
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
