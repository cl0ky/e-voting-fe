"use client";

import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Stack, TextField, Typography, Avatar } from '@mui/material';
import { candidateSchema, type CandidateFormValues } from '../schema';

export type CandidateFormProps = {
  title?: string;
  initialValues?: Partial<CandidateFormValues> & { photoUrl?: string };
  loading?: boolean;
  onSubmit: (values: CandidateFormValues) => Promise<void> | void;
  onCancel?: () => void;
};

export default function CandidateForm({ title = 'Kandidat', initialValues, loading, onSubmit, onCancel }: CandidateFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<CandidateFormValues>({
    resolver: yupResolver(candidateSchema) as Resolver<CandidateFormValues>,
    defaultValues: {
      name: initialValues?.name ?? '',
      vision: initialValues?.vision ?? '',
      mission: initialValues?.mission ?? '',
      photoFile: initialValues?.photoFile ?? null,
      year: (initialValues?.year as number | undefined) ?? new Date().getFullYear(),
    },
  });

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialValues?.photoUrl);

  useEffect(() => {
    reset({
      name: initialValues?.name ?? '',
      vision: initialValues?.vision ?? '',
      mission: initialValues?.mission ?? '',
      photoFile: null,
      year: (initialValues?.year as number | undefined) ?? new Date().getFullYear(),
    });
    setPreviewUrl(initialValues?.photoUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.name, initialValues?.vision, initialValues?.mission, initialValues?.photoUrl]);

  const photoFile = watch('photoFile');

  useEffect(() => {
    if (photoFile instanceof File) {
      const url = URL.createObjectURL(photoFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [photoFile]);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValue('photoFile', file || null, { shouldValidate: true });
  };

  const submit = async (values: CandidateFormValues) => {
    await onSubmit(values);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(submit)} noValidate>
      <Stack spacing={2}>
        <Typography variant="h6">{title}</Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={previewUrl} sx={{ width: 64, height: 64 }} />
          <Button component="label" variant="outlined">
            Pilih Foto
            <input type="file" hidden accept="image/*" onChange={handlePick} />
          </Button>
        </Stack>

        <TextField
          label="Nama"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
        />

        <TextField
          label="Tahun"
          type="number"
          inputProps={{ min: 2000, max: 2100 }}
          {...register('year', { valueAsNumber: true })}
          error={!!errors.year}
          helperText={errors.year?.message}
          fullWidth
        />

        <TextField
          label="Visi"
          {...register('vision')}
          error={!!errors.vision}
          helperText={errors.vision?.message}
          fullWidth
          multiline
          minRows={2}
        />

        <TextField
          label="Misi"
          {...register('mission')}
          error={!!errors.mission}
          helperText={errors.mission?.message}
          fullWidth
          multiline
          minRows={3}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {onCancel && (
            <Button type="button" variant="text" onClick={onCancel} disabled={loading}>
              Batal
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Menyimpan…' : 'Simpan'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
