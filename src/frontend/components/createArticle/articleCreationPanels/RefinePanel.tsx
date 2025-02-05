"use client";

import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { BorderColor } from "@mui/icons-material";

interface RefinePanelProps {
    refinePrompt: string;
    setRefinePrompt: (val: string) => void;
    loadingAction: string | null;
    onRefine: () => void;
}

export default function RefinePanel({
    refinePrompt,
    setRefinePrompt,
    loadingAction,
    onRefine,
}: RefinePanelProps) {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                Describe what you want to change in the content:
            </p>
            <TextField
                multiline
                rows={2}
                fullWidth
                placeholder="e.g. 'Rewrite the second paragraph about bananas'"
                value={refinePrompt}
                onChange={(e) => setRefinePrompt(e.target.value)}
            />
            <Button
                variant="contained"
                fullWidth
                style={{ marginTop: "0.5rem" }}
                onClick={onRefine}
                disabled={loadingAction === "refine"}
            >
                {loadingAction === "refine" ? (
                    <CircularProgress size={24} />
                ) : (
                    "Refine Content"
                )}
            </Button>
        </div>
    );
}
