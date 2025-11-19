"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export type CandidateDeleteDialogProps = {
  open: boolean;
  name?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  confirming?: boolean;
};

export default function CandidateDeleteDialog({ open, name, onClose, onConfirm, confirming }: CandidateDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={confirming ? undefined : onClose}>
      <DialogTitle>Hapus Kandidat</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Yakin ingin menghapus kandidat {name ? `"${name}"` : ''}? Tindakan ini tidak dapat dibatalkan.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={confirming}>Batal</Button>
        <Button color="error" variant="contained" onClick={() => onConfirm()} disabled={confirming}>
          {confirming ? 'Menghapus…' : 'Hapus'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
