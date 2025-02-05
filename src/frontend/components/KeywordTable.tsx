"use client";

import React from "react";
import {
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { IBrodAIKeyword } from "@/components/backendService";

interface KeywordTableProps {
    mainKeyword: string;
    keywords: IBrodAIKeyword[];
    handleWriteArticle: (keyword: string) => void;
}

const KeywordTable: React.FC<KeywordTableProps> = ({
    mainKeyword,
    keywords,
    handleWriteArticle,
}) => {
    return (
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
            <Typography
                variant="h6"
                align="center"
                gutterBottom
                sx={{ marginBottom: 2 }}
            >
                Top keywords related to{" "}
                <span style={{ textDecoration: "underline", color: "blue" }}>
                    <a
                        href={`https://www.${mainKeyword
                            .replace(/^https?:\/\//i, "")
                            .replace(/^www\./i, "")}`}
                        target="_blank"
                    >
                        {mainKeyword}
                    </a>
                </span>
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Keyword</TableCell>
                            <TableCell>Traffic</TableCell>
                            <TableCell>Difficulty</TableCell>
                            <TableCell>Perf. Score</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {keywords.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{item.keyword}</TableCell>
                                <TableCell>{item.traffic}</TableCell>
                                <TableCell>{item.difficulty}</TableCell>
                                <TableCell>{item.performance_score}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            handleWriteArticle(item.keyword)
                                        }
                                    >
                                        Write an article
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </motion.div>
    );
};

export default KeywordTable;
