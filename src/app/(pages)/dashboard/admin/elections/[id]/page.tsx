"use client";


import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getElectionDetail, updateElectionStatus, finalizeElection, Election } from "../api";
import { useToast } from "@/providers/toast-provider";
import { Box, Typography, Paper, Stack, Chip, Button, Avatar } from "@mui/material";

function buildPhotoUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6970/v1";
  const assetBase = apiBase.replace(/\/v1\/?$/, "");

  return `${assetBase}${path}`;
}

export default function ElectionDetailPage() {
  const params = useParams();
  let id = params?.id;
  if (Array.isArray(id)) id = id[0];
  const toast = useToast();
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const handleFinalize = async () => {
    if (!id) return;
    setFinalizing(true);
    try {
      await finalizeElection(id);
      toast.success("Pemilihan berhasil difinalisasi");
      fetchDetail();
    } catch {
      toast.error("Gagal finalize pemilihan");
    } finally {
      setFinalizing(false);
    }
  };

  const fetchDetail = () => {
    if (!id) return;
    setLoading(true);
    getElectionDetail(id)
      .then((data) => {
        setElection(data);
        setError(null);
      })
      .catch(() => setError("Gagal memuat detail pemilihan"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!id || !election) return;
    setUpdating(true);
    try {
      await updateElectionStatus(id, election.status === "active" ? "ended" : "active");
      toast.success("Status pemilihan berhasil diupdate");
      fetchDetail();
    } catch {
      toast.error("Gagal update status pemilihan");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Detail Pemilihan
      </Typography>
      {loading ? (
        <Typography>Memuat detail...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : election ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {election.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Tahun: {election.year}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2">
                Tanggal Mulai: {election.start_at ? new Date(election.start_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-"}
              </Typography>
              <Typography variant="body2">
                Tanggal Selesai: {election.end_at ? new Date(election.end_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
              <Typography variant="body2">Status:</Typography>
              <Chip
                label={election.status.toUpperCase()}
                color={election.status === "active" ? "success" : "default"}
                size="small"
              />
              {election.finalize_status && (
                <Chip
                  label={`FINALIZE: ${election.finalize_status.toUpperCase()}`}
                  color={election.finalize_status === "success" ? "success" : "default"}
                  size="small"
                />
              )}
            </Box>

            {typeof election.total_votes === "number" && (
              <Box
                sx={{
                  mt: 0.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                }}
              >
                <Typography variant="body2" sx={{ color: "#1e3a8a" }}>
                  Total suara masuk: <strong>{election.total_votes}</strong>
                </Typography>
                {election.finalized_at && (
                  <Typography variant="body2" sx={{ color: "#1e3a8a" }}>
                    Diselesaikan pada: <strong>{new Date(election.finalized_at).toLocaleString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</strong>
                  </Typography>
                )}
              </Box>
            )}

            {(election.summary_hash || election.blockchain_tx_hash) && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#f9fafb",
                  border: "1px dashed #d1d5db",
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Informasi Blockchain
                </Typography>
                {election.summary_hash && (
                  <Box sx={{ mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Summary Hash
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                      }}
                    >
                      {election.summary_hash}
                    </Typography>
                  </Box>
                )}
                {election.blockchain_tx_hash && (
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Blockchain TX Hash
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                      }}
                    >
                      {election.blockchain_tx_hash}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Hasil Per Kandidat
              </Typography>
              {election.results && election.results.length > 0 ? (
                <Stack spacing={1.5}>
                  {election.results.map((candidate) => {
                    const total = election.total_votes || 0;
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
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            {candidate.candidate_name}
                          </Typography>
                          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                            {candidate.votes} suara{total ? ` (${percent}%)` : ""}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Belum ada data perolehan suara yang dapat ditampilkan.
                </Typography>
              )}
            </Box>

            <Box>
              <Button
                variant="contained"
                color={election.status === "active" ? "primary" : "success"}
                sx={{ mt: 1, mr: 2 }}
                onClick={handleUpdateStatus}
                disabled={updating}
              >
                {election.status === "active" ? "Akhiri Pemilihan" : "Aktifkan Pemilihan"}
              </Button>
              {election.status === "ended" && (
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ mt: 1 }}
                  onClick={handleFinalize}
                  disabled={finalizing}
                >
                  {finalizing ? "Memproses..." : "Finalize Pemilihan"}
                </Button>
              )}
            </Box>
          </Stack>
        </Paper>
      ) : null}
    </Box>
  );
}
