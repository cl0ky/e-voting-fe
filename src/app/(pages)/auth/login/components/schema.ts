import * as yup from "yup";

export interface LoginFormData {
    emailOrNikOrNim: string;
    password: string;
}

export const loginSchema = yup.object({
    emailOrNikOrNim: yup
        .string()
        .email("Format email tidak valid")
        .required("Email wajib diisi"),
    password: yup
        .string()
        .min(6, "Password minimal 6 karakter")
        .required("Password wajib diisi"),
});
