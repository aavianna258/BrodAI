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
    <html lang="en">
      <body className={inter.className}>
        {/* Nav is transparent; Hero will define the gradient. */}
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
