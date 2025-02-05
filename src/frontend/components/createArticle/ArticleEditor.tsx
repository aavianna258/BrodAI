"use client";

import React, { useState, KeyboardEvent } from "react";
import {
    TextField,
    CircularProgress,
    IconButton,
    Box,
    styled,
    alpha,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

// Container that dims slightly on hover, revealing icons
const HoverContainer = styled(Box)({
    position: "relative",
    transition: "background-color 0.2s",
    "&:hover": {
        backgroundColor: alpha("#000", 0.04), // subtle overlay
    },
    // The icon area
    "&:hover .hoverIcons": {
        opacity: 1,
        visibility: "visible",
    },
});

interface ArticleEditorProps {
    loading: boolean;
    title: string;
    setTitle: (val: string) => void;
    editTitleMode: boolean;
    setEditTitleMode: (val: boolean) => void;
    showEditor: boolean;
    setShowEditor: (val: boolean) => void;
    content: string;
    setContent: (val: string) => void;
    handleDiscard?: () => void;
}

export default function ArticleEditor(props: ArticleEditorProps) {
    const {
        loading,
        title,
        setTitle,
        editTitleMode,
        setEditTitleMode,
        showEditor,
        setShowEditor,
        content,
        setContent,
        handleDiscard,
    } = props;
    if (!editTitleMode) {
        return <h2 style={{ margin: 0 }}>{title}</h2>;
    }

    // If in edit mode, show a TextField; pressing Enter or blur ends editing
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setEditTitleMode(false);
        }
    };

    return (
        <div
            style={{
                flex: 1,
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            {loading && (
                <div style={{ marginBottom: "1rem" }}>
                    <CircularProgress />
                    &nbsp;Loading...
                </div>
            )}

            {/* TITLE AREA */}
            <HoverContainer sx={{ padding: "0.5rem" }}>
                {/* Icon bar on top-right of the title area */}
                <Box
                    className="hoverIcons"
                    sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        opacity: 0,
                        visibility: "hidden",
                        display: "flex",
                        gap: "0.5rem",
                        color: "#fff", // White icons for contrast
                    }}
                >
                    {/* Toggle Title Edit */}
                    <IconButton
                        size="small"
                        sx={{ color: "#fff" }}
                        onClick={() => setEditTitleMode(!editTitleMode)}
                    >
                        {editTitleMode ? <EditIcon /> : <EditIcon />}
                    </IconButton>
                </Box>

                <TextField
                    fullWidth
                    variant="standard"
                    sx={{ fontSize: "1.2rem", fontWeight: 600 }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setEditTitleMode(false)}
                    onKeyDown={handleKeyDown}
                />
            </HoverContainer>

            {/* ARTICLE BODY AREA */}
            <HoverContainer sx={{ padding: "0.5rem", flex: 1 }}>
                {/* Icon bar on top-right of the article area */}
                <Box
                    className="hoverIcons"
                    sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        opacity: 0,
                        visibility: "hidden",
                        display: "flex",
                        gap: "0.5rem",
                        color: "#fff",
                    }}
                >
                    {/* Toggle Edit HTML */}
                    <IconButton
                        size="small"
                        sx={{ color: "#fff" }}
                        onClick={() => setShowEditor(!showEditor)}
                    >
                        <CodeIcon />
                    </IconButton>

                    {/* Discard (if provided) */}
                    {handleDiscard && (
                        <IconButton
                            size="small"
                            sx={{ color: "#fff" }}
                            onClick={handleDiscard}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                    )}
                </Box>

                {/* Show content either as preview or raw HTML editor */}
                {!showEditor ? (
                    <div
                        style={{
                            border: "1px solid #ccc",
                            padding: "1rem",
                            minHeight: "300px",
                            lineHeight: 1.6,
                            backgroundColor: "#fff",
                        }}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ) : (
                    <div>
                        <TextField
                            multiline
                            fullWidth
                            rows={15}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                )}
            </HoverContainer>
        </div>
    );
}
