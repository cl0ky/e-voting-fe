"use client";

import { Box, Stack, Typography, Paper } from "@mui/material";

export default function AdminResultsPage() {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">📊 Hasil</Typography>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Rekap hasil pemilihan akan tampil di sini. (Placeholder UI)
        </Typography>
      </Paper>
    </Box>
  );
}
