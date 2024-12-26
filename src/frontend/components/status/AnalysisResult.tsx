// components/status/AnalysisResult.tsx
'use client';

import React from 'react';
import { Space } from 'antd';
import OverallScoreCard from './OverallScoreCard';
import DetailedReport from './DetailedReport';
import ImprovementsSection from './ImprovementsSection';
import BlogPostsSection from './BlogPostsSection';

interface DetailedKeyword {
  keyword: string;
  currentPosition: number;
  potentialTraffic: number;
  competitionLevel: string;
}

interface ImprovementKeyword {
  keyword: string;
  reason: string;
}

interface BlogPost {
  title: string;
  snippet: string;
}

interface AnalysisData {
  scoreNumeric: number;
  scoreLetter: string;
  performanceRating: string;
  nextSteps: string[];
  curatedKeywords: string[];
  blogPosts: { title: string; snippet: string }[];
  detailedKeywords: DetailedKeyword[];
  improvementKeywords: ImprovementKeyword[];
}

interface AnalysisResultProps {
  analysis: AnalysisData;
  accentColor?: string;
}

export default function AnalysisResult({ analysis, accentColor }: AnalysisResultProps) {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <OverallScoreCard
        performanceRating={analysis.performanceRating}
        nextSteps={analysis.nextSteps}
        scoreNumeric={analysis.scoreNumeric}
        accentColor={accentColor}
      />



      {/* 1) Detailed Report */}
      <DetailedReport
        detailedKeywords={analysis.detailedKeywords}
        accentColor={accentColor}
      />

      {/* 2) How to Improve Section */}
      <ImprovementsSection
        improvementKeywords={analysis.improvementKeywords}
        accentColor={accentColor}
      />

      {/* 3) Blog Posts Section (the new AI article suggestions) */}
      <BlogPostsSection
        blogPosts={analysis.blogPosts}
        accentColor={accentColor}
      />
    </Space>
  );
}
