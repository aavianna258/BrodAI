'use client';

import { Typography } from "antd";
import { motion } from "framer-motion";
import React from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";

const MainSection = () => {
    const [typewriterText] = useTypewriter({
        words: [
            "A 24/7 SEO Consultant...",
            "Daily Site Audits & Error Fixes...",
            "Trend Research & Fresh Content...",
            "Link Building & Publications...",
        ],
        loop: 0,
        typeSpeed: 60,
        deleteSpeed: 50,
        delaySpeed: 1200,
    });
    
    return (
        <div className="content-center text-center">
            {" "}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                style={{
                    fontSize: "2rem",
                    color: "#2563EB",
                    marginBottom: "16px",
                    fontWeight: "bold",
                }}
            >
                BrodAI:
                <span style={{ marginLeft: 8 }}>{typewriterText}</span>
                <Cursor cursorColor="#2563EB" />
            </motion.h1>
            <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                style={{
                    color: "#555",
                    marginBottom: 24,
                    fontSize: "1.15rem",
                    maxWidth: 800,
                    margin: "0 auto",
                    lineHeight: 1.5,
                }}
            >
                BrodAI is your <strong>24/7</strong> SEO consultant. Every day,
                it audits your site, fixes errors, researches{" "}
                <strong>trending keywords</strong>, and publishes new articles.
            </motion.h2>
        </div>
    );
};

export default MainSection;
