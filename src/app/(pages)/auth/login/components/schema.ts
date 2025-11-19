import * as yup from "yup";

export interface LoginFormData {
    emailOrNikOrNim: string;
    password: string;
}

export const loginSchema = yup.object({
    emailOrNikOrNim: yup
        .string()
        .required("Email atau NIK/NIM wajib diisi"),
    password: yup
        .string()
        .min(4, "Password minimal 6 karakter")
        .required("Password wajib diisi"),
});
