'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* 
        Same gradient as Hero: from-[#ede9fe] to-[#f3e8ff] 
        No border, so it flows seamlessly into the Hero background.
      */}
      <header className="w-full bg-gradient-to-r from-[#e0ecff] to-[#f0f4ff]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            BrodAI
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/#pricing" className="hover:opacity-80 transition-opacity">
              Pricing
            </Link>
            <Link href="/keyword-researcher" className="hover:opacity-80 transition-opacity">
              Keyword Researcher
            </Link>
            {/* Example: Hard gradient button */}
            <Link href="https://calendly.com/yassirhanafi17/30min">
              <span className="hard-gradient-button px-4 py-2 rounded-lg font-semibold cursor-pointer text-white">
                Book a Demo
              </span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <CloseOutlined className="text-2xl" />
              ) : (
                <MenuOutlined className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-r from-[#ede9fe] to-[#f3e8ff] px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/pricing"
                className="hover:opacity-80 transition-opacity text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link href="#book-demo" onClick={() => setIsMenuOpen(false)}>
                <span className="hard-gradient-button px-4 py-2 rounded-lg font-semibold inline-block text-center text-white">
                  Book a Demo
                </span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hard gradient button animation */}
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
      `}</style>
    </>
  );
}
