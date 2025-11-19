'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { axiosPrivate } from '@/lib';

function normalizeRole(raw?: string) {
  if (!raw) return undefined;
  const s = raw.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');
  if (s.includes('superadmin')) return 'super-admin';
  if (s.includes('admin')) return 'admin';
  if (s.includes('voter') || s.includes('pemilih')) return 'voter';
  return undefined;
}

function pathForRole(role?: string) {
  switch (role) {
    case 'Super Admin':
      return '/dashboard/super-admin';
    case 'Admin':
      return '/dashboard/admin';
    case 'Voter':
      return '/dashboard/voter';
    default:
      return '/';
  }
}

export default function RoleRedirect({ fallback = '/auth/login' }: { fallback?: string }) {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosPrivate.get('/auth/profile');
        const data = (res?.data ?? {}) as Record<string, unknown>;
        const role = normalizeRole(
          (data.role as string | undefined)
          ?? ((data.user as Record<string, unknown> | undefined)?.role as string | undefined)
          ?? ((data.data as Record<string, unknown> | undefined)?.role as string | undefined)
        );
        const href = pathForRole(role);
        router.replace(href);
      } catch {
        router.replace(fallback);
      }
    })();
  }, [fallback, router]);

  return null;
}
