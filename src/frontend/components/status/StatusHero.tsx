// components/status/StatusHero.tsx
'use client';

import React from 'react';
import { Typography, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

interface StatusHeroProps {
  urlParam: string;
}

export default function StatusHero({ urlParam }: StatusHeroProps) {
  return (
    <>
      <Title level={3} style={{ marginBottom: 0 }}>
        Website Analysis for{' '}
        <Text code style={{ fontSize: '1.2rem' }}>
          {urlParam}
        </Text>
      </Title>
      <Paragraph type="secondary" style={{ marginTop: 8 }}>
        Découvrez la performance de votre site et comment augmenter votre trafic.
      </Paragraph>
      <Divider />
    </>
  );
}
