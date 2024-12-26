// components/articles/ArticlesCTA.tsx
'use client';

import React from 'react';
import { Button, Divider, Typography } from 'antd';
import Link from 'next/link';

const { Paragraph } = Typography;

export default function ArticlesCTA() {
  return (
    <div>
      <Divider />
      <Paragraph>
        Page optimization et fonctionnalités IA avancées sont uniquement disponibles 
        via notre équipe commerciale. Réservez un démo pour en savoir plus !
      </Paragraph>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button type="primary" size="large">
          Book a Demo
        </Button>
        <Link href="/status">
          <Button type="default" size="large">
            Back to Status
          </Button>
        </Link>
      </div>
    </div>
  );
}
