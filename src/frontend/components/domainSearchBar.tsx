import React, { useState } from "react";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import {
    fetchKeywords,
    IBrodAIKeyword,
} from "./services/keywordResearchService";

interface SearchBarProps {
    loading: boolean;
    searchText: string;
    setSearchText: (newText: string) => void;
    handleSearch: () => void;
}

const DomainSearchBar = ({
    loading,
    searchText,
    setSearchText,
    handleSearch,
}: SearchBarProps) => {
    return (
        <Box
            component="form"
            sx={{ justifyContent: "center", alignItems: "center" }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                useFlexGap
                sx={{ pt: 2, width: { xs: "100%", sm: "350px" } }}
            >
                <TextField
                    variant="outlined"
                    label="Enter your domain"
                    placeholder="https://www.brod-ai.com"
                    size="small"
                    value={searchText}
                    fullWidth
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{ bgcolor: "white" }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ minWidth: "fit-content" }}
                    onClick={handleSearch}
                    disabled={loading}
                >
                    Search
                </Button>
            </Stack>
        </Box>
    );
};

export default DomainSearchBar;
