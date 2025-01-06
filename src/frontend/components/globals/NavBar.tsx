// components/NavBar.tsx
'use client';

import React from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import Link from 'next/link';

const { Header } = Layout;
const { Title } = Typography;

export default function NavBar() {
  const accentColor = '#3B82F6'; // Change if you want a different accent color

  // Navigation items for the center of the nav
  const navItems = [
    { key: 'pricing', label: <Link href="#">Pricing</Link> },
    { key: 'features', label: <Link href="#">Features</Link> },
    { key: 'faq', label: <Link href="#">FAQ</Link> },
  ];

  return (
    <Header
      style={{
        backgroundColor: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 64,
      }}
    >
      {/* Left: Logo / Brand */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Replace with your real logo, e.g. <Image /> or <img /> */}
        <div
          style={{
            width: 32,
            height: 32,
            backgroundColor: accentColor,
            borderRadius: '50%',
            marginRight: 8,
          }}
        />
        <Title level={4} style={{ margin: 0 }}>
          BrodAI
        </Title>
      </div>

      {/* Center: Menu items */}
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[]}
        style={{ borderBottom: 'none' }}
        items={navItems}
      />

      {/* Right: Sign In + Book a Demo */}
      <div style={{ display: 'flex', gap: 16 }}>
        <Button type="text" style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
          Sign In
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: accentColor, borderColor: accentColor }}
        >
          Book A Demo
        </Button>
      </div>
    </Header>
  );
}
