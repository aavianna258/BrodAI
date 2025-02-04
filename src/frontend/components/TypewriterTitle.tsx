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
                // pt: { xs: 14, sm: 20 },
                // pb: { xs: 8, sm: 12 },
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
                    BrodAI&nbsp;
                    <Box component="span" sx={{ color: "blue" }}>
                        SEO Agent
                    </Box>
                </Typography>
                <Typography sx={{ color: "grey.700" }}>
                    {/* BrodAI is your <strong>24/7</strong> SEO consultant. */}
                    BrodAI is your 24/7 SEO consultant for
                    <strong> {typewriterText}</strong>
                    <Cursor cursorColor="#2563EB" />
                    {/* <br></br><br></br>
                        Every day, it audits your site, fixes errors, researches{" "}
                        <strong>trending keywords</strong>, and publishes new
                        articles. */}
                </Typography>
            </Stack>
        </Container>
    );
};

export default MainSection;
