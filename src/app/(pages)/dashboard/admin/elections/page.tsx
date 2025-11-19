"use client";

import { Box, Button, Stack, Typography, Paper } from "@mui/material";

export default function AdminElectionsPage() {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">🗳️ Pemilihan</Typography>
        <Button variant="contained">Buat Pemilihan</Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Daftar pemilihan akan tampil di sini. (Placeholder UI)
        </Typography>
      </Paper>
    </Box>
  );
}
