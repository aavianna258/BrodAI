
import './globals.css';
import 'antd/dist/reset.css';
import type { Metadata } from 'next';
import NavBar from '../components/NavBar';
import React from 'react';

export const metadata: Metadata = {
  title: 'My SEO Tool',
  description: 'Example Next.js 13 + Ant Design App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {/* Our NavBar always at the top */}
        <NavBar />

        {/* Main content area with zero padding/margin to allow full-width sections */}
        <div style={{ margin: 0, padding: 0 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
