import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { sendBookingEmails } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicle_id,
      start_at,
      end_at,
      pickup_location,
      return_location,
      customer_name,
      customer_email,
      customer_phone,
      baby_seat = false,
      notes = '',
    } = body;

    // Validation des champs requis
    if (
      !vehicle_id ||
      !start_at ||
      !end_at ||
      !pickup_location ||
      !return_location ||
      !customer_name ||
      !customer_email ||
      !customer_phone
    ) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation des dates
    const startDate = new Date(start_at);
    const endDate = new Date(end_at);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Format de date invalide' },
        { status: 400 }
      );
    }

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'La date de fin doit être postérieure à la date de début' },
        { status: 400 }
      );
    }

    if (startDate < new Date()) {
      return NextResponse.json(
        { error: 'La date de début ne peut pas être dans le passé' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Récupérer les informations du véhicule et calculer le total
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('id, name, category, deposit_eur')
      .eq('id', vehicle_id)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json(
        { error: 'Véhicule introuvable' },
        { status: 404 }
      );
    }

    // Calculer le nombre de jours
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < 1) {
      return NextResponse.json(
        { error: 'La durée minimale est de 1 jour' },
        { status: 400 }
      );
    }

    // Récupérer le tarif approprié
    const { data: rates, error: ratesError } = await supabase
      .from('vehicle_rates')
      .select('price_per_day_eur')
      .eq('vehicle_id', vehicle_id)
      .lte('min_days', days)
      .or(`max_days.is.null,max_days.gte.${days}`)
      .order('price_per_day_eur', { ascending: true })
      .limit(1);

    if (ratesError || !rates || rates.length === 0) {
      return NextResponse.json(
        { error: 'Aucun tarif disponible pour cette durée' },
        { status: 400 }
      );
    }

    const pricePerDay = rates[0].price_per_day_eur;
    const totalEstimated = pricePerDay * days + vehicle.deposit_eur;

    // Insérer la réservation
    // La contrainte d'exclusion de la DB empêchera les chevauchements
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        vehicle_id,
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        pickup_location,
        return_location,
        customer_name,
        customer_email,
        customer_phone,
        baby_seat,
        notes: notes || null,
        total_estimated_eur: totalEstimated,
        status: 'pending',
      })
      .select()
      .single();

    if (bookingError) {
      // Vérifier si c'est une erreur de chevauchement
      if (bookingError.code === '23P01' || bookingError.message.includes('exclusion')) {
        return NextResponse.json(
          {
            error: 'Ce véhicule n\'est plus disponible pour ces dates. Veuillez choisir d\'autres dates.',
          },
          { status: 409 }
        );
      }

      console.error('Booking insert error:', bookingError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la réservation', details: bookingError.message },
        { status: 500 }
      );
    }

    if (!booking) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la réservation' },
        { status: 500 }
      );
    }

    // Envoyer les emails
    // L'email client vient directement du formulaire (customer_email)
    console.log('[API] ========================================');
    console.log('[API] Sending booking confirmation emails...');
    console.log('[API] Client email from booking form:', customer_email);
    console.log('[API] Admin email from env:', process.env.EMAIL_ADMIN || 'onboarding@resend.dev');
    
    try {
      await sendBookingEmails({
        id: booking.id,
        vehicleName: vehicle.name,
        startAt: startDate.toISOString(),
        endAt: endDate.toISOString(),
        pickupLocation: pickup_location,
        returnLocation: return_location,
        customerName: customer_name,
        customerEmail: customer_email, // Email client depuis le formulaire
        customerPhone: customer_phone,
        babySeat: baby_seat,
        notes: notes || undefined,
        totalEstimatedEur: totalEstimated,
      });
      console.log('[API] ✅ Booking confirmation emails sent successfully');
      console.log('[API] ========================================');
    } catch (emailError) {
      console.error('[API] ❌ Email sending error:', emailError);
      console.error('[API] Error details:', {
        message: emailError instanceof Error ? emailError.message : String(emailError),
        stack: emailError instanceof Error ? emailError.stack : undefined,
      });
      console.log('[API] ========================================');
      
      // Si l'email client échoue, retourner une erreur 500
      if (emailError instanceof Error && emailError.message.includes('Client email failed')) {
        return NextResponse.json(
          { error: 'Client email failed', details: emailError.message },
          { status: 500 }
        );
      }
      
      // Pour les autres erreurs d'email, on continue (réservation créée)
      // Mais on log l'erreur pour debugging
    }

    return NextResponse.json({
      booking_id: booking.id,
      total_estimated_eur: totalEstimated,
      message: 'Réservation créée avec succès',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


