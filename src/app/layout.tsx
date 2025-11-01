import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import QueryClientProviderWrapper from "./providers/query-client-provider";
import { Box, GlobalStyles } from "@mui/material";

export const metadata: Metadata = {
  title: "E-Voting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body
        style={{
          margin: 0,
          height: '100dvh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <AppRouterCacheProvider>
          <QueryClientProviderWrapper>
            <Box
              sx={{
                width: '30rem',
                minHeight: '100dvh',
                backgroundColor: '#e6f0ff',
                boxShadow: 3,
                position: 'relative',
              }}
            >
              <GlobalStyles
                styles={{
                  body: {
                    margin: 0,
                    fontFamily: 'var(--font-poppins)',
                  },
                }}
              />
              {children}
            </Box>
          </QueryClientProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

