import { Stack } from "@mui/material";

export default function LayoutPage({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Stack>
            {children}
        </Stack>
    )
}