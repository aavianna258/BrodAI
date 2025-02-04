// "use client";

import React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { Box } from "@mui/material";

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
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: { xs: 14, sm: 20 },
                pb: { xs: 8, sm: 12 },
            }}
        >
            <Stack
                spacing={2}
                useFlexGap
                sx={{
                    alignItems: "center",
                    width: { xs: "100%", sm: "70%" },
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        fontSize: "clamp(3rem, 10vw, 3.5rem)",
                    }}
                >
                    BrodAI:
                    <Typography
                        component="span"
                        variant="h1"
                        sx={(theme) => ({
                            fontSize: "inherit",
                            color: "primary.main",
                            ...theme.applyStyles("dark", {
                                color: "primary.light",
                            }),
                        })}
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <span style={{ marginLeft: 8 }}>
                                {typewriterText}
                            </span>
                            <Cursor cursorColor="#2563EB" />
                        </motion.h1>
                    </Typography>
                </Typography>
                <Box
                    sx={{
                        textAlign: "center",
                        color: "text.secondary",
                        width: { sm: "100%", md: "80%" },
                    }}
                >
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
                        BrodAI is your <strong>24/7</strong> SEO consultant.
                        Every day, it audits your site, fixes errors, researches{" "}
                        <strong>trending keywords</strong>, and publishes new
                        articles.
                    </motion.h2>
                </Box>
            </Stack>
        </Container>
    );
};

export default MainSection;
