import { Dialog, DialogTitle, DialogContent, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ElectionFormDialog({ open, onClose }: Props) {
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    name: "",
    start: "",
    end: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "year" ? Number(value) : value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Buat Pemilihan Baru</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Tahun"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            inputProps={{ min: 2000, max: 2100 }}
            fullWidth
          />
          <TextField
            label="Nama Pemilihan"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Tanggal Mulai"
            name="start"
            type="date"
            value={form.start}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Tanggal Selesai"
            name="end"
            type="date"
            value={form.end}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={onClose} variant="text">Batal</Button>
            <Button variant="contained" color="primary">Simpan</Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
