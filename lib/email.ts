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

interface SendPasswordResetEmailParams {
  to: string;
  userName: string;
  resetUrl: string;
}

interface ResendError {
  message?: string;
  [key: string]: unknown;
}

interface ResendResponse {
  data?: { id?: string };
  id?: string;
  error?: ResendError;
  [key: string]: unknown;
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
  const fromEmail = process.env.EMAIL_FROM || "COD Coaching <onboarding@resend.dev>";

  try {
    console.log(`Envoi d'email à ${to} pour l'équipe ${teamName} depuis ${fromEmail}`);

    const result = await resend.emails.send({
      from: fromEmail,
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
                  <strong>Créez votre compte pour rejoindre l'équipe</strong><br>
                  Cliquez sur le bouton ci-dessous pour créer votre compte avec votre nom et mot de passe, puis rejoignez automatiquement l'équipe ${teamName}.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Créer mon compte et rejoindre l'équipe
                </a>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Si vous avez déjà un compte, connectez-vous d'abord puis utilisez le lien ci-dessus pour accepter l'invitation.
              </p>

              <p style="font-size: 14px; color: #666; margin-top: 10px;">
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

    // Resend v6 can return { data, error } or throw exceptions
    // Check for error property first
    if (result && 'error' in result && result.error) {
      const errorObj = result.error as ResendError;
      const errorMessage = errorObj?.message || JSON.stringify(errorObj);
      console.error("Erreur Resend lors de l'envoi de l'email:", errorMessage);
      console.error("Détails complets:", JSON.stringify({ to, from: fromEmail, teamName, error: errorObj }, null, 2));
      return { 
        success: false, 
        error: errorMessage,
      };
    }

    // Success case - result should have data property with id
    const emailId = (result as ResendResponse)?.data?.id || (result as ResendResponse)?.id;
    if (emailId) {
      console.log(`Email envoyé avec succès (ID: ${emailId}) à ${to}`);
      return { success: true, data: result };
    }

    // If we get here, something unexpected happened
    console.warn("Réponse Resend inattendue:", JSON.stringify(result, null, 2));
    return { success: true, data: result };
  } catch (error) {
    // Resend throws exceptions for errors
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'object' 
        ? JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
        : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("Exception Resend lors de l'envoi de l'email:");
    console.error("Message:", errorMessage);
    if (errorStack) {
      console.error("Stack:", errorStack);
    }
    console.error("Détails:", JSON.stringify({ to, from: fromEmail, teamName, error }, Object.getOwnPropertyNames(error || {}), 2));
    
    return { 
      success: false, 
      error: errorMessage,
    };
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
  const fromEmail = process.env.EMAIL_FROM || "COD Coaching <onboarding@resend.dev>";
  const toEmail = process.env.SUPPORT_EMAIL || "contact@codcoachingteams.com";

  try {
    console.log(`Envoi d'email de contact de ${name} (${email}) à ${toEmail}`);

    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
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

    // Resend v6 can return { data, error } or throw exceptions
    if (result && 'error' in result && result.error) {
      const errorObj = result.error as ResendError;
      const errorMessage = errorObj?.message || JSON.stringify(errorObj);
      console.error("Erreur Resend lors de l'envoi de l'email de contact:", errorMessage);
      console.error("Détails complets:", JSON.stringify({ from: email, to: toEmail, subject, error: errorObj }, null, 2));
      return { 
        success: false, 
        error: errorMessage,
      };
    }

    const emailId = (result as ResendResponse)?.data?.id || (result as ResendResponse)?.id;
    if (emailId) {
      console.log(`Email de contact envoyé avec succès (ID: ${emailId})`);
      return { success: true, data: result };
    }

    console.warn("Réponse Resend inattendue:", JSON.stringify(result, null, 2));
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'object' 
        ? JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
        : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("Exception Resend lors de l'envoi de l'email de contact:");
    console.error("Message:", errorMessage);
    if (errorStack) {
      console.error("Stack:", errorStack);
    }
    console.error("Détails:", JSON.stringify({ from: email, to: toEmail, subject, error }, Object.getOwnPropertyNames(error || {}), 2));
    
    return { 
      success: false, 
      error: errorMessage,
    };
  }
}

export async function sendPasswordResetEmail({
  to,
  userName,
  resetUrl,
}: SendPasswordResetEmailParams) {
  // Si Resend n'est pas configuré, ne pas envoyer d'email
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY non configurée, l'email ne sera pas envoyé");
    return { success: false, error: "Email service not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.EMAIL_FROM || "COD Coaching <onboarding@resend.dev>";

  try {
    console.log(`Envoi d'email de réinitialisation de mot de passe à ${to}`);

    const result = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: `Réinitialisation de votre mot de passe - COD Coaching Teams`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Réinitialisation de mot de passe</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Réinitialisation de mot de passe</h1>
            </div>

            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Bonjour ${userName},
              </p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Vous avez demandé à réinitialiser votre mot de passe pour votre compte COD Coaching Teams.
              </p>

              <div style="background: white; border-left: 4px solid #667eea; padding: 15px; margin: 25px 0; border-radius: 5px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong>⚠️ Important :</strong> Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Réinitialiser mon mot de passe
                </a>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
              </p>
              <p style="font-size: 12px; color: #999; word-break: break-all; background: white; padding: 10px; border-radius: 5px; margin: 10px 0;">
                ${resetUrl}
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
                Cet email a été envoyé par COD Coaching Teams<br>
                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    // Resend v6 can return { data, error } or throw exceptions
    if (result && 'error' in result && result.error) {
      const errorObj = result.error as ResendError;
      const errorMessage = errorObj?.message || JSON.stringify(errorObj);
      console.error("Erreur Resend lors de l'envoi de l'email de réinitialisation:", errorMessage);
      console.error("Détails complets:", JSON.stringify({ to, from: fromEmail, error: errorObj }, null, 2));
      return {
        success: false,
        error: errorMessage,
      };
    }

    const emailId = (result as ResendResponse)?.data?.id || (result as ResendResponse)?.id;
    if (emailId) {
      console.log(`Email de réinitialisation envoyé avec succès (ID: ${emailId}) à ${to}`);
      return { success: true, data: result };
    }

    console.warn("Réponse Resend inattendue:", JSON.stringify(result, null, 2));
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'object' 
        ? JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
        : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("Exception Resend lors de l'envoi de l'email de réinitialisation:");
    console.error("Message:", errorMessage);
    if (errorStack) {
      console.error("Stack:", errorStack);
    }
    console.error("Détails:", JSON.stringify({ to, from: fromEmail, error }, Object.getOwnPropertyNames(error || {}), 2));
    
    return { 
      success: false, 
      error: errorMessage,
    };
  }
}
