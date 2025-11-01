'use client';

import { ReactNode } from 'react';

import { amaniTheme } from '@amani-group-id/toolkit';
import { ThemeProvider } from '@mui/material';

export default function ThemeProviderWrapper({ children }: { children: Readonly<ReactNode> }) {
  return <ThemeProvider theme={amaniTheme({ isMobile: true })}>{children}</ThemeProvider>;
}
