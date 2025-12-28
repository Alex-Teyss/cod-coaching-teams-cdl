import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, "Le nom d'utilisateur est requis")
      .min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères")
      .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères"),
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Format d'email invalide"),
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
    role: z.enum(["COACH", "PLAYER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export const playerOnboardingSchema = z
  .object({
    username: z
      .string()
      .min(1, "Le nom d'utilisateur est requis")
      .min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères")
      .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères"),
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type PlayerOnboardingFormData = z.infer<typeof playerOnboardingSchema>
