// components/NavBar.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

export default function NavBar() {
  // Optional: You can highlight the currently active menu item with `usePathname()`
  const pathname = usePathname();

  // Create your menu items array
  const menuItems = [
    {
      key: 'home',
      label: <Link href="/">Home</Link>,
    },
    {
      key: 'status',
      label: <Link href="/status?url=your-website.com">Status</Link>,
    },
    {
      key: 'articles',
      label: <Link href="/articles">Articles</Link>,
    },
  ];

  // Determine which key should be highlighted
  let selectedKey: string = 'home';
  if (pathname?.startsWith('/status')) selectedKey = 'status';
  if (pathname?.startsWith('/articles')) selectedKey = 'articles';

  return (
    <Header style={{ backgroundColor: '#fff', boxShadow: '0 2px 8px #f0f1f2' }}>
      <Menu
        mode="horizontal"
        selectedKeys={[selectedKey]}
        style={{ borderBottom: 'none' }}
        items={menuItems}
      />
    </Header>
  );
}
