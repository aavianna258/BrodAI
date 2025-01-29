'use client'; // Si vous êtes en Next.js 13+ dans /app

import React from 'react';
import { Carousel } from 'antd';
import { motion } from 'framer-motion';

interface ArticleItem {
  title: string;
  preview: string;
  query: string; // <-- new field for the concerned keyword
}

type ArticlesCarouselProps = {
  articles: ArticleItem[];
};

export default function ArticlesCarousel({ articles }: ArticlesCarouselProps) {
  // Variants pour orchestrer l'animation de tous les éléments
  const parentVariants = {
    hidden: {},
    visible: {
      transition: {
        // Décalage entre les enfants
        staggerChildren: 0.2,
      },
    },
  };

  // Variants pour chaque élément (heading, container, etc.)
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      // Le conteneur parent qui gère la séquence
      variants={parentVariants}
      initial="hidden"
      animate="visible"
      style={{ marginBottom: 32 }}
    >
      {/* Heading à l'extérieur du container */}
      <motion.h2
        variants={itemVariants}
        style={{ 
            color: '#ff5200',
            marginBottom: 16,
            fontSize : "2rem",
            fontWeight : 'bold',
            textAlign:'center'
           }}
      >
        BrodAI’s Ready-to-Publish Articles
      </motion.h2>

      {/* Container animé : articles + carousel */}
      <motion.div
        variants={itemVariants}
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ marginBottom: 16, color: '#333', fontSize: '1rem' }}>
          Each article is structured with the proper HTML tags, on-page SEO, 
          and built-in <strong>rich media</strong> and <strong>backlink building</strong> 
          so Google can’t resist ranking it!
        </p>

        <Carousel autoplay style={{ marginBottom: 16 }}>
          {articles.map((article, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'center' }}>
              {/* Semantic HTML for each article */}
              <article
                style={{
                  margin: '0 auto',
                  maxWidth: 600,
                  textAlign: 'left',
                  minHeight: 250,
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                  padding: 16,
                  background: '#fafafa',
                }}
              >
                <header>
                  <h3 style={{ marginBottom: 8, color: '#2563EB' }}>
                    {article.title}
                  </h3>
                </header>

                <section>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                    {article.preview}
                  </p>
                </section>

                <footer style={{ marginTop: 16 }}>
                  <p style={{ marginBottom: 4 }}>
                    <strong>Primary Query:</strong> {article.query}
                  </p>
                  <p style={{ color: '#059669', fontWeight: 'bold' }}>
                    High Probability to Rank on Page 1 within 2 Weeks!
                  </p>
                </footer>
              </article>
            </div>
          ))}
        </Carousel>

        <p style={{ color: '#333', fontSize: '1rem', marginBottom: 0 }}>
          Ready to publish and start attracting new visitors?
        </p>
      </motion.div>
    </motion.div>
  );
}
