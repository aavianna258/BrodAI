// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '../components/globals/NavBar';
import Footer from '../components/globals/AppFooter';
import '@ant-design/v5-patch-for-react-19';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BrodAI - Bulk SEO for E-commerce',
  description: 'BrodAI helps e-commerce stores optimize product listings in bulk using AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body
        style={{
          margin: 0,
          padding: 0,
          background: '#f8f9ff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          // No background color/animation—just default or from global CSS
        }}
      >
        {/* NavBar */}
        <Navbar />

        {/* Main content area */}
        <main style={{ flex: '1 0 auto' }}>
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
