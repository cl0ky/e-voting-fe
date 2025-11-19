'use client';

import { Stack, TextField, Button, Typography, Link as MuiLink } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NextLink from "next/link";
import { RegisterFormData, registerSchema } from "./schema";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { axiosPublic } from '@/lib';
import type { AxiosError } from 'axios';
import { getRTs, RT } from '@/lib';
import { MenuItem, CircularProgress } from '@mui/material';
import { useToast } from '@/providers/toast-provider';

export default function FormRegister() {
    const router = useRouter();
    const toast = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
    });
                    
    const [submitLoading, setSubmitLoading] = useState(false);

    const onSubmit = async (data: RegisterFormData) => {
        setSubmitLoading(true);
        try {
            await axiosPublic.post('/auth/register', {
                name: data.name,
                email: data.email,
                password: data.password,
                nik: data.nik,
                rt_id: data.rt,
            });
            toast.success('Registrasi berhasil! Mengarahkan ke halaman login…', { autoHideDuration: 1200 });
            // Redirect ke halaman login setelah toast singkat
            setTimeout(() => {
                router.push('/auth/login');
            }, 1000);
        } catch (e: unknown) {
            const err = e as AxiosError<unknown>;
            let msg = err.message || 'Registrasi gagal.';
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

    const [rts, setRts] = useState<RT[]>([]);
    const [loadingRts, setLoadingRts] = useState(false);
    const [errorRts, setErrorRts] = useState<string | null>(null);

    useEffect(() => {
        setLoadingRts(true);
        getRTs()
            .then((res: RT[]) => setRts(res))
            .catch((err: unknown) => setErrorRts((err as Error)?.message || 'Gagal fetch RTs'))
            .finally(() => setLoadingRts(false));
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={4} sx={{ maxWidth: 360, mx: "auto", mt: 10 }}>
                <Typography variant="h5" textAlign="center">
                    Pendaftaran Akun
                </Typography>

                <TextField
                    label="Nama Lengkap"
                    type="text"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                />

                <TextField
                    label="NIK"
                    type="text"
                    {...register("nik")}
                    error={!!errors.nik}
                    helperText={errors.nik?.message}
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


                <TextField
                    select
                    label="RT"
                    {...register("rt")}
                    error={!!errors.rt}
                    helperText={errors.rt?.message}
                    fullWidth
                    disabled={loadingRts}
                    SelectProps={{
                        displayEmpty: true,
                        MenuProps: {
                            PaperProps: {
                                sx: {
                                    width: '20%',
                                    maxHeight: 320,
                                    overflowX: 'auto',
                                    overflowY: 'auto',
                                },
                            },
                            MenuListProps: {
                                sx: {
                                    whiteSpace: 'nowrap',
                                    pr: 77,
                                },
                            },
                        },
                    }}
                >
                    {loadingRts && (
                        <MenuItem value="" disabled>
                            <CircularProgress size={20} /> Loading RTs...
                        </MenuItem>
                    )}
                    {errorRts && (
                        <MenuItem value="" disabled>
                            {errorRts}
                        </MenuItem>
                    )}
                    {!loadingRts && !errorRts && rts.length === 0 && (
                        <MenuItem value="" disabled>
                            Tidak ada data RT
                        </MenuItem>
                    )}
                    {rts.map((rt) => (
                        <MenuItem key={rt.id} value={rt.id}>
                            {rt.name} {rt.region ? `- ${rt.region}` : ''}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Global toasts are handled by ToastProvider; no local Snackbars needed */}

                <Button type="submit" variant="contained" fullWidth disabled={submitLoading}>
                    {submitLoading ? 'Memproses…' : 'Daftar'}
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
