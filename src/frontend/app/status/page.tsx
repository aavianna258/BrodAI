// app/status/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout, Card, Space, Typography } from 'antd';

import StatusHero from '@/components/status/StatusHero';
import ScoreSection from '@/components/status/ScoreSection';
import TrafficOverview from '@/components/status/TrafficOverview';
import KeywordDetails from '@/components/status/KeywordDetails';
import StatusCTA from '@/components/status/StatusCTA';

const { Content } = Layout;
const { Text, Title } = Typography;

interface AnalysisData {
  score: number;
  monthlyTraffic: number;
  avgMonthlyClicks: number;
  reasonWhyScoreLow: string[];
  details: { keyword: string; rating: string; position: number }[];
  improvements: string[];
}

export default function StatusPage() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url') ?? 'your-website.com';

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/mockAnalysis?url=${encodeURIComponent(urlParam)}`);
        const json = await res.json();
        if (json.status === 200) {
          setAnalysis(json.data);
        }
      } catch (err) {
        console.error('Error fetching analysis:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [urlParam]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ margin: '24px' }}>
        <Card style={{ borderRadius: 8, padding: 24 }}>
          {loading ? (
            <Text>Loading analysis...</Text>
          ) : analysis ? (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* 1) Hero section */}
              <StatusHero urlParam={urlParam} />

              {/* 2) Score */}
              <ScoreSection score={analysis.score} />

              {/* 3) Traffic */}
              <TrafficOverview
                monthlyTraffic={analysis.monthlyTraffic}
                avgMonthlyClicks={analysis.avgMonthlyClicks}
              />

              {/* 4) Pourquoi le score est bas */}
              <div>
                <Title level={5}>Why is my score low?</Title>
                <ul>
                  {analysis.reasonWhyScoreLow.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* 5) Détails mots-clés */}
              <KeywordDetails details={analysis.details} />

              {/* 6) Suggestions d’amélioration */}
              <div>
                <Title level={4}>How to Improve</Title>
                <ul>
                  {analysis.improvements.map((imp, idx) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>

              {/* 7) CTA final */}
              <StatusCTA />
            </Space>
          ) : (
            <Text>Échec du chargement des données.</Text>
          )}
        </Card>
      </Content>
    </Layout>
  );
}
