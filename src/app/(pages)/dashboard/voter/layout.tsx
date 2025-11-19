"use client";

import { Box } from '@mui/material';

export default function VoterLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          width: '30rem',
          minHeight: '100dvh',
          backgroundColor: '#e6f0ff',
          boxShadow: 3,
          position: 'relative',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
