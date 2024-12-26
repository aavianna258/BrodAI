// app/layout.tsx
"use clients";


import 'antd/dist/reset.css';


import './globals.css';

import { ReactNode } from 'react';

import NavBar from '@/components/globals/NavBar'; // The NavBar from above
import AppFooter from '@/components/globals/AppFooter';


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <NavBar />
        {children}
        {/* You can add a global footer here if you wish */}
        <AppFooter />
      </body>
    </html>
  );
}
