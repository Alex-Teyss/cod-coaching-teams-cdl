import { Resend } from "resend";

interface SendInvitationEmailParams {
  to: string;
  teamName: string;
  coachName: string;
  invitationUrl: string;
}

interface SendContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendInvitationEmail({
  to,
  teamName,
  coachName,
  invitationUrl,
}: SendInvitationEmailParams) {
  // Si Resend n'est pas configuré, ne pas envoyer d'email
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY non configurée, l'email ne sera pas envoyé");
    return { success: false, error: "Email service not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log(`Envoi d'email à ${to} pour l'équipe ${teamName}`);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "COD Coaching <onboarding@resend.dev>",
      to: [to],
      subject: `Invitation à rejoindre l'équipe ${teamName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invitation à rejoindre ${teamName}</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎮 Invitation à rejoindre une équipe</h1>
            </div>

            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Bonjour,
              </p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                <strong>${coachName}</strong> vous invite à rejoindre l'équipe <strong>${teamName}</strong> sur COD Coaching Teams.
              </p>

              <div style="background: white; border-left: 4px solid #667eea; padding: 15px; margin: 25px 0; border-radius: 5px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong>À propos de COD Coaching Teams</strong><br>
                  Une plateforme pour gérer vos équipes Call of Duty et progresser ensemble.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Accepter l'invitation
                </a>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Si vous ne souhaitez pas rejoindre cette équipe, vous pouvez ignorer cet email.
                L'invitation expirera dans 7 jours.
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
                Cet email a été envoyé par COD Coaching Teams<br>
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                <a href="${invitationUrl}" style="color: #667eea; word-break: break-all;">${invitationUrl}</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Erreur Resend lors de l'envoi de l'email:", error);
      return { success: false, error };
    }

    console.log("Email envoyé avec succès:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Exception lors de l'envoi de l'email:", error);
    return { success: false, error };
  }
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: SendContactEmailParams) {
  // Si Resend n'est pas configuré, ne pas envoyer d'email
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY non configurée, l'email ne sera pas envoyé");
    return { success: false, error: "Email service not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log(`Envoi d'email de contact de ${name} (${email})`);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "COD Coaching <onboarding@resend.dev>",
      to: [process.env.SUPPORT_EMAIL || "contact@codcoachingteams.com"],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouveau message de contact</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">📧 Nouveau message de contact</h1>
            </div>

            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="margin-top: 0; color: #667eea; font-size: 20px;">Informations de l'expéditeur</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 30%;">Nom :</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Email :</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">Sujet :</td>
                    <td style="padding: 8px 0;">${subject}</td>
                  </tr>
                </table>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #667eea; font-size: 18px;">Message</h3>
                <p style="white-space: pre-wrap; margin: 0; color: #333; line-height: 1.8;">${message}</p>
              </div>

              <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 5px;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  <strong>💡 Action requise :</strong> Veuillez répondre à cet email pour contacter directement l'expéditeur.
                </p>
              </div>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
                Cet email a été envoyé automatiquement depuis le formulaire de contact de COD Coaching Teams<br>
                Date : ${new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Erreur Resend lors de l'envoi de l'email de contact:", error);
      return { success: false, error };
    }

    console.log("Email de contact envoyé avec succès:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Exception lors de l'envoi de l'email de contact:", error);
    return { success: false, error };
  }
}
