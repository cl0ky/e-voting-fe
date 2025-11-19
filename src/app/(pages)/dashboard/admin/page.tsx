"use client";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

function CardLink({ href, title, emoji, desc }: { href: string; title: string; emoji: string; desc: string }) {
  return (
    <Paper component={Link} href={href} sx={{ p: 2, textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <Typography variant="h6" gutterBottom>{emoji} {title}</Typography>
      <Typography variant="body2" color="text.secondary">{desc}</Typography>
    </Paper>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const onLogout = () => {
    localStorage.removeItem('token');
    router.replace('/auth/login');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">🏠 Dashboard Admin</Typography>
        <Button variant="outlined" onClick={onLogout}>Logout</Button>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        <CardLink href="/dashboard/admin/candidates" title="Kandidat" emoji="🧔" desc="Kelola kandidat pada RT Anda" />
        <CardLink href="/dashboard/admin/elections" title="Pemilihan" emoji="🗳️" desc="Buat dan atur jadwal pemilihan" />
        <CardLink href="/dashboard/admin/results" title="Hasil" emoji="📊" desc="Lihat rekapitulasi hasil pemilihan" />
      </Box>
    </Box>
  );
}
