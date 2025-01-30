'use client';

import React, { useState } from 'react';
import { Input, Button, message, Space } from 'antd';
import TopicsDisplay from './TopicsDisplay'; // adapte le chemin d'import

interface TopicItem {
  title: string;
  detail: string;
}

export default function TopicsManager() {
  // État pour stocker les infos du mot-clé
  const [keyword, setKeyword] = useState('');
  const [traffic, setTraffic] = useState<number>(1000);
  const [difficulty, setDifficulty] = useState<string>('40');
  const [performanceScore, setPerformanceScore] = useState<number>(0);

  // État pour les Topics reçus après l’appel au backend
  const [topics, setTopics] = useState<TopicItem[]>([]);

  // Handler qui appelle la route /Keywords-to-topics
  const handleGenerateTopics = async () => {
    if (!keyword.trim()) {
      message.warning('Please enter a keyword');
      return;
    }

    try {
      const resp = await fetch('http://localhost:8000/Keywords-to-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          traffic,
          difficulty,
          performance_score: performanceScore,
        }),
      });

      if (!resp.ok) {
        throw new Error(`Fetch error: ${resp.status}`);
      }

      // GPT renvoie un JSON du type:
      // {
      //   "Application of AI in ecommerce": 
      //     "This topic has 1000 searches per month and 40 difficulty..."
      // }
      const data = await resp.json();

      // On convertit ce dict en un array de { title, detail }
      const newTopics: TopicItem[] = [];
      for (const [key, value] of Object.entries(data)) {
        newTopics.push({ title: key, detail: value as string });
      }

      setTopics(newTopics);

    } catch (error: any) {
      console.error(error);
      message.error(error.message || 'Failed to generate topics');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <h2>Generate Topics from a Keyword</h2>

      {/* Form Inputs */}
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Input
          placeholder="Keyword (e.g. ecommerce AI)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Input
          placeholder="Traffic (e.g. 1000)"
          type="number"
          value={traffic}
          onChange={(e) => setTraffic(Number(e.target.value))}
        />
        <Input
          placeholder="Difficulty (e.g. 40)"
          type="number"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        />
        <Input
          placeholder="Performance Score"
          type="number"
          value={performanceScore}
          onChange={(e) => setPerformanceScore(Number(e.target.value))}
        />
      </Space>

      <Button type="primary" onClick={handleGenerateTopics}>
        Generate Topics
      </Button>

      {/* On appelle TopicsDisplay avec le tableau topics */}
      <div style={{ marginTop: 40 }}>
        <TopicsDisplay domain="example.com" topics={topics} />
      </div>
    </div>
  );
}
