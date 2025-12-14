import { Resend } from 'resend';

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  
  console.log('[EMAIL] Checking RESEND_API_KEY...');
  if (!apiKey) {
    console.error('[EMAIL] ❌ ERROR: RESEND_API_KEY is not set in environment variables');
    throw new Error('RESEND_API_KEY is not set in environment variables');
  }
  
  if (apiKey === 'your_resend_api_key' || apiKey.includes('your_')) {
    console.error('[EMAIL] ❌ ERROR: RESEND_API_KEY appears to be a placeholder. Please set a valid API key.');
    throw new Error('RESEND_API_KEY is not configured properly');
  }
  
  console.log('[EMAIL] ✅ RESEND_API_KEY found:', apiKey.substring(0, 10) + '...');
  
  return new Resend(apiKey);
}

export async function sendBookingConfirmationEmail(
  booking: {
    id: string;
    vehicleName: string;
    startAt: string;
    endAt: string;
    pickupLocation: string;
    returnLocation: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    babySeat: boolean;
    notes?: string;
    totalEstimatedEur: number;
  }
) {
  console.log('[EMAIL] ========================================');
  console.log('[EMAIL] sendBookingConfirmationEmail called for booking:', booking.id);
  
  const resend = getResendClient();
  
  // Utiliser onboarding@resend.dev par défaut (email de test Resend)
  const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const emailAdmin = process.env.EMAIL_ADMIN || 'onboarding@resend.dev';
  
  // Extraire l'email client depuis le booking (vient du formulaire)
  const clientEmail = booking.customerEmail;
  
  // Logs avant envoi
  console.log('[EMAIL] Client email:', clientEmail);
  console.log('[EMAIL] Admin email:', emailAdmin);
  console.log('[EMAIL] From:', emailFrom);
  
  if (!clientEmail || !clientEmail.includes('@')) {
    console.error('[EMAIL] ❌ ERROR: Invalid client email:', clientEmail);
    throw new Error('Invalid client email address');
  }

  const startDate = new Date(booking.startAt).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  const endDate = new Date(booking.endAt).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  // Email client
  const clientEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; }
        .total { font-size: 1.2em; font-weight: bold; color: #2563eb; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirmation de réservation</h1>
        </div>
        <div class="content">
          <p>Bonjour ${booking.customerName},</p>
          <p>Votre réservation a été enregistrée avec succès !</p>
          
          <h2>Détails de la réservation</h2>
          <div class="detail-row">
            <span class="label">Véhicule:</span> ${booking.vehicleName}
          </div>
          <div class="detail-row">
            <span class="label">Début:</span> ${startDate}
          </div>
          <div class="detail-row">
            <span class="label">Fin:</span> ${endDate}
          </div>
          <div class="detail-row">
            <span class="label">Lieu de prise en charge:</span> ${booking.pickupLocation}
          </div>
          <div class="detail-row">
            <span class="label">Lieu de retour:</span> ${booking.returnLocation}
          </div>
          ${booking.babySeat ? '<div class="detail-row"><span class="label">Siège bébé:</span> Oui</div>' : ''}
          ${booking.notes ? `<div class="detail-row"><span class="label">Notes:</span> ${booking.notes}</div>` : ''}
          
          <div class="total">
            Total estimé: ${booking.totalEstimatedEur} €
          </div>
          
          <p style="margin-top: 20px;">
            <strong>Numéro de réservation:</strong> ${booking.id}
          </p>
          
          <p style="margin-top: 20px;">
            Nous vous contacterons prochainement pour confirmer votre réservation.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Email admin
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; }
        .total { font-size: 1.2em; font-weight: bold; color: #dc2626; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouvelle réservation</h1>
        </div>
        <div class="content">
          <p>Une nouvelle réservation a été effectuée.</p>
          
          <h2>Détails de la réservation</h2>
          <div class="detail-row">
            <span class="label">ID:</span> ${booking.id}
          </div>
          <div class="detail-row">
            <span class="label">Véhicule:</span> ${booking.vehicleName}
          </div>
          <div class="detail-row">
            <span class="label">Début:</span> ${startDate}
          </div>
          <div class="detail-row">
            <span class="label">Fin:</span> ${endDate}
          </div>
          <div class="detail-row">
            <span class="label">Lieu de prise en charge:</span> ${booking.pickupLocation}
          </div>
          <div class="detail-row">
            <span class="label">Lieu de retour:</span> ${booking.returnLocation}
          </div>
          
          <h3>Informations client</h3>
          <div class="detail-row">
            <span class="label">Nom:</span> ${booking.customerName}
          </div>
          <div class="detail-row">
            <span class="label">Email:</span> ${booking.customerEmail}
          </div>
          <div class="detail-row">
            <span class="label">Téléphone:</span> ${booking.customerPhone}
          </div>
          ${booking.babySeat ? '<div class="detail-row"><span class="label">Siège bébé:</span> Oui</div>' : ''}
          ${booking.notes ? `<div class="detail-row"><span class="label">Notes:</span> ${booking.notes}</div>` : ''}
          
          <div class="total">
            Total estimé: ${booking.totalEstimatedEur} €
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log('[EMAIL] Sending email to client...');
  console.log('[EMAIL] Sending email to admin...');

  // Envoyer les deux emails SÉPARÉMENT (pas dans le même array)
  // Email 1: Client
  const clientResult = await resend.emails.send({
    from: emailFrom,
    to: clientEmail, // Email du client depuis le formulaire
    subject: `Confirmation de réservation - ${booking.vehicleName}`,
    html: clientEmailHtml,
  });

  // Email 2: Admin
  const adminResult = await resend.emails.send({
    from: emailFrom,
    to: emailAdmin, // Email admin depuis env
    subject: `Nouvelle réservation - ${booking.customerName}`,
    html: adminEmailHtml,
  });

  // Logs des résultats
  console.log('[EMAIL] Client result:', {
    success: !clientResult.error,
    error: clientResult.error ? JSON.stringify(clientResult.error, null, 2) : null,
    data: clientResult.data ? JSON.stringify(clientResult.data, null, 2) : null,
    emailId: clientResult.data?.id || null,
  });

  console.log('[EMAIL] Admin result:', {
    success: !adminResult.error,
    error: adminResult.error ? JSON.stringify(adminResult.error, null, 2) : null,
    data: adminResult.data ? JSON.stringify(adminResult.data, null, 2) : null,
    emailId: adminResult.data?.id || null,
  });

  // Gestion des erreurs
  if (clientResult.error) {
    const errorMessage = clientResult.error.message || JSON.stringify(clientResult.error);
    const errorDetails = {
      message: errorMessage,
      statusCode: clientResult.error.statusCode,
      name: clientResult.error.name,
      fullError: JSON.stringify(clientResult.error, null, 2),
    };
    
    console.error('[EMAIL] ❌ ERROR: Failed to send client email');
    console.error('[EMAIL] Error details:', errorDetails);
    console.error('[EMAIL] Full error object:', errorDetails.fullError);
    
    // Ne pas continuer silencieusement - l'erreur sera propagée
    throw new Error(`Client email failed: ${errorMessage}`);
  }

  if (adminResult.error) {
    const errorMessage = adminResult.error.message || JSON.stringify(adminResult.error);
    const errorDetails = {
      message: errorMessage,
      statusCode: adminResult.error.statusCode,
      name: adminResult.error.name,
      fullError: JSON.stringify(adminResult.error, null, 2),
    };
    
    console.error('[EMAIL] ❌ ERROR: Failed to send admin email');
    console.error('[EMAIL] Error details:', errorDetails);
    console.error('[EMAIL] Full error object:', errorDetails.fullError);
    
    throw new Error(`Admin email failed: ${errorMessage}`);
  }

  console.log('[EMAIL] ✅ Both emails sent successfully');
  console.log('[EMAIL] Client email ID:', clientResult.data?.id);
  console.log('[EMAIL] Admin email ID:', adminResult.data?.id);
  console.log('[EMAIL] ========================================');

  return { clientResult, adminResult };
}

// Alias pour compatibilité
export const sendBookingEmails = sendBookingConfirmationEmail;
