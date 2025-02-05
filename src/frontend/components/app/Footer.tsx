"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Button,
    useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Footer() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMdUp = useMediaQuery("(min-width:768px)"); // approximate "md" breakpoint

    const handleSignOut = () => {
        // Replace with your actual sign-out logic
        alert("Signing out...");
    };

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <AppBar
                position="static"
                sx={{ background: "linear-gradient(to right, #fff, #f3e8ff)" }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    {/* Logo */}
                    <Link
                        href="/"
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                            }}
                        >
                            <img
                                src="./icon.png"
                                alt="BrodAI Logo"
                                style={{
                                    width: 30,
                                    height: 30,
                                    border: "1px solid black",
                                    borderRadius: "50%",
                                }}
                            />
                            <Typography
                                variant="h6"
                                component="div"
                                fontWeight="bold"
                            >
                                BrodAI
                            </Typography>
                        </Box>
                    </Link>

                    {/* Desktop Nav (shown if viewport >= md) */}
                    {isMdUp && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Button
                                onClick={handleSignOut}
                                sx={{
                                    textTransform: "none",
                                    color: "gray",
                                    transition: "opacity 0.2s",
                                    "&:hover": { opacity: 0.8 },
                                }}
                            >
                                👤 BerberHouse Profile
                            </Button>
                        </Box>
                    )}

                    {/* Mobile Menu Button (shown if viewport < md) */}
                    {!isMdUp && (
                        <IconButton edge="end" onClick={handleToggleMenu}>
                            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile Nav Dropdown (only if isMenuOpen && viewport < md) */}
            {!isMdUp && isMenuOpen && (
                <Box
                    sx={{
                        background:
                            "linear-gradient(to right, #ede9fe, #f3e8ff)",
                        px: 2,
                        py: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Link
                            href="/keyword-research"
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                textDecoration: "none",
                                color: "#333",
                                transition: "opacity 0.2s",
                            }}
                        >
                            Keyword Researcher
                        </Link>
                        <Link
                            href="/link-builder"
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                textDecoration: "none",
                                color: "#333",
                                transition: "opacity 0.2s",
                            }}
                        >
                            Link Builder
                        </Link>
                        <Button
                            onClick={() => {
                                handleSignOut();
                                setIsMenuOpen(false);
                            }}
                            sx={{
                                textTransform: "none",
                                color: "#333",
                                textAlign: "left",
                                justifyContent: "flex-start",
                                transition: "opacity 0.2s",
                                "&:hover": { opacity: 0.8 },
                            }}
                        >
                            👤 My Profile
                        </Button>
                    </Box>
                </Box>
            )}
        </>
    );
}
