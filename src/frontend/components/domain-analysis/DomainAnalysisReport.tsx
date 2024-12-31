'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Progress } from 'antd';
import { useRouter } from 'next/navigation'; // or "next/router" if using Next 12
// If you're on Next 12 or below, import Link from 'next/link'

interface ITopKeyword {
  keyword: string;
  position: number;
  volume: number;
}

interface IAnalysisData {
  monthlyTraffic?: number;
  scoreNumeric?: number;       // 0-100
  performanceRating?: string;  // e.g. "Needs Improvement", "Good", etc.
  topKeywords?: ITopKeyword[];
  nextSteps?: string[];
  error?: string;
}

type DomainAnalysisReportProps = {
  domain: string;
  analysisData: IAnalysisData | null;
};

export default function DomainAnalysisReport({
  domain,
  analysisData,
}: DomainAnalysisReportProps) {
  // State to toggle the "Next Steps" section
  const [showNextSteps, setShowNextSteps] = useState(false);

  // Next.js navigation hook (Next 13+), or use Link if you prefer
  const router = useRouter();

  if (!analysisData) return null;

  // If there's an error, display it
  if (analysisData.error) {
    return (
      <Card
        style={{ textAlign: 'left', background: '#f9fafb', marginTop: 16 }}
      >
        <p style={{ color: 'red', fontWeight: 600 }}>
          Error: {analysisData.error}
        </p>
      </Card>
    );
  }

  // Prepare the table columns for the best performing keywords
  const columns = [
    { title: 'Keyword', dataIndex: 'keyword', key: 'keyword' },
    { title: 'Position', dataIndex: 'position', key: 'position' },
    { title: 'Volume', dataIndex: 'volume', key: 'volume' },
  ];

  return (
    <div style={{ marginTop: 16 }}>
      {/* 1) SEO Score Card */}
      <Card
        style={{
          textAlign: 'left',
          background: '#f9fafb',
          marginBottom: 16,
        }}
        bordered={false}
      >
        <p
          style={{
            fontWeight: 600,
            marginBottom: 16,
            textAlign: 'center',
            fontSize: '1.25rem',
          }}
        >
          SEO Score for <span style={{ color: '#2563EB' }}>{domain}</span>
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

        {/* Toggleable Next Steps if you want them under the score */}
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

      {/* 2) Domain Metrics (Monthly Traffic) */}
      <Card
        style={{ textAlign: 'left', background: '#f9fafb', marginBottom: 16 }}
        bordered={false}
      >
        <p
          style={{
            fontWeight: 600,
            marginBottom: 16,
            textAlign: 'center',
            fontSize: '1.25rem',
          }}
        >
          Domain Metrics
        </p>
        <div
          style={{
            background: '#fff',
            borderLeft: '4px solid #2563EB',
            padding: 12,
            marginBottom: 16,
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Monthly Traffic:</strong>{' '}
            {analysisData.monthlyTraffic ?? 0}
          </p>
        </div>
      </Card>

      {/* 3) Best Performing Keywords */}
      {analysisData.topKeywords && analysisData.topKeywords.length > 0 && (
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
            Best Performing Keywords
          </p>
          <Table
            columns={columns}
            dataSource={analysisData.topKeywords.map((kw, idx) => ({
              key: idx,
              ...kw,
            }))}
            pagination={false}
            style={{ marginBottom: 16 }}
          />
        </Card>
      )}

      {/* 4) Button to Navigate to Keyword Research Page */}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button
          onClick={() => router.push('/keyword-research')}
          style={{
            backgroundColor: '#059669',
            borderColor: '#059669',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          See New Keywords Found by Our Intelligent Agent
        </Button>
      </div>
    </div>
  );
}
