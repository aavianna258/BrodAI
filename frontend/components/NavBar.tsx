// NavBar.tsx (new code) using the `items` prop
'use client';

import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header } = Layout;

export default function NavBar() {
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link href="/">Home</Link>,
    },
    {
      key: 'keyword',
      icon: <SearchOutlined />,
      label: <Link href="/keyword-researcher">Keyword Researcher</Link>,
    },
  ];

  return (
    <Header>
      <div style={{ float: 'left', color: '#fff', fontWeight: 'bold', marginRight: '20px' }}>
        BrodAI - AI SEO Agent
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['home']}
        items={menuItems}
      />
    </Header>
  );
}
