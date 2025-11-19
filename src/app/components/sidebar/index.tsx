"use client";

import { List, ListItemButton, ListItemText, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MenuItem, Role } from '@/app/(pages)/dashboard/menu';

export default function Sidebar({ items, role }: { items: MenuItem[]; role: Role }) {
  const pathname = usePathname();
  const visible = items.filter(i => i.roles.includes(role));
  return (
    <Box component="nav" sx={{ width: 260, borderRight: '1px solid #e0e0e0', height: '100dvh', p: 1, backgroundColor: '#fff' }}>
      <List>
        {visible.map((item) => {
          const active = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/dashboard');
          return (
            <ListItemButton key={item.href} component={Link} href={item.href} selected={!!active}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
