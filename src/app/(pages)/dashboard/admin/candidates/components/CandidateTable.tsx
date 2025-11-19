"use client";

import { Avatar, Button, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import type { Candidate } from '../types';

export type CandidateTableProps = {
  items: Candidate[];
  loading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

function truncate(text?: string, max = 80) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}

export default function CandidateTable({ items, loading, onEdit, onDelete }: CandidateTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Foto</TableCell>
            <TableCell>Nama</TableCell>
            <TableCell>Tahun</TableCell>
            <TableCell>Visi</TableCell>
            <TableCell>Misi</TableCell>
            <TableCell align="right">Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
                <TableCell><Skeleton width={160} /></TableCell>
                <TableCell><Skeleton width={80} /></TableCell>
                <TableCell><Skeleton width={240} /></TableCell>
                <TableCell><Skeleton width={240} /></TableCell>
                <TableCell align="right"><Skeleton width={80} /></TableCell>
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">Belum ada kandidat</TableCell>
            </TableRow>
          ) : (
            items.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>
                  <Avatar src={c.photoUrl} sx={{ width: 32, height: 32 }} />
                </TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.year}</TableCell>
                <TableCell>{truncate(c.vision)}</TableCell>
                <TableCell>{truncate(c.mission)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <Button size="small" variant="text" onClick={() => onEdit(c.id)} sx={{ mr: 1 }}>Edit</Button>
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <Button size="small" color="error" variant="text" onClick={() => onDelete(c.id)}>Hapus</Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
