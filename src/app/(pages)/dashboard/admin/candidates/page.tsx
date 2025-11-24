"use client";

import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import CandidateTable from "./components/CandidateTable";
import CandidateForm from "./components/CandidateForm";
import CandidateDeleteDialog from "./components/CandidateDeleteDialog";
import type { Candidate } from "./types";
import type { CandidateFormValues } from "./schema";
import { createCandidate } from "./api";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { useToast } from "@/providers/toast-provider";
import { getElections, type Election } from "../elections/api";
import { axiosPrivate } from "@/lib/axios";


export default function AdminCandidatesPage() {
  const toast = useToast();

  const [items, setItems] = useState<Candidate[]>([]); // Replace with API fetch by electionId
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Candidate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState<string>("");
  const deletingItem = useMemo(() => items.find(i => i.id === deleteId) || null, [deleteId, items]);

  useEffect(() => {
    getElections().then(setElections).catch(() => setElections([]));
  }, []);

  useEffect(() => {
    if (selectedElectionId) {
      setLoading(true);
      axiosPrivate.get(`/candidates/election/${selectedElectionId}`)
        .then(res => {
          if (Array.isArray(res.data)) {
            setItems(res.data);
          } else {
            setItems([]);
          }
        })
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    } else {
      setItems([]);
    }
  }, [selectedElectionId]);

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
    const submitValues: CandidateFormValues = {
      ...values,
      electionId: selectedElectionId !== "" ? selectedElectionId : undefined,
    };
    if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? {
        ...i,
        name: submitValues.name,
        vision: submitValues.vision,
        mission: submitValues.mission,
        year: submitValues.year,
        electionId: submitValues.electionId || '',
      } : i));
      toast.success('Kandidat diperbarui');
    } else {
      setLoading(true);
      try {
        await createCandidate(submitValues);
        if (selectedElectionId) {
          const res = await axiosPrivate.get(`/candidates/election/${selectedElectionId}`);
          setItems(Array.isArray(res.data) ? res.data : []);
        }
        toast.success('Kandidat ditambahkan');
        setOpenForm(false);
        setEditing(null);
      } catch (err) {
        toast.error(getAxiosErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setConfirmingDelete(true);
    try {
      setItems(prev => prev.filter(i => i.id !== deleteId));
      toast.success('Kandidat dihapus');
    } finally {
      setConfirmingDelete(false);
      setDeleteId(null);
    }
  };

  return (
    <Box mx="auto" mt={4}>
      <Typography variant="h5" mb={3} fontWeight={600}>Kandidat</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="election-select-label">Pilih Periode Pemilihan</InputLabel>
        <Select
          labelId="election-select-label"
          value={selectedElectionId}
          label="Pilih Periode Pemilihan"
          onChange={e => setSelectedElectionId(e.target.value as string)}
        >
          <MenuItem value="">-- Pilih Periode Pemilihan --</MenuItem>
          {elections.map(e => (
            <MenuItem key={e.id} value={String(e.id)}>{e.year} - {e.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedElectionId === "" ? (
        <Box mt={4} textAlign="center">
          <Typography variant="body1" color="text.secondary">
            Silakan pilih periode pemilihan terlebih dahulu.
          </Typography>
        </Box>
      ) : (
        <Box>
          <Stack direction="row" justifyContent="flex-end" mb={2}>
            <Button variant="contained" onClick={handleCreate}>Tambah Kandidat</Button>
          </Stack>
          <CandidateTable
            items={items.filter(i => String(i.electionId) === selectedElectionId)}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>
      )}

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
              year: editing?.year ?? new Date().getFullYear(),
              electionId: editing?.electionId || (selectedElectionId !== "" ? selectedElectionId : undefined),
            }}
            onSubmit={onSubmit}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>

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
