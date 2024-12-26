// components/status/StatusCTA.tsx
'use client';

import React from 'react';
import { Divider, Typography, Button } from 'antd';
import Link from 'next/link';

const { Paragraph } = Typography;

export default function StatusCTA() {
  return (
    <div style={{ marginTop: 24 }}>
      <Divider />
      <Paragraph>
        **Laissez nos solutions IA augmenter votre taux de conversion et booster votre 
        positionnement Google. Transformez votre trafic en clients dès maintenant !**
      </Paragraph>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Link href="/articles">
          <Button type="primary" size="large">
            Try for Free
          </Button>
        </Link>

        <Button
          type="default"
          size="large"
          onClick={() => alert('Redirection vers Calendly, etc.')}
        >
          Book a Consultation
        </Button>
      </div>
    </div>
  );
}
