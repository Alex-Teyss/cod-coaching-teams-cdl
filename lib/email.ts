import { Resend } from "resend";

interface SendInvitationEmailParams {
  to: string;
  teamName: string;
  coachName: string;
  invitationUrl: string;
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
