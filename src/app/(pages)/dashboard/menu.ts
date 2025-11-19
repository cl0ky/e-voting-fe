export type Role = 'super-admin' | 'admin' | 'voter';

export type MenuItem = {
  label: string;
  href: string;
  roles: Role[]; // allowed roles
};

export const DASHBOARD_MENU: MenuItem[] = [
  // Common
  { label: '🏠 Beranda', href: '/dashboard', roles: ['super-admin', 'admin', 'voter'] },

  // Admin RT
  { label: '🏠 Dashboard', href: '/dashboard/admin', roles: ['admin'] },
  { label: '🧔 Kandidat', href: '/dashboard/admin/candidates', roles: ['admin'] },
  { label: '🗳️ Pemilihan', href: '/dashboard/admin/elections', roles: ['admin'] },
  { label: '📊 Hasil', href: '/dashboard/admin/results', roles: ['admin'] },

  // Super Admin (placeholder)
  { label: '🧑‍💼 Data Pengguna', href: '/dashboard/super-admin', roles: ['super-admin'] },

  // Voter
  { label: '🗳️ Surat Suara Saya', href: '/dashboard/voter', roles: ['voter'] },
];
