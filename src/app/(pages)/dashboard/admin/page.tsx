"use client";

import { useEffect, useState } from "react";
import { Box, Button, Paper, Stack, Typography, Divider, Chip, Table, TableBody, TableCell, TableHead, TableRow, Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAdminDashboard, type AdminDashboardData } from "./elections/api";

function SummaryCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function QuickActionCard({ href, title, desc, buttonLabel }: { href: string; title: string; desc: string; buttonLabel: string }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 140,
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {desc}
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button
          component={Link}
          href={href}
          variant="contained"
          sx={{ textTransform: "none" }}
        >
          {buttonLabel}
        </Button>
      </Box>
    </Paper>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAdminDashboard()
      .then((data) => {
        if (!cancelled) {
          setDashboard(data);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  };

  const summary = dashboard?.summary ?? { total: 0, active: 0, notFinalized: 0 };
  const latestElections = dashboard?.latest ?? [];

  return (
    <Box sx={{ p: 3, maxWidth: 1280, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Dashboard Admin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola sistem e-voting RT Anda
          </Typography>
        </Box>
        <Button variant="outlined" color="error" onClick={onLogout}>
          Logout
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2.5,
          mb: 4,
        }}
      >
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={96} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={96} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={96} sx={{ borderRadius: 2 }} />
          </>
        ) : (
          <>
            <SummaryCard label="Total Pemilihan" value={summary.total} />
            <SummaryCard label="Pemilihan Aktif" value={summary.active} />
            <SummaryCard label="Belum Difinalisasi" value={summary.notFinalized} />
          </>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 3,
          mb: 4,
        }}
      >
        <QuickActionCard
          href="/dashboard/admin/candidates"
          title="Kandidat"
          desc="Kelola kandidat pada RT Anda"
          buttonLabel="Kelola Kandidat"
        />
        <QuickActionCard
          href="/dashboard/admin/elections"
          title="Pemilihan"
          desc="Buat, atur, dan finalisasi pemilihan"
          buttonLabel="Kelola Pemilihan"
        />
      </Box>

      <Paper sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="h6">Pemilihan Terakhir</Typography>
          <Chip label="Maks. 3 pemilihan" size="small" />
        </Stack>
        <Divider sx={{ mb: 1.5 }} />
        {loading ? (
          <>
            <Skeleton height={32} />
            <Skeleton height={32} />
            <Skeleton height={32} />
          </>
        ) : latestElections.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Belum ada data pemilihan.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nama Pemilihan</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {latestElections.map((election) => (
                <TableRow
                  key={election.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => router.push(`/dashboard/admin/elections/${encodeURIComponent(String(election.id))}`)}
                >
                  <TableCell>{election.name}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={election.status}
                      color={election.status === "active" ? "success" : election.status === "ended" ? "default" : "warning"}
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
