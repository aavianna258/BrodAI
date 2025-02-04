import { motion } from "framer-motion";
import React from "react";

const OverviewSection = () => {
    // ADDED: We only use the first 2 steps for "How It Works."
    const miniSteps = [
        {
            text: "Daily SEO Audits & Automatic Error Fixes",
        },
        {
            text: "Research Trending Keywords & Create Fresh Content",
        },
    ];

    // Step animation variants
    const stepVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.4,
            },
        }),
    };
    return (
        <div>
            {/* 4) "How It Works" SECTION (only first 2 steps), placed AFTER the table */}
            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    fontSize: "1.15rem",
                    fontWeight: "bold",
                    marginTop: 40,
                    marginBottom: "1rem",
                    color: "#333",
                }}
            >
                How It Works
            </motion.h3>

            <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
                {miniSteps.map((step, i) => (
                    <motion.div
                        key={step.text}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={stepVariants}
                        style={{
                            marginBottom: "1rem",
                            background: "#fff",
                            borderRadius: 8,
                            padding: "1rem 1.2rem",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                        }}
                    >
                        {/* Step number circle */}
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                backgroundColor: "#2563EB",
                                color: "#fff",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: "bold",
                                flexShrink: 0,
                            }}
                        >
                            {i + 1}
                        </div>

                        {/* Step text */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                            }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "1rem",
                                    lineHeight: 1.4,
                                }}
                            >
                                {step.text}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default OverviewSection;
