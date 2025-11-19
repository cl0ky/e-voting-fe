import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { GlobalStyles } from "@mui/material";
import { ToastProvider } from "@/providers/toast-provider";

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
      <body style={{ margin: 0, backgroundColor: '#f5f5f5' }}>
        <AppRouterCacheProvider>
            <ToastProvider>
              <GlobalStyles
                styles={{
                  body: {
                    margin: 0,
                    fontFamily: 'var(--font-poppins)',
                  },
                }}
              />
              {children}
            </ToastProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

