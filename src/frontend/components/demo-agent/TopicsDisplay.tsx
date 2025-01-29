// src/components/demo-agent/TopicsDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface TopicItem {
  title: string;
  detail: string;
}

type TopicsDisplayProps = {
  domain: string;
  topics: TopicItem[];
};

export default function TopicsDisplay({ domain, topics }: TopicsDisplayProps) {
  // Variants pour le parent qui "gère" le timing global
  const parentVariants = {
    hidden: {}, // État "fermé" (pas forcément d'animation ici)
    visible: {
      transition: {
        // Décale l'apparition des éléments enfants
        // Ajustez la valeur pour le rythme souhaité
        staggerChildren: 0.2,
      },
    },
  };

  // Variants pour chaque élément enfant (heading, container, etc.)
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      // Le parent contrôle la séquence d’apparition
      variants={parentVariants}
      initial="hidden"
      animate="visible"
      // On peut aussi appliquer un style global ici
      style={{ marginBottom: 32 }}
    >
      {/* Heading #1 */}
      <motion.h2
        variants={itemVariants}
        style={{ 
            color: '#059669',
             marginBottom: 16,
             fontSize : "2rem",
             fontWeight : 'bold',
             textAlign:'center'
            }}
      >
        High-Potential Topics for your website
      </motion.h2>

      {/* Container #1 */}
      <motion.div
        variants={itemVariants}
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: 24,
          marginBottom: 32,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ marginBottom: 16, color: '#333' }}>
          <strong>BrodAI</strong> scoured your niche to uncover these “easy-win” topics—each with 
          promising search volume and low competition. Meanwhile, we seamlessly 
          integrate rich media, build strategic backlinks, and optimize every 
          detail so search engines can’t help but fall in love with your site!
        </p>
        <ul style={{ marginLeft: 20 }}>
          {topics.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 12 }}>
              <strong style={{ color: '#2563EB' }}>{item.title}</strong> —{' '}
              {item.detail}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* insert a second example if you want  */}

    </motion.div>
  );
}
