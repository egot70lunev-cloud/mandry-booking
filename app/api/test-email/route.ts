import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  try {
    console.log('[TEST-EMAIL] ========================================');
    console.log('[TEST-EMAIL] Starting email test...');
    
    // Lire les variables d'environnement
    const apiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const emailAdmin = process.env.EMAIL_ADMIN || 'onboarding@resend.dev';
    
    console.log('[TEST-EMAIL] Environment variables:');
    console.log('[TEST-EMAIL] - RESEND_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
    console.log('[TEST-EMAIL] - EMAIL_FROM:', emailFrom);
    console.log('[TEST-EMAIL] - EMAIL_ADMIN:', emailAdmin);
    
    if (!apiKey) {
      const error = 'RESEND_API_KEY is not set in environment variables';
      console.error('[TEST-EMAIL] ❌ ERROR:', error);
      return NextResponse.json(
        { ok: false, error },
        { status: 500 }
      );
    }
    
    if (apiKey === 'your_resend_api_key' || apiKey.includes('your_')) {
      const error = 'RESEND_API_KEY appears to be a placeholder. Please set a valid API key.';
      console.error('[TEST-EMAIL] ❌ ERROR:', error);
      return NextResponse.json(
        { ok: false, error },
        { status: 500 }
      );
    }
    
    // Initialiser Resend
    console.log('[TEST-EMAIL] Initializing Resend client...');
    const resend = new Resend(apiKey);
    
    // Préparer l'email
    const emailData = {
      from: emailFrom,
      to: emailAdmin,
      subject: 'Test Resend OK',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 8px; }
            .success { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">✅ Test Email Successful</h1>
            <p>This is a test email sent from the Mandry Booking application.</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>From:</strong> ${emailFrom}</p>
            <p><strong>To:</strong> ${emailAdmin}</p>
            <p>If you receive this email, Resend is working correctly! 🎉</p>
          </div>
        </body>
        </html>
      `,
    };
    
    console.log('[TEST-EMAIL] Email data prepared:');
    console.log('[TEST-EMAIL] - From:', emailData.from);
    console.log('[TEST-EMAIL] - To:', emailData.to);
    console.log('[TEST-EMAIL] - Subject:', emailData.subject);
    
    // Envoyer l'email
    console.log('[TEST-EMAIL] Sending email via Resend...');
    const result = await resend.emails.send(emailData);
    
    console.log('[TEST-EMAIL] Resend API response received');
    console.log('[TEST-EMAIL] Result object:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      const errorDetails = {
        message: result.error.message || 'Unknown error',
        statusCode: (result.error as any).statusCode || 'N/A',
        name: (result.error as any).name || 'N/A',
        fullError: JSON.stringify(result.error, null, 2),
      };
      
      console.error('[TEST-EMAIL] ❌ ERROR: Email sending failed');
      console.error('[TEST-EMAIL] Error details:', errorDetails);
      console.error('[TEST-EMAIL] Status Code:', errorDetails.statusCode);
      console.error('[TEST-EMAIL] Error Message:', errorDetails.message);
      console.error('[TEST-EMAIL] Full error object:', errorDetails.fullError);
      
      return NextResponse.json(
        {
          ok: false,
          error: {
            message: errorDetails.message,
            statusCode: errorDetails.statusCode,
            name: errorDetails.name,
          },
        },
        { status: 500 }
      );
    }
    
    console.log('[TEST-EMAIL] ✅ SUCCESS: Email sent successfully!');
    console.log('[TEST-EMAIL] Email ID:', result.data?.id);
    console.log('[TEST-EMAIL] Full response data:', JSON.stringify(result.data, null, 2));
    console.log('[TEST-EMAIL] ========================================');
    
    return NextResponse.json({
      ok: true,
      data: {
        id: result.data?.id,
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        message: 'Email sent successfully',
      },
    });
  } catch (error) {
    console.error('[TEST-EMAIL] ❌ EXCEPTION: Unexpected error occurred');
    console.error('[TEST-EMAIL] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[TEST-EMAIL] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[TEST-EMAIL] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[TEST-EMAIL] Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.log('[TEST-EMAIL] ========================================');
    
    return NextResponse.json(
      {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          type: error instanceof Error ? error.constructor.name : typeof error,
        },
      },
      { status: 500 }
    );
  }
}

