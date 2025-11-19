
import * as yup from "yup";

export type RegisterFormData = {
    name: string;
    nik: string;
    email: string;
    password: string;
    rt: string;
};

export const registerSchema = yup.object({
    name: yup.string().required("Nama wajib diisi"),
    nik: yup.string().required("NIK wajib diisi"),
    email: yup.string().email("Format email tidak valid").required("Email wajib diisi"),
    password: yup.string().min(6, "Minimal 6 karakter").required("Password wajib diisi"),
    rt: yup.string().required("RT wajib diisi"),
});