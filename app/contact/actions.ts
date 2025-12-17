"use server";

import { sendContactEmail } from "@/lib/email";
import { z } from "zod";

// const resend = new Resend(process.env.RESEND_API_KEY); // Removed direct usage

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
});

export type ContactState = {
  success?: boolean;
  error?: string;
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  try {
    const result = await sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    if (!result.success) {
      // In production we might want to return a generic error, but for debugging result.error helps
      return {
        error:
          result.error || "Une erreur est survenue lors de l'envoi du message.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      error:
        "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
    };
  }
}
