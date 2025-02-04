// "use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import visuallyHidden from "@mui/utils/visuallyHidden";
import { motion } from "framer-motion";
import TypewriterTitle from "./TypewriterTitle";
import DomainSearchBar from "./DomainSearchBar";
import { fetchKeywords, IBrodAIKeyword } from "./backendEndpoints";
import { Alert, AlertColor, Snackbar } from "@mui/material";

const MainSection = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [keywords, setKeywords] = useState<IBrodAIKeyword[]>([]);
    
    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");
  
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
            <TypewriterTitle />
            <DomainSearchBar handleSearch={handleSearch} searchText={searchKeyword} loading={loading} setSearchText={setSearchKeyword} />
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
        </Container>
    );
};

export default MainSection;
