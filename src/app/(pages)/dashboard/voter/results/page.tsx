"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Paper, LinearProgress, Chip } from "@mui/material";
import { axiosPrivate } from "@/lib";

interface ResultsResponse {
    items?: {
        election_id?: string;
        election_name?: string;
        election_status?: string;
        start_at?: string;
        end_at?: string;
        hasCommitted?: boolean;
        hasRevealed?: boolean;
        candidate_id?: string;
        candidate_name?: string;
        revealed_at?: string;
    }[];
    total?: number;
}

export default function VoterResultsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ResultsResponse | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        axiosPrivate
            .get("/votes/results")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Gagal memuat hasil pemilihan";
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, []);

    const items = data?.items ?? [];
    const first = items[0];

    const electionName = first?.election_name ?? "Pemilihan";
    const electionStatus = first?.election_status ?? "";
    const candidateName = first?.candidate_name ?? "-";
    const revealedAt = first?.revealed_at
        ? new Date(first.revealed_at).toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : null;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 40%, #90caf9 100%)",
                px: 2,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 480,
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        borderRadius: 3,
                        p: 3,
                        bgcolor: "rgba(255,255,255,0.96)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                >
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{ fontWeight: 700, color: "#1d4ed8", mb: 0.5 }}
                    >
                        Hasil Pemilihan
                    </Typography>
                    <Typography
                        align="center"
                        sx={{ color: "#4b5563", fontSize: 14, mb: 2 }}
                    >
                        {electionName}
                        {electionStatus ? ` (${electionStatus})` : ""}
                    </Typography>

                    {loading && (
                        <Box sx={{ mt: 3 }}>
                            <LinearProgress />
                            <Typography
                                align="center"
                                sx={{ mt: 2, color: "#1e3a8a", fontWeight: 500 }}
                            >
                                Memuat hasil pemilihan...
                            </Typography>
                        </Box>
                    )}

                    {!loading && error && (
                        <Box sx={{ mt: 3 }}>
                            <Typography
                                align="center"
                                sx={{ color: "error.main", fontWeight: 500 }}
                            >
                                {error}
                            </Typography>
                        </Box>
                    )}

                    {!loading && !error && items.length === 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography
                                align="center"
                                sx={{ color: "#4b5563", fontWeight: 500 }}
                            >
                                Belum ada data hasil pemilihan yang dapat ditampilkan.
                            </Typography>
                        </Box>
                    )}

                    {!loading && !error && items.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ color: "#6b7280", mb: 1, textAlign: "center" }}
                            >
                                Suara Anda telah berhasil direveal.
                            </Typography>

                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    border: "1px solid #d1d5db",
                                    bgcolor: "#ffffff",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#6b7280",
                                        mb: 0.5,
                                    }}
                                >
                                    Pemilihan
                                </Typography>
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: "#111827",
                                        mb: 1.5,
                                    }}
                                >
                                    {electionName}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#6b7280",
                                        mb: 0.5,
                                    }}
                                >
                                    Kandidat pilihan Anda
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mb: 1.5,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            color: "#111827",
                                        }}
                                    >
                                        {candidateName}
                                    </Typography>
                                    <Chip
                                        color="primary"
                                        size="small"
                                        label="Pilihan Anda"
                                    />
                                </Box>

                                {revealedAt && (
                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            color: "#6b7280",
                                        }}
                                    >
                                        Direveal pada: <strong>{revealedAt}</strong>
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
