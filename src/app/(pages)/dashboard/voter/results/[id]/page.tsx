"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, Paper, Chip, Button, LinearProgress, Stack, Avatar } from "@mui/material";
import { axiosPrivate } from "@/lib";

interface CandidateResult {
  candidate_id: string;
  candidate_name: string;
  photo_url: string | null;
  votes: number;
}

interface ElectionDetail {
  election_id: string;
  name: string;
  status: string;
  finalize_status: string;
  finalized_at: string | null;
  results: CandidateResult[];
  total_votes: number;
}

function buildPhotoUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6970/v1";
  const assetBase = apiBase.replace(/\/v1\/?$/, "");

  return `${assetBase}${path}`;
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

export default function VoterElectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const electionId = Array.isArray(idParam) ? idParam[0] : idParam;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ElectionDetail | null>(null);

  useEffect(() => {
    if (!electionId) return;

    setLoading(true);
    setError(null);

    axiosPrivate
      .get<ElectionDetail>(`/elections/${encodeURIComponent(String(electionId))}`)
      .then((res) => {
        setDetail(res.data);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat detail pemilihan";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [electionId]);

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
      <Box sx={{ width: "100%", maxWidth: 480, my: 4 }}>
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            p: 3,
            bgcolor: "rgba(255,255,255,0.96)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1d4ed8" }}>
              Hasil Pemilihan
            </Typography>
            <Button
              size="small"
              variant="text"
              onClick={() => router.back()}
              sx={{ textTransform: "none", fontSize: 13 }}
            >
              Kembali
            </Button>
          </Stack>

          {loading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography
                align="center"
                sx={{ mt: 2, color: "#1e3a8a", fontWeight: 500 }}
              >
                Memuat detail pemilihan...
              </Typography>
            </Box>
          )}

          {!loading && error && (
            <Box sx={{ mt: 2 }}>
              <Typography align="center" sx={{ color: "error.main", fontWeight: 500 }}>
                {error}
              </Typography>
            </Box>
          )}

          {!loading && !error && detail && (
            <Box sx={{ mt: 1.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#111827", mb: 0.75 }}>
                {detail.name}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2.25 }}>
                <Chip
                  size="small"
                  label={detail.status}
                  color={statusColor(detail.status)}
                  sx={{ textTransform: "capitalize" }}
                />
                <Chip
                  size="small"
                  label={`finalize: ${detail.finalize_status}`}
                  color={statusColor(detail.finalize_status)}
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>

              <Box
                sx={{
                  mb: 2.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                }}
              >
                <Typography sx={{ fontSize: 13, color: "#1e3a8a", mb: 0.5 }}>
                  Total suara masuk: <strong>{detail.total_votes}</strong>
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#1e3a8a" }}>
                  Diselesaikan pada: <strong>{formatDate(detail.finalized_at)}</strong>
                </Typography>
              </Box>

              {detail.results && detail.results.length > 0 ? (
                <Stack spacing={1.5}>
                  {detail.results.map((candidate) => {
                    const total = detail.total_votes || 0;
                    const percent = total
                      ? Math.round((candidate.votes / total) * 100)
                      : 0;

                    return (
                      <Box
                        key={candidate.candidate_id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid #e5e7eb",
                          bgcolor: "#ffffff",
                          boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
                        }}
                      >
                        <Avatar
                          src={buildPhotoUrl(candidate.photo_url)}
                          alt={candidate.candidate_name}
                          variant="rounded"
                          sx={{ width: 40, height: 40, bgcolor: "#93c5fd", fontSize: 18 }}
                        >
                          {candidate.candidate_name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                            {candidate.candidate_name}
                          </Typography>
                          <Typography sx={{ fontSize: 13, color: "#4b5563" }}>
                            {candidate.votes} suara{total ? ` (${percent}%)` : ""}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                  Belum ada data perolehan suara yang dapat ditampilkan.
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
