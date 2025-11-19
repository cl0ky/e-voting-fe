"use client";

import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/lib';
import Sidebar from '@/app/components/sidebar';
import { DASHBOARD_MENU, type Role } from './menu';

function normalizeRole(raw?: string): Role | undefined {
  if (!raw) return undefined;
  const s = raw.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');
  if (s.includes('superadmin')) return 'super-admin';
  if (s.includes('admin')) return 'admin';
  if (s.includes('voter') || s.includes('pemilih')) return 'voter';
  return undefined;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosPrivate.get('/auth/profile');
        const data = (res?.data ?? {}) as Record<string, unknown>;
        const r = normalizeRole(
          (data.role as string | undefined)
          ?? ((data.user as Record<string, unknown> | undefined)?.role as string | undefined)
          ?? ((data.data as Record<string, unknown> | undefined)?.role as string | undefined)
        );
        setRole(r);
      } catch {
        // axiosPrivate interceptor will redirect to /auth/login on 401
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!role) {
    // In case role cannot be determined but user is authenticated
    return (
      <Box sx={{ p: 4 }}>Role tidak ditemukan.</Box>
    );
  }

  // Untuk voter: jangan render sidebar dan jangan paksa layout full-width,
  // biarkan nested layout voter menangani tampilan mobile/HP.
  if (role === 'voter') {
    return <>{children}</>;
  }

  // Admin & Super Admin: dashboard full-width dengan sidebar
  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', backgroundColor: '#f5f7fb' }}>
      <Sidebar items={DASHBOARD_MENU} role={role} />
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
