'use client';

import { Stack, TextField, Button, Typography, Link as MuiLink } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NextLink from "next/link";
import { RegisterFormData, registerSchema } from "./schema";

export default function FormRegister() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormData) => {
        console.log("Form Data:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={4} sx={{ maxWidth: 360, mx: "auto", mt: 10 }}>
                <Typography variant="h5" textAlign="center">
                    Pendaftaran Akun
                </Typography>

                <TextField
                    label="NIK/NIM"
                    type="nikOrNim"
                    {...register("nikOrNim")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                />

                <TextField
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                />

                <TextField
                    label="Password"
                    type="password"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                />

                <Button type="submit" variant="contained" fullWidth>
                    Daftar
                </Button>

                <Typography variant="body2" textAlign="center">
                    Sudah punya akun?{" "}
                    <MuiLink component={NextLink} href="/auth/login" underline="hover">
                        Login di sini
                    </MuiLink>
                </Typography>
            </Stack>
        </form>
    );
}
