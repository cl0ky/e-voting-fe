
import * as yup from "yup";

export type RegisterFormData = {
    nikOrNim: string;
    email: string;
    password: string;
};

export const registerSchema = yup.object({
    nikOrNim: yup.string().required("NIK/NIM wajib diisi"),
    email: yup.string().email("Format email tidak valid").required("Email wajib diisi"),
    password: yup.string().min(6, "Minimal 6 karakter").required("Password wajib diisi"),
});