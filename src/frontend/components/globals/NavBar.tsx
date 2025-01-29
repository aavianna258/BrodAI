'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    // TODO: Replace with your actual sign-out logic
    alert('Signing out...');
  };

  return (
    <>
      <header className="w-full bg-gradient-to-r from-[#fffff] to-[#f3e8ff]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            BrodAI
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {/* Keyword Researcher */}
            <Link href="/keyword-research" className="hover:opacity-80 transition-opacity">
              Keyword Researcher
            </Link>

            {/* Link Builder */}
            <Link href="/link-builder" className="hover:opacity-80 transition-opacity">
              Link Builder
            </Link>

            {/* My Profile (emoji) => on click sign out */}
            <button
              onClick={handleSignOut}
              className="hover:opacity-80 transition-opacity text-gray-800 flex items-center gap-1"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              👤 BerberHouse Profile
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
              style={{ background: 'none', border: 'none' }}
            >
              {isMenuOpen ? (
                <CloseOutlined className="text-xl" />
              ) : (
                <MenuOutlined className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-r from-[#ede9fe] to-[#f3e8ff] px-4 py-3">
            <nav className="flex flex-col space-y-3 text-sm">
              <Link
                href="/keyword-research"
                className="hover:opacity-80 transition-opacity text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Keyword Researcher
              </Link>
              <Link
                href="/link-builder"
                className="hover:opacity-80 transition-opacity text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Link Builder
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="hover:opacity-80 transition-opacity text-left text-gray-800 flex items-center gap-1"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                👤 My Profile
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hard gradient button animation (retained if needed) */}
      <style jsx>{`
        @keyframes hardGradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .hard-gradient-button {
          background: linear-gradient(
            90deg,
            #ec4899,
            #f59e0b
          );
          background-size: 200% 200%;
          animation: hardGradientShift 3s ease infinite;
        }

        /* Responsive classes if you're simulating Tailwind breakpoints */
        @media (min-width: 768px) {
          .md\\:flex {
            display: flex !important;
          }
          .md\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
