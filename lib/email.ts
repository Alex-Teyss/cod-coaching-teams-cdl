import { Resend } from "resend";

interface SendContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface SendInvitationEmailParams {
  to: string;
  teamName: string;
  coachName: string;
  invitationUrl: string;
}

interface SendPasswordResetEmailParams {
  to: string;
  userName: string;
  resetUrl: string;
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: SendContactEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY non configurée, l'email ne sera pas envoyé");
    return { success: false, error: "Email service not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.EMAIL_FROM || "COD Coaching <onboarding@resend.dev>";
  const toEmail = process.env.SUPPORT_EMAIL || "contact@codcoachingteams.com";

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `Message de ${name} (${email}):\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Nouveau message de contact</h2>
          <p><strong>De:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <hr />
          <p style="white-space: pre-wrap;">${message.replace(
            /\n/g,
            "<br>"
          )}</p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Erreur Resend:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error(
      "Exception Resend lors de l'envoi de l'email de contact:",
      error
    );
    return {
      success: false,
      error: "Erreur serveur lors de l'envoi de l'email",
    };
  }
}

export async function sendInvitationEmail({
  to,
  teamName,
  coachName,
  invitationUrl,
}: SendInvitationEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY non configurée, l'email ne sera pas envoyé");
    return { success: false, error: "Email service not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.EMAIL_FROM || "COD Coaching <onboarding@resend.dev>";

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Invitation à rejoindre l'équipe ${teamName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Invitation d'équipe</h2>
          <p>Bonjour,</p>
          <p>Le coach <strong>${coachName}</strong> vous invite à rejoindre l'équipe <strong>${teamName}</strong> sur COD Coaching Teams.</p>
          <p>Cliquez sur le lien ci-dessous pour accepter l'invitation :</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${invitationUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Rejoindre l'équipe</a>
          </p>
          <p>Si ce lien ne fonctionne pas, copiez-collez l'URL suivante dans votre navigateur :</p>
          <p><a href="${invitationUrl}">${invitationUrl}</a></p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Erreur Resend invitation:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Exception Resend invitation:", error);
    return {
      success: false,
      error: "Erreur serveur lors de l'envoi de l'invitation",
    };
  }
}

export async function sendPasswordResetEmail({
  to,
  userName,
  resetUrl,
}: SendPasswordResetEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY non configurée, l'email ne sera pas envoyé");
    return { success: false, error: "Email service not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.EMAIL_FROM || "COD Coaching <onboarding@resend.dev>";

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Réinitialisation de mot de passe</h2>
          <p>Bonjour ${userName},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Réinitialiser mon mot de passe</a>
          </p>
          <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Erreur Resend password reset:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Exception Resend password reset:", error);
    return {
      success: false,
      error: "Erreur serveur lors de l'envoi de l'email",
    };
  }
}
