"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import ElectionsTable from "./components/ElectionsTable";
import ElectionFormDialog from "./components/ElectionFormDialog";

export default function AdminElectionsPage() {
  const [openForm, setOpenForm] = useState(false);
  // Dummy data
  const elections = [
    {
      year: 2025,
      name: "Pemilihan Ketua RT 2025",
      status: "pending" as const,
      start: "01/12",
      end: "02/12",
    },
    {
      year: 2024,
      name: "Pemilihan Ketua RT 2024",
      status: "ended" as const,
      start: "01/12",
      end: "02/12",
    },
  ];

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">🗳️ Pemilihan</Typography>
        <Button variant="contained" onClick={() => setOpenForm(true)}>Buat Pemilihan</Button>
      </Stack>
      <ElectionsTable elections={elections} />
      <ElectionFormDialog open={openForm} onClose={() => setOpenForm(false)} />
    </Box>
  );
}
