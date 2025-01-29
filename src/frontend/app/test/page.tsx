'use client'; // only if you need client-side interactions

import React from 'react';

// Import Inter from Google Fonts via next/font if desired
// Or directly link to Google Fonts in <head>
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function TestPage() {
  return (
    // Return a full HTML structure to avoid using the default layout.
    // If you want an absolutely separate route ignoring _app or layout, 
    // you can do so in Next.js by placing this in /pages/test.js or /app/test/page.tsx
    <html lang="en" className={inter.className}>
      <head>
        <title>BrodAI - Test Page</title>
        <meta name="description" content="A page resembling OpenAI's style for testing." />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: inter.style.fontFamily,
          backgroundColor: '#fff',
        }}
      >
        {/* Simple top nav */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>BrodAI</div>

          <nav style={{ display: 'flex', gap: '1rem', fontSize: '1rem' }}>
            <a href="#" style={{ textDecoration: 'none', color: '#333' }}>
              Research
            </a>
            <a href="#" style={{ textDecoration: 'none', color: '#333' }}>
              Products
            </a>
            <a href="#" style={{ textDecoration: 'none', color: '#333' }}>
              Safety
            </a>
            <a href="#" style={{ textDecoration: 'none', color: '#333' }}>
              Company
            </a>
          </nav>
        </header>

        {/* Main hero section */}
        <section
          style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 80px)', // fill viewport minus header
            background:
              'linear-gradient(135deg, rgba(0, 100, 255, 0.8) 0%, rgba(0, 50, 200, 0.8) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            Computer-Using Agent
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: 600, margin: '0 auto 2rem auto' }}>
            A universal interface for AI to interact with the digital world.
          </p>

          {/* Input field below the subheading */}
          <div>
            <input
              type="text"
              placeholder="Enter something..."
              style={{
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                borderRadius: 4,
                border: 'none',
                marginRight: '0.5rem',
                width: 250,
              }}
            />
            <button
              style={{
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                borderRadius: 4,
                backgroundColor: '#fff',
                color: '#000',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Submit
            </button>
          </div>
        </section>
      </body>
    </html>
  );
}
