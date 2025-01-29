import React from 'react';
import { motion } from 'framer-motion';
import { Button } from 'antd';

type CTASectionProps = {
  domain: string;
};

export default function CTASection({ domain }: CTASectionProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={itemVariants}
      style={{
        textAlign: 'center',
        marginBottom: 32,
      }}
    >
      {/* Heading */}
      <h2
        style={{
          color: '#2563EB',
          marginBottom: 16,
          fontSize: '2rem',
          fontWeight: 'bold',
        }}
      >
        Run BrodAI on Your Store
      </h2>

      {/* Two CTAs side by side */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Button
          type="primary"
          size="large"
          style={{
            backgroundColor: '#2563EB',
            borderColor: '#2563EB',
            fontWeight: 'bold',
          }}
        >
          Let BrodAI Handle Everything
        </Button>

        <Button
          size="large"
          style={{
            borderColor: '#2563EB',
            color: '#2563EB',
            fontWeight: 'bold',
          }}
        >
          Customize with BrodAI
        </Button>
      </div>
    </motion.div>
  );
}
