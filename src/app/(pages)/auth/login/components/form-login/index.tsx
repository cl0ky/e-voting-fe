'use client';

import { Stack, TextField, Button, Typography, Link as MuiLink } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NextLink from "next/link";
import { LoginFormData, loginSchema } from "../schema";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { axiosPublic } from '@/lib';
import type { AxiosError } from 'axios';
import { useToast } from '@/providers/toast-provider';

const FormLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    });

    const router = useRouter();
    const toast = useToast();
    const [submitLoading, setSubmitLoading] = useState(false);

    function roleToPath(raw?: string) {
        if (!raw) return '/';
        const s = raw.toLowerCase();
        if (s.includes('super')) return '/dashboard/super-admin';
        if (s.includes('admin')) return '/dashboard/admin';
        if (s.includes('voter') || s.includes('pemilih')) return '/dashboard/voter';
        return '/';
    }

    const onSubmit = async (data: LoginFormData) => {
        setSubmitLoading(true);
        try {
            const res = await axiosPublic.post('/auth/login', {
                email_or_nik: data.emailOrNikOrNim,
                password: data.password,
            });
            const body = (res?.data ?? {}) as Record<string, unknown>;
            const message = typeof body.message === 'string' && body.message.length > 0
                ? body.message
                : 'Login berhasil';
            const roleRaw = body.role as string | undefined;
            const target = roleToPath(roleRaw);

            toast.success(`${message}! Mengarahkan…`, { autoHideDuration: 1000 });
            setTimeout(() => {
                router.push(target);
            }, 1000);
        } catch (e: unknown) {
            const err = e as AxiosError<unknown>;
            let msg = err.message || 'Login gagal.';
            const dataUnknown = err.response?.data as unknown;
            if (dataUnknown && typeof dataUnknown === 'object') {
                if ('error' in dataUnknown) {
                    const m = (dataUnknown as { error?: unknown }).error;
                    if (typeof m === 'string') msg = m;
                } else if ('message' in dataUnknown) {
                    const m = (dataUnknown as { message?: unknown }).message;
                    if (typeof m === 'string') msg = m;
                }
            }
            toast.error(msg);
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={4} sx={{ maxWidth: 360, mx: "auto", mt: 10 }}>
                <Typography variant="h5" textAlign="center">
                    Login Akun
                </Typography>

                <TextField
                    label="Email atau NIK/NIM"
                    type="text"
                    placeholder="contoh: user@mail.com atau 3201xxxxxxxxxxxx"
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

                <Button type="submit" variant="contained" fullWidth disabled={submitLoading}>
                    {submitLoading ? 'Memproses…' : 'Login'}
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
