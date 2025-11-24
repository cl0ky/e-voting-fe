import { Dialog, DialogTitle, DialogContent, Stack, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useToast } from "@/providers/toast-provider";
import { createElection } from "../api";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ElectionFormDialog({ open, onClose, onSuccess }: Props) {
  const toast = useToast();
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    name: "",
    start: "",
    end: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "year" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const startISO = form.start ? `${form.start}T00:00:00Z` : "";
      const endISO = form.end ? `${form.end}T00:00:00Z` : "";
      await createElection({
        name: form.name,
        start: startISO,
        end: endISO,
        status: "pending",
      });
      toast.success("Berhasil menambahkan pemilihan baru");
      onClose();
      setForm({ year: new Date().getFullYear(), name: "", start: "", end: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      setError(msg);
      toast.error(msg || "Gagal menambahkan pemilihan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Buat Pemilihan Baru</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Tahun"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              inputProps={{ min: 2000, max: 2100 }}
              fullWidth
              required
            />
            <TextField
              label="Nama Pemilihan"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Tanggal Mulai"
              name="start"
              type="date"
              value={form.start}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Tanggal Selesai"
              name="end"
              type="date"
              value={form.end}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            {error && (
              <Typography color="error" variant="body2">{error}</Typography>
            )}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={onClose} variant="text" disabled={loading}>Batal</Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}
