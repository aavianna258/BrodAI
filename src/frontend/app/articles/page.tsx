// app/articles/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Typography, Tag, Avatar, Button } from 'antd';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Article {
  title: string;
  keywords: string[];
  snippet: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fonction pour highlight les mots-clés
  function highlightKeywords(snippet: string, keywords: string[]) {
    let processed = snippet;
    // On trie par longueur décroissante pour éviter les collisions
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

    sortedKeywords.forEach((kw) => {
      const regex = new RegExp(kw, 'gi');
      processed = processed.replace(regex, (match) => {
        return `<span style="background-color: #ffe58f; padding: 0 4px; border-radius: 2px;">${match}</span>`;
      });
    });

    return <span dangerouslySetInnerHTML={{ __html: processed }} />;
  }

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/mockArticles');
        const json = await res.json();
        if (json.status === 200) {
          setArticles(json.data);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ margin: '24px' }}>
        <Card style={{ borderRadius: 8, padding: 24 }}>
          <Title level={3}>Articles pour booster votre visibilité</Title>
          <Paragraph type="secondary">
            Découvrez ces contenus optimisés pour le SEO, avec les mots-clés mis en évidence.
          </Paragraph>

          {loading ? (
            <Text>Chargement des articles...</Text>
          ) : (
            <Row gutter={[24, 24]}>
              {/* On affiche chaque article dans une <Col> */}
              {articles.map((article, index) => (
                <Col xs={24} md={12} key={index}>
                  <Card style={{ borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <Avatar style={{ backgroundColor: '#87d068', marginRight: 8 }}>
                        AI
                      </Avatar>
                      <Title level={4} style={{ margin: 0 }}>
                        {article.title}
                      </Title>
                    </div>

                    {/* Mots-clés sous forme de tags */}
                    <div style={{ marginBottom: 12 }}>
                      {article.keywords.map((kw, idx) => (
                        <Tag color="blue" key={idx} style={{ marginBottom: 4 }}>
                          {kw}
                        </Tag>
                      ))}
                    </div>

                    {/* Snippet avec highlight */}
                    <Paragraph style={{ fontSize: '1rem', whiteSpace: 'pre-line' }}>
                      {highlightKeywords(article.snippet, article.keywords)}
                    </Paragraph>

                    <Button type="link" style={{ paddingLeft: 0 }}>
                      Lire la suite
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <div style={{ marginTop: 32 }}>
            <Paragraph>
              Pour aller plus loin, nos équipes peuvent optimiser votre site en profondeur.
            </Paragraph>
            <Button type="primary" size="large">
              Book a Demo
            </Button>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
