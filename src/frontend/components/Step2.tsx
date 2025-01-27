'use client';

import React from 'react';
import { Button, Spin } from 'antd';

type Step2Props = {
  loading: boolean;
  step: number;
  setStep: (s: number) => void;
};

export default function Step2({ loading, step, setStep }: Step2Props) {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      {loading && <Spin />}

      <h2>Shopify Configuration 🛍️ (Step 2 if needed)</h2>
      <p>Now that your content is ready, let's configure your Shopify blog details.</p>
      {/* ... ou on laisse vide si plus besoin ... */}
      <Button onClick={() => setStep(1)}>⬅️ Back</Button>
    </div>
  );
}
