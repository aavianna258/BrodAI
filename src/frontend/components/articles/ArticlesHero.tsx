// components/articles/ArticlesHero.tsx
'use client';

import React from 'react';
import { Typography, Divider } from 'antd';

const { Title, Paragraph } = Typography;

export default function ArticlesHero() {
  return (
    <>
      <Title level={3} style={{ marginBottom: 0 }}>
        Boost Your Traffic with AI Articles
      </Title>
      <Paragraph type="secondary" style={{ marginTop: 8 }}>
        Voici des articles générés par l’IA pour améliorer votre classement SEO. 
        Les mots clés cibles sont mis en évidence.
      </Paragraph>
      <Divider />
    </>
  );
}
