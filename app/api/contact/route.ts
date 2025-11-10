import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { z } from "zod";

// Schéma de validation pour le formulaire de contact
const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide"),
  subject: z.string().min(3, "Le sujet doit contenir au moins 3 caractères").max(200),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000),
});

// POST - Envoyer un message de contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Valider les données
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Envoyer l'email au support
    const emailResult = await sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    if (!emailResult.success) {
      console.error("Erreur lors de l'envoi de l'email de contact:", emailResult.error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi du message. Veuillez réessayer plus tard." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du traitement du message de contact:", error);
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer plus tard." },
      { status: 500 }
    );
  }
}
