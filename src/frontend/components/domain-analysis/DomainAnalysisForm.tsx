'use client';

import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import fetchDomainAnalysis from './fetchDomainAnalysis';


type DomainAnalysisFormProps = {
  onAnalysisComplete: (analysisData: any) => void;
  onLoadingChange: (loading: boolean) => void;
};


export default function DomainAnalysisForm({
  onAnalysisComplete,
  onLoadingChange,
}: DomainAnalysisFormProps) {
  const [domain, setDomain] = useState('');

  const handleDomainAnalyze = async () => {
    if (!domain.trim()) {
      message.warning('Please enter a valid domain.');
      return;
    }

    onLoadingChange(true);
    try {
      const analysisResult = await fetchDomainAnalysis(domain);
      onAnalysisComplete(analysisResult);
    } catch (error: any) {
      message.error(error.message || 'Error analyzing domain');
      onAnalysisComplete({ error: error.message });
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', maxWidth: 400, margin: '0 auto' }}>
      <Input
        placeholder="example.com"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <Button type="primary" onClick={handleDomainAnalyze}>
        Analyze your website
      </Button>
    </div>
  );
}
