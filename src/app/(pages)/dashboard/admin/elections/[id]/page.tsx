"use client";


import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getElectionDetail, updateElectionStatus, Election } from "../api";
import { useToast } from "@/providers/toast-provider";
import { Box, Typography, Paper, Stack, Chip, Button } from "@mui/material";

export default function ElectionDetailPage() {
  const params = useParams();
  let id = params?.id;
  if (Array.isArray(id)) id = id[0];
  const toast = useToast();
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

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
          <Stack spacing={2}>
            <Typography variant="h6">{election.name}</Typography>
            <Typography variant="body2">Tahun: {election.year}</Typography>
            <Typography variant="body2">Tanggal Mulai: {election.start_at ? new Date(election.start_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-"}</Typography>
            <Typography variant="body2">Tanggal Selesai: {election.end_at ? new Date(election.end_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-"}</Typography>
            <Typography variant="body2">Status: <Chip label={election.status.toUpperCase()} color={election.status === "active" ? "success" : "default"} size="small" /></Typography>
            <Button
              variant="contained"
              color={election.status === "active" ? "primary" : "success"}
              sx={{ mt: 2 }}
              onClick={handleUpdateStatus}
              disabled={updating}
            >
              {election.status === "active" ? "Akhiri Pemilihan" : "Aktifkan Pemilihan"}
            </Button>
          </Stack>
        </Paper>
      ) : null}
    </Box>
  );
}
