// src/components/keyword-research/KeywordResearchForm.tsx
'use client';

import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import {fetchKeywords, IBrodAIKeyword} from './KeywordResearchService';

type KeywordResearchFormProps = {
  onSearchComplete: (keywords: IBrodAIKeyword[]) => void;
  onLoadingChange: (isLoading: boolean) => void;
};

export default function KeywordResearchForm({
  onSearchComplete,
  onLoadingChange,
}: KeywordResearchFormProps) {
  const [mainKeyword, setMainKeyword] = useState('');

  const handleResearch = async () => {
    if (!mainKeyword.trim()) {
      message.warning('Please enter a main keyword.');
      return;
    }

    onLoadingChange(true);
    try {
      const result = await fetchKeywords(mainKeyword);
      onSearchComplete(result);
    } catch (error: any) {
      message.error(error.message || 'Error fetching keywords');
      onSearchComplete([]);
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', maxWidth: 400, margin: '0 auto' }}>
      <Input
        placeholder="Enter main keyword"
        value={mainKeyword}
        onChange={(e) => setMainKeyword(e.target.value)}
      />
      <Button type="primary" onClick={handleResearch}>
        Find Keywords
      </Button>
    </div>
  );
}
