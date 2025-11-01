'use client';

import { Stack, TextField, Button, Typography, Link as MuiLink } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NextLink from "next/link";
import { LoginFormData, loginSchema } from "../schema";

const FormLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        console.log("Login Data:", data);
        // TODO: panggil API login di sini
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={4} sx={{ maxWidth: 360, mx: "auto", mt: 10 }}>
                <Typography variant="h5" textAlign="center">
                    Login Akun
                </Typography>

                <TextField
                    label="Email atau NIK/NIM"
                    type="emailOrNikOrNim"
                    {...register("emailOrNikOrNim")}
                    error={!!errors.emailOrNikOrNim}
                    helperText={errors.emailOrNikOrNim?.message}
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
                    Login
                </Button>

                <Typography variant="body2" textAlign="center">
                    Belum punya akun?{" "}
                    <MuiLink component={NextLink} href="/auth/register" underline="hover">
                        Daftar di sini
                    </MuiLink>
                </Typography>
            </Stack>
        </form>
    );
};

export default FormLogin;
