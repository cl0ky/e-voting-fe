"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Paper, LinearProgress, Chip, Stack } from "@mui/material";
import { axiosPrivate } from "@/lib";

interface ElectionItem {
    election_id: string;
    name: string;
    status: string;
    finalize_status: string;
    start_at: string;
    end_at: string;
    finalized_at: string | null;
}

interface ElectionsResponse {
    data: ElectionItem[];
}

function formatDate(iso: string | null | undefined): string {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function statusColor(status: string): "default" | "success" | "warning" | "error" | "info" {
    const s = status.toLowerCase();
    if (s === "finished" || s === "success") return "success";
    if (s === "reveal_phase") return "info";
    if (s === "commit_phase") return "warning";
    if (s === "failed" || s === "error") return "error";
    return "default";
}

export default function VoterResultsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<ElectionItem[]>([]);

    useEffect(() => {
        setLoading(true);
        setError(null);

        axiosPrivate
            .get<ElectionsResponse>("/elections")
            .then((res) => {
                setItems(res.data?.data ?? []);
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

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
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
                    mt: 5,
                    mb: 4,
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
                        sx={{ fontWeight: 700, color: "#1d4ed8", mb: 1 }}
                    >
                        Hasil Pemilihan
                    </Typography>
                    <Typography
                        align="center"
                        sx={{ color: "#4b5563", fontSize: 14, mb: 3 }}
                    >
                        Daftar pemilihan di lingkungan Anda. Ketuk salah satu kartu
                        untuk melihat detail dan status prosesnya.
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
                            <Stack spacing={2.5}>
                                {items.map((item) => (
                                    <Box
                                        key={item.election_id}
                                        sx={{
                                            borderRadius: 2.5,
                                            border: "1px solid #d1d5db",
                                            p: 2,
                                            bgcolor: "#ffffff",
                                            boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
                                            cursor: "pointer",
                                            transition:
                                                "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
                                            "&:hover": {
                                                transform: "translateY(-3px)",
                                                boxShadow: "0 10px 25px rgba(15,23,42,0.12)",
                                                borderColor: "#60a5fa",
                                            },
                                        }}
                                        onClick={() =>
                                            router.push(
                                                `/dashboard/voter/results/${encodeURIComponent(
                                                    item.election_id,
                                                )}`,
                                            )
                                        }
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                gap: 1.5,
                                                mb: 1.5,
                                            }}
                                        >
                                            <Box>
                                                <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                                                    {item.name}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: "right" }}>
                                                <Chip
                                                    size="small"
                                                    label={item.status}
                                                    color={statusColor(item.status)}
                                                    sx={{
                                                        mr: 0.5,
                                                        textTransform: "capitalize",
                                                    }}
                                                />
                                                <Chip
                                                    size="small"
                                                    label={`finalize: ${item.finalize_status}`}
                                                    color={statusColor(item.finalize_status)}
                                                    sx={{ textTransform: "capitalize" }}
                                                />
                                            </Box>
                                        </Box>

                                        <Typography
                                            sx={{ fontSize: 13, color: "#4b5563", mt: 0.25 }}
                                        >
                                            Mulai: <strong>{formatDate(item.start_at)}</strong>
                                        </Typography>
                                        <Typography
                                            sx={{ fontSize: 13, color: "#4b5563", mt: 0.25 }}
                                        >
                                            Selesai: <strong>{formatDate(item.end_at)}</strong>
                                        </Typography>
                                        <Typography
                                            sx={{ fontSize: 13, color: "#4b5563", mt: 0.25 }}
                                        >
                                            Finalized: <strong>{formatDate(item.finalized_at)}</strong>
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mt: 1.2,
                                                fontSize: 12,
                                                color: "#2563eb",
                                                fontWeight: 500,
                                                textAlign: "right",
                                            }}
                                        >
                                            Lihat detail pemilihan →
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
