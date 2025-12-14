import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const category = searchParams.get('category');

    // Validation des dates
    if (!start || !end) {
      return NextResponse.json(
        { error: 'Les paramètres start et end sont requis' },
        { status: 400 }
      );
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

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

    // Appeler la fonction RPC
    const { data, error } = await supabase.rpc('search_available_vehicles', {
      p_start: startDate.toISOString(),
      p_end: endDate.toISOString(),
      p_category: category || null,
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la recherche de véhicules', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ vehicles: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}



