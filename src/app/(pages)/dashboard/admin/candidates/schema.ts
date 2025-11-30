import * as yup from 'yup';

export const candidateSchema = yup.object({
  name: yup.string().required('Nama kandidat wajib diisi'),
  vision: yup.string().max(1000, 'Visi maksimal 1000 karakter').optional(),
  mission: yup.string().max(1000, 'Misi maksimal 1000 karakter').optional(),
  photoFile: yup.mixed<File>().nullable().optional(),
});

export type CandidateFormValues = {
  name: string;
  vision?: string;
  mission?: string;
  photoFile?: File | null;
  electionId?: string;
};
