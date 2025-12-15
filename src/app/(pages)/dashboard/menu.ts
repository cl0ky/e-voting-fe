export type Role = 'super-admin' | 'admin' | 'voter';

export type MenuItem = {
  label: string;
  href: string;
  roles: Role[]; // allowed roles
};

export const DASHBOARD_MENU: MenuItem[] = [
  // Admin RT
  { label: '🏠 Dashboard', href: '/dashboard/admin', roles: ['admin'] },
  { label: '🧔 Kandidat', href: '/dashboard/admin/candidates', roles: ['admin'] },
  { label: '🗳️ Pemilihan', href: '/dashboard/admin/elections', roles: ['admin'] },

  // Super Admin (placeholder)
  { label: '🧑‍💼 Data Pengguna', href: '/dashboard/super-admin', roles: ['super-admin'] },

  // Voter
  { label: '🗳️ Surat Suara Saya', href: '/dashboard/voter', roles: ['voter'] },
];
