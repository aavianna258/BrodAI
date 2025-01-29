'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Progress } from 'antd';
import { IBrodAIKeyword } from '@/components/domain-analysis/fetchKeywordResearch';

interface ITopKeyword {
  keyword: string;
  position: number;
  volume: number;
}

interface IAnalysisData {
  monthlyTraffic?: number;
  scoreNumeric?: number;       // e.g. 0-100
  performanceRating?: string;  // e.g. "Needs Improvement", "Good", etc.
  topKeywords?: ITopKeyword[]; // existing best-performing keywords from analysis
  nextSteps?: string[];
  error?: string;
}

type DomainAnalysisReportProps = {
  domain: string;
  analysisData: IAnalysisData | null;
  suggestedKeywords: IBrodAIKeyword[] | null; // from /keyword_research
};

export default function DomainAnalysisReport({
  domain,
  analysisData,
  suggestedKeywords,
}: DomainAnalysisReportProps) {
  const [showNextSteps, setShowNextSteps] = useState(false);

  if (!analysisData) return null;

  // If there's an error, display it
  if (analysisData.error) {
    return (
      <Card style={{ textAlign: 'left', background: '#f9fafb', marginTop: 16 }}>
        <p style={{ color: 'red', fontWeight: 600 }}>
          Error: {analysisData.error}
        </p>
      </Card>
    );
  }

  // --------------------------------------------------------------------------
  // 1) Card: SEO Score & Monthly Traffic
  // --------------------------------------------------------------------------
  const seoScoreCard = (
    <Card
      style={{
        textAlign: 'left',
        background: '#f9fafb',
        marginBottom: 16,
      }}
      bordered={false}
    >


      <div
        style={{
          background: '#fff',
          borderLeft: '4px solid #059669',
          padding: 12,
        }}
      >


        {/* Monthly Traffic Just Under the Score */}
        <p style={{ marginTop: 12 }}>
          <strong>Monthly Traffic:</strong>{' '}
          {analysisData.monthlyTraffic ?? 0}
        </p>

        {/* Performance Rating */}
        <p style={{ marginTop: 8 }}>
          <strong>Performance Rating:</strong>{' '}
          {analysisData.performanceRating ?? 'N/A'}
        </p>
      </div>

      {/*  Next Steps */}
      {analysisData.nextSteps && analysisData.nextSteps.length > 0 && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button
            onClick={() => setShowNextSteps(!showNextSteps)}
            style={{
              backgroundColor: '#2563EB',
              borderColor: '#2563EB',
              color: '#fff',
            }}
          >
            {showNextSteps ? 'Hide Next Steps' : 'Show Next Steps'}
          </Button>

          {showNextSteps && (
            <Card
              style={{
                textAlign: 'left',
                background: '#f9fafb',
                marginTop: 16,
              }}
              bordered={false}
            >
              <strong>Recommended Next Steps:</strong>
              <ul style={{ marginTop: 8 }}>
                {analysisData.nextSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </Card>
  );

  // --------------------------------------------------------------------------
  // 2) Table: Best Performing Keywords (if from /analysis)
  // --------------------------------------------------------------------------
  let bestPerformingKeywordsBlock = null;
  if (
    analysisData.topKeywords &&
    analysisData.topKeywords.length > 0
  ) {
    const bestKeywordsColumns = [
      { title: 'Keyword', dataIndex: 'keyword', key: 'keyword' },
      { title: 'Position', dataIndex: 'position', key: 'position' },
      { title: 'Volume', dataIndex: 'volume', key: 'volume' },
    ];

    bestPerformingKeywordsBlock = (
      <Card
        style={{ textAlign: 'left', background: '#f9fafb', marginBottom: 16 }}
        bordered={false}
      >
        <p
          style={{
            fontWeight: 600,
            marginBottom: 8,
            textAlign: 'center',
            fontSize: '1.25rem',
          }}
        >
          Best Performing Keywords (Current)
        </p>
        <Table
          columns={bestKeywordsColumns}
          dataSource={analysisData.topKeywords.map((kw, idx) => ({
            key: idx,
            ...kw,
          }))}
          pagination={false}
          style={{ marginBottom: 16 }}
        />
      </Card>
    );
  }

  // --------------------------------------------------------------------------
  // 3) Table: “Suggested Keywords to Target” (from /keyword_research)
  // --------------------------------------------------------------------------
  let suggestedKeywordsBlock = null;
  if (suggestedKeywords && suggestedKeywords.length > 0) {
    const suggestedKeywordsColumns = [
      { title: 'Keyword', dataIndex: 'keyword', key: 'keyword' },
      { title: 'Traffic', dataIndex: 'traffic', key: 'traffic' },
      { title: 'Difficulty', dataIndex: 'difficulty', key: 'difficulty' },
      {
        title: 'Perf. Score',
        dataIndex: 'performance_score',
        key: 'performance_score',
      },
    ];

    suggestedKeywordsBlock = (
      <Card
        style={{ textAlign: 'left', background: '#f9fafb', marginBottom: 16 }}
        bordered={false}
      >
        <p
          style={{
            fontWeight: 600,
            marginBottom: 8,
            textAlign: 'center',
            fontSize: '1.25rem',
          }}
        >
          Suggested Keywords to Target
        </p>
        <Table
          columns={suggestedKeywordsColumns}
          dataSource={suggestedKeywords.map((kw, idx) => ({
            key: idx,
            ...kw,
          }))}
          pagination={false}
          style={{ marginBottom: 16 }}
        />
      </Card>
    );
  }

  // --------------------------------------------------------------------------
  // Final Rendering
  // --------------------------------------------------------------------------
  return (
    <div style={{ marginTop: 16 }}>
      {seoScoreCard}

      {/* Best-Performing Keywords from SEMRush or analysis */}
      {bestPerformingKeywordsBlock}

      {/* Suggested Keywords from BrodAI's /keyword_research */}
      {suggestedKeywordsBlock}

      {/* If you want a button to go to a separate page for deeper KW research, keep it here */}
      {/* <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button onClick={() => router.push('/keyword-research')} /* or next link * />
      </div> */}
    </div>
  );
}
