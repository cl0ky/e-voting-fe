"use client";

import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import CandidateTable from "./components/CandidateTable";
import CandidateForm from "./components/CandidateForm";
import CandidateDeleteDialog from "./components/CandidateDeleteDialog";
import type { Candidate } from "./types";
import type { CandidateFormValues } from "./schema";
import { useToast } from "@/providers/toast-provider";

export default function AdminCandidatesPage() {
  const toast = useToast();

  // Local state demo — replace with API calls later
  const [items, setItems] = useState<Candidate[]>([]);
  const [loading] = useState(false); // reserved for future API wiring
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Candidate | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deletingItem = useMemo(() => items.find(i => i.id === deleteId) || null, [deleteId, items]);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const handleEdit = (id: string) => {
    const found = items.find(i => i.id === id) || null;
    setEditing(found);
    setOpenForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const onSubmit = async (values: CandidateFormValues) => {
    if (editing) {
      // Update existing (replace with API later)
      setItems(prev => prev.map(i => i.id === editing.id ? {
        ...i,
        name: values.name,
        vision: values.vision,
        mission: values.mission,
        year: values.year,
        // photoUrl will be provided by BE after upload – keep existing preview for demo
      } : i));
      toast.success('Kandidat diperbarui');
    } else {
      // Create new (replace with API later)
      const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());
      setItems(prev => [{ id, name: values.name, vision: values.vision, mission: values.mission, year: values.year }, ...prev]);
      toast.success('Kandidat ditambahkan');
    }
    setOpenForm(false);
    setEditing(null);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setConfirmingDelete(true);
    try {
      // Replace with API delete later
      setItems(prev => prev.filter(i => i.id !== deleteId));
      toast.success('Kandidat dihapus');
    } finally {
      setConfirmingDelete(false);
      setDeleteId(null);
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">🧔 Kandidat</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Filter Tahun"
            type="number"
            size="small"
            sx={{ width: 160 }}
            inputProps={{ min: 2000, max: 2100 }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value) || new Date().getFullYear())}
          />
          <Button variant="contained" onClick={handleCreate}>Tambah Kandidat</Button>
        </Stack>
      </Stack>

      <CandidateTable
        items={useMemo(() => items.filter(i => i.year === selectedYear), [items, selectedYear])}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create / Edit Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Kandidat' : 'Tambah Kandidat'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <CandidateForm
            title=""
            initialValues={{
              name: editing?.name,
              vision: editing?.vision,
              mission: editing?.mission,
              photoFile: null,
              photoUrl: editing?.photoUrl,
              year: editing?.year ?? selectedYear,
            }}
            onSubmit={onSubmit}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <CandidateDeleteDialog
        open={!!deleteId}
        name={deletingItem?.name}
        onClose={() => setDeleteId(null)}
        onConfirm={onConfirmDelete}
        confirming={confirmingDelete}
      />
    </Box>
  );
}
