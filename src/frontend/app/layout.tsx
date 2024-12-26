// app/layout.tsx
"use clients";




import 'antd/dist/reset.css';


import './globals.css';

import type { Metadata } from 'next';
import { ReactNode } from 'react';

import NavBar from '@/components/NavBar'; // The NavBar from above



export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <NavBar />
        {children}
        {/* You can add a global footer here if you wish */}
      </body>
    </html>
  );
}
