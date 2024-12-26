// app/status/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout, Typography, Space } from 'antd';
import LoadingPlaceholder from '@/components/status/LoadingPlaceholder';
import AnalysisResult from '@/components/status/AnalysisResult';
import StatusCtaSection from '@/components/status/statusCtaSection';

const { Content } = Layout;
const { Title, Text } = Typography;

interface AnalysisData {
  scoreNumeric: number;
  scoreLetter: string;
  performanceRating: string;
  nextSteps: string[];
  curatedKeywords: string[];
  blogPosts: { title: string; snippet: string }[];
  detailedKeywords: {
    keyword: string;
    currentPosition: number;
    potentialTraffic: number;
    competitionLevel: string;
  }[];
  improvementKeywords: {
    keyword: string;
    reason: string;
  }[];
}

export default function StatusPage() {
  const accentColor = '#3B82F6'; 
  const searchParams = useSearchParams();
  const domain = searchParams.get('url') ?? 'example.com';

  const [loading, setLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // show placeholders for 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const res = await fetch(`/api/mockAnalysis?url=${encodeURIComponent(domain)}`);
        const json = await res.json();
        if (json.status === 200) {
          setAnalysis(json.data);
        }
      } catch (error) {
        console.error('Error fetching analysis data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [domain]);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Content style={{ padding: '40px', maxWidth: 1000, margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>
              SEO Audit Results
            </Title>
            <Text type="secondary">
              <span style={{ marginRight: 8 }}>🌐</span>
              {domain}
            </Text>
          </div>

          {loading || !analysis ? (
            <LoadingPlaceholder />
          ) : (
            <AnalysisResult analysis={analysis} accentColor={accentColor} />
          )}
             <StatusCtaSection />
        </Space>
      </Content>
    </Layout>
  );
}
