"use client";

import React, { useState } from "react";
import { Row, Col, Input, Button, Spin, message, Table } from "antd";
import { motion } from "framer-motion";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { fetchKeywords, IBrodAIKeyword } from "@/components/backendEndpoints";
import MainSection from "@/components/MainSection";
// Import fonts for Material UI components
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function KeywordResearchPage() {
    const [mainKeyword, setMainKeyword] = useState("");
    const [domain, setDomain] = useState("");
    const [loading, setLoading] = useState(false);
    const [keywords, setKeywords] = useState<IBrodAIKeyword[]>([]);

    const router = useRouter();

    const spinnerIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />;

    // Existing handler for the table
    const handleSearch = async () => {
        if (!mainKeyword.trim()) {
            message.warning("Please enter a valid domain.");
            return;
        }
        setLoading(true);
        setKeywords([]);
        try {
            const data = await fetchKeywords(mainKeyword);
            setKeywords(data);
        } catch (error: any) {
            message.error(error.message || "Error fetching domain");
        } finally {
            setLoading(false);
        }
    };

    function handleWriteArticle(keyword: string) {
        // Redirect to /create-article with the selected keyword
        router.push(`/create-article?keyword=${encodeURIComponent(keyword)}`);
    }

    // Existing columns definition
    const columns = [
        { title: "Keyword", dataIndex: "keyword", key: "keyword" },
        { title: "Traffic", dataIndex: "traffic", key: "traffic" },
        { title: "Difficulty", dataIndex: "difficulty", key: "difficulty" },
        {
            title: "Perf. Score",
            dataIndex: "performance_score",
            key: "performance_score",
        },
        {
            title: "Actions",
            key: "actions",
            render: (text: any, record: IBrodAIKeyword) => (
                <Button
                    type="primary"
                    onClick={() => handleWriteArticle(record.keyword)}
                >
                    Write an article
                </Button>
            ),
        },
    ];

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
        <div
            style={{
                padding: "60px 20px",
                textAlign: "center",
                minHeight: "70vh",
                background: "linear-gradient(90deg, #e0ecff 0%, #f0f4ff 100%)",
            }}
        >
            <MainSection />
            {/* 
        2) EXISTING DOMAIN INPUT FOR KEYWORD SEARCH
      */}
            <>
                <Row justify="center" style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={20} md={14} lg={12}>
                        <Input
                            placeholder="Enter your domain"
                            value={mainKeyword}
                            onChange={(e) => setMainKeyword(e.target.value)}
                            style={{ maxWidth: 400, marginRight: 8 }}
                        />
                        <Button type="primary" onClick={handleSearch}>
                            Search
                        </Button>
                    </Col>
                </Row>
            </>

            {/* Loader */}
            {loading && (
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                    }}
                    style={{
                        margin: "0 auto",
                        width: "50px",
                        height: "50px",
                        color: "#2563EB",
                    }}
                >
                    <Spin indicator={spinnerIcon} />
                </motion.div>
            )}

            {/* Results Table */}
            {!loading && keywords.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        background: "#f9fafb",
                        textAlign: "left",
                        padding: "16px",
                        borderRadius: "8px",
                    }}
                >
                    <h3
                        style={{
                            textAlign: "center",
                            fontWeight: 600,
                            marginBottom: 16,
                        }}
                    >
                        Top Keywords Related to "{mainKeyword}"
                    </h3>
                    <Table
                        columns={columns}
                        dataSource={keywords.map((item, idx) => ({
                            key: idx,
                            ...item,
                        }))}
                        pagination={false}
                    />
                </motion.div>
            )}

            {/*
        3) REMOVED “Experience Our Powerful Keyword Research Agent” section entirely 
        (the big motion.div with the free trial info).
      */}

            {/* 
        4) "How It Works" SECTION (only first 2 steps), placed AFTER the table
      */}
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
}
