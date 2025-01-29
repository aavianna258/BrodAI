import React from 'react';
import { Input, Button } from 'antd';

type DomainInputProps = {
  domain: string;
  setDomain: (value: string) => void;
  onAnalyze: () => void;
};

export default function DomainInputSection({
  domain,
  setDomain,
  onAnalyze,
}: DomainInputProps) {
  return (
    <div
      style={{
        maxWidth: 500,
        margin: '0 auto',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
      }}
    >
      <Input
        placeholder="Enter your domain..."
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        style={{
          flex: 1,
          height: '3rem',
          fontSize: '1rem',
          borderRadius: 8,
        }}
      />
      <Button
        type="primary"
        style={{
          backgroundColor: '#2563EB',
          borderColor: '#2563EB',
          fontWeight: 'bold',
          height: '3rem',
          borderRadius: 8,
        }}
        onClick={onAnalyze}
      >
        Analyze
      </Button>
    </div>
  );
}
