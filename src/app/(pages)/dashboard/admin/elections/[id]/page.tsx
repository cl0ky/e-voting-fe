"use client";

import { Box, Typography, Paper, Stack, Chip, Button } from "@mui/material";

// Dummy data for detail
const election = {
  id: "2025",
  year: 2025,
  name: "Pemilihan Ketua RT 2025",
  status: "pending" as const,
  start: "01 Desember 2025",
  end: "02 Desember 2025",
};

export default function ElectionDetailPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Detail Pemilihan
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">{election.name}</Typography>
          <Typography variant="body2">Tahun: {election.year}</Typography>
          <Typography variant="body2">Tanggal Mulai: {election.start}</Typography>
          <Typography variant="body2">Tanggal Selesai: {election.end}</Typography>
          <Typography variant="body2">Status: <Chip label={election.status.toUpperCase()} color={election.status === "pending" ? "warning" : "default"} size="small" /></Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>Aktifkan Pemilihan</Button>
        </Stack>
      </Paper>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Daftar Kandidat untuk periode ini:</Typography>
        <Button variant="outlined">Lihat Kandidat</Button>
      </Paper>
    </Box>
  );
}
