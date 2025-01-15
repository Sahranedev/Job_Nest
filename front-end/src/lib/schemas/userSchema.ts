import { z } from "zod";

export const registrationSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Veuillez entrer une adresse email valide." }),
    password: z.string().min(6, {
      message: "Le mot de passe doit comporter au moins 6 caractères.",
    }),
    confirmPassword: z.string(),
    firstName: z.string().min(1, { message: "Le prénom est requis." }),
    lastName: z.string().min(1, { message: "Le nom est requis." }),
    phoneNumber: z
      .string()
      .min(10, { message: "Veuillez entrer un numéro de téléphone valide." }),
    city: z.string().min(1, { message: "La ville est requise." }),
    address: z.string().min(1, { message: "L'adresse est requise." }),
    age: z
      .number()
      .min(0, { message: "L'âge doit être un nombre positif." })
      .optional(),
    role: z.enum(["CANDIDATE", "RECRUITER", "ADMIN"], {
      message: "Veuillez choisir un rôle valide.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });
