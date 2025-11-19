"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const onLogout = () => {
    localStorage.removeItem('token');
    router.replace('/auth/login');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Dashboard - Super Admin</Typography>
        <Typography variant="body1">Selamat datang, Super Admin.</Typography>
        <Button variant="outlined" onClick={onLogout}>Logout</Button>
      </Stack>
    </Box>
  );
}
