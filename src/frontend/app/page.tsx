"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    fetchKeywords,
    IBrodAIKeyword,
} from "@/components/backendService";
import KeywordTable from "@/components/KeywordTable";
// "use client";

import Stack from "@mui/material/Stack";
import TypewriterTitle from "@/components/TypewriterTitle";
import DomainSearchBar from "@/components/DomainSearchBar";
import {
    Alert,
    AlertColor,
    Box,
    CircularProgress,
    Snackbar,
} from "@mui/material";

export default function KeywordResearchPage() {
    const [loading, setLoading] = useState(false);
    const [keywords, setKeywords] = useState<IBrodAIKeyword[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] =
        useState<AlertColor>("success");

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    // Helper function to show the Snackbar
    const showSnackbar = (message: string, severity: AlertColor) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            showSnackbar("Please enter a valid domain.", "warning");
            return;
        }
        setLoading(true);
        setKeywords([]);
        try {
            const data = await fetchKeywords(searchKeyword);
            setKeywords(data);
        } catch (error: any) {
            showSnackbar(error.message || "Error fetching domain", "error");
        } finally {
            setLoading(false);
        }
    };
    const router = useRouter();

    function handleWriteArticle(keyword: string) {
        // Redirect to /create-article with the selected keyword
        router.push(`/createArticle?keyword=${encodeURIComponent(keyword)}`);
    }

    return (
        <Box
            style={{
                padding: "60px 20px",
                textAlign: "center",
                minHeight: "70vh",
                background: "radial-gradient(circle, rgba(231,237,242,1) 24%, rgba(138,158,221,1) 100%)"
            }}
        >
            <Stack
                spacing={2}
                direction={"column"}
                sx={{
                    pt: { xs: 14, sm: 20 },
                    pb: { xs: 8, sm: 12 },
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <TypewriterTitle />
                <DomainSearchBar
                    handleSearch={handleSearch}
                    searchText={searchKeyword}
                    loading={loading}
                    setSearchText={setSearchKeyword}
                />

                {/* Loader */}
                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mt: 4,
                        }}
                    >
                        <CircularProgress color="primary" />
                    </Box>
                )}

                {/* Results Table */}
                {!loading && keywords.length > 0 && (
                    <KeywordTable
                        mainKeyword={searchKeyword}
                        keywords={keywords}
                        handleWriteArticle={handleWriteArticle}
                    />
                )}
                {/* Snackbar for warnings/errors */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbarSeverity}
                        sx={{ width: "100%" }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Stack>
        </Box>
    );
}
