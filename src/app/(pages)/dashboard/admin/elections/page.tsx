"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ElectionsTable from "./components/ElectionsTable";
import ElectionFormDialog from "./components/ElectionFormDialog";
import { getElections, Election } from "./api";



export default function AdminElectionsPage() {
  const [openForm, setOpenForm] = useState(false);
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElections = () => {
    setLoading(true);
    getElections()
      .then((data) => {
        setElections(data);
        setError(null);
      })
      .catch(() => {
        setError("Gagal memuat data pemilihan");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchElections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">🗳️ Pemilihan</Typography>
        <Button variant="contained" onClick={() => setOpenForm(true)}>Buat Pemilihan</Button>
      </Stack>
      {loading ? (
        <Typography>Memuat data...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <ElectionsTable
          elections={elections?.map(e => ({
            id: e.id,
            year: e.year,
            name: e.name,
            status: e.status,
            start: e.start_at ? new Date(e.start_at).toLocaleDateString("id-ID") : "",
            end: e.end_at ? new Date(e.end_at).toLocaleDateString("id-ID") : "",
          }))}
        />
      )}
  <ElectionFormDialog open={openForm} onClose={() => setOpenForm(false)} onSuccess={fetchElections} />
    </Box>
  );
}
