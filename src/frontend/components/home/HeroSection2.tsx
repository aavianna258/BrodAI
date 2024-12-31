'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaSpinner } from 'react-icons/fa';

export default function HeroSection() {
  const [storeUrl, setStoreUrl] = useState('');
  const [isRunning, setIsRunning] = useState(false);    // If user has clicked "GO"
  const [isLoading, setIsLoading] = useState(false);    // Spinner state
  const [showKeywords, setShowKeywords] = useState(false);
  const [showBlogSnippet, setShowBlogSnippet] = useState(false);

  // Example keywords + blog snippet (mock/fake data)
  const keywords = [
    'Moroccan rugs',
    'Berber carpets',
    'Handmade Moroccan décor',
  ];
  const blogSnippet = `
    Morocco has a rich tradition of creating handwoven rugs,
    known for their vibrant colors and intricate patterns.
    Each piece tells a story...
  `;

  const handleAnalyze = () => {
    // Don’t run if no URL
    if (!storeUrl) return;
    setIsRunning(true);
    setIsLoading(true);

    // Simulate short "thinking" time
    setTimeout(() => {
      setIsLoading(false);
      setShowKeywords(true);
    }, 2000);
  };

  const handleGenerateBlogPost = () => {
    setShowBlogSnippet(true);
  };

  return (
    <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16 px-4 text-center">
      <div className="max-w-2xl mx-auto mb-8">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-purple-600 mb-4"
        >
          AI Marketing Agency
        </motion.h1>

        {/* Typing subheading */}
        <div className="text-gray-700 text-xl sm:text-2xl h-8 mb-6">
          <TypeAnimation
            sequence={[
              'Starting with SEO to get you more visitors from Google',
              2500,
              'Less guesswork, more conversions',
              2000,
              'Automate your site’s growth using AI',
              2000,
            ]}
            speed={50}
            deletionSpeed={35}
            repeat={Infinity}
          />
        </div>

        {/* User URL Input and "GO" */}
        {!isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-row w-full max-w-md mx-auto bg-white rounded-full shadow-lg overflow-hidden"
          >
            <input
              type="text"
              placeholder="example.com"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              className="w-full px-4 py-2 text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all"
            />
            <button
              onClick={handleAnalyze}
              className="px-6 py-2 bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
            >
              GO
            </button>
          </motion.div>
        )}
      </div>

      {/* Once user clicks "GO," show the analysis steps below */}
      {isRunning && (
        <div className="max-w-xl mx-auto mt-4">
          {/* Spinner while "thinking" */}
          {isLoading && (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="mx-auto text-purple-600 mb-2 w-8 h-8"
            >
              <FaSpinner size={30} />
            </motion.div>
          )}

          {/* Show the analysis (fake data) once loading is done */}
          {!isLoading && showKeywords && (
            <div className="mt-4 text-left bg-gray-50 p-4 rounded-md shadow">
              <p className="font-semibold mb-2 text-center">
                Top Keywords Found for{' '}
                <span className="text-indigo-600">{storeUrl}</span>:
              </p>
              <div className="space-y-2">
                {keywords.map((keyword, index) => (
                  <AnimatePresence key={keyword}>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.4 }}
                      className="bg-white border-l-4 border-purple-500 p-2 shadow-sm"
                    >
                      {keyword}
                    </motion.div>
                  </AnimatePresence>
                ))}
              </div>

              {/* "Generate Blog Post" button */}
              {!showBlogSnippet && (
                <div className="text-center mt-4">
                  <button
                    onClick={handleGenerateBlogPost}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Generate Blog Post
                  </button>
                </div>
              )}

              {/* Partial blog snippet + CTA */}
              {showBlogSnippet && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 p-4 bg-white border shadow-sm rounded-md"
                >
                  <h3 className="font-semibold mb-2 text-indigo-600 text-center">
                    Blog Post Preview
                  </h3>
                  <p className="text-gray-700">
                    {blogSnippet.trim()}
                    <span className="font-bold text-gray-400"> ...</span>
                  </p>
                  <div className="mt-4 bg-indigo-50 p-4 rounded-md text-center">
                    <p className="font-bold text-indigo-700 mb-2">
                      SEO Done With One Click
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      No need to hire freelancers or spend days optimizing.
                    </p>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Try BrodAI on Your E-Commerce
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
