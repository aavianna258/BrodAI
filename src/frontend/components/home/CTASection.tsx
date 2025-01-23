'use client';

import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section
      id="book-demo"
      className="w-full bg-gradient-to-r from-[#e0ecff] to-[#f0f4ff] py-16 px-4 text-center"
    >
      <motion.div
        className="max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl font-bold mb-4 text-indigo-700">
          We Make SEO Affordable for Everyone
        </h3>
        <p className="text-gray-700 max-w-xl mx-auto mb-6">
          BrodAI does the same work as SEO freelancers for a fraction of the cost.
          We research keywords, create content, and optimize your site so you don’t
          have to learn SEO. Our solution is up to 70 times cheaper than hiring
          an expert.
        </p>
        <button
          className="
            px-6 py-3
            bg-indigo-600
            text-white
            font-semibold
            rounded-full
            hover:bg-indigo-700
            transition-colors
          "
        >
          Try BrodAI for Free
        </button>
      </motion.div>
    </section>
  );
}
