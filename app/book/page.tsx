'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Convertir les dates du query string au format ISO
  const getInitialDates = () => {
    const start = searchParams.get('start') || '';
    const end = searchParams.get('end') || '';
    
    // Si les dates sont au format datetime-local, les convertir en ISO
    let startISO = start;
    let endISO = end;
    
    if (start && !start.includes('T')) {
      // Format simple date, ajouter l'heure
      startISO = new Date(start).toISOString();
    } else if (start) {
      // Format datetime-local, convertir en ISO
      const startDate = new Date(start);
      if (!isNaN(startDate.getTime())) {
        startISO = startDate.toISOString();
      }
    }
    
    if (end && !end.includes('T')) {
      endISO = new Date(end).toISOString();
    } else if (end) {
      const endDate = new Date(end);
      if (!isNaN(endDate.getTime())) {
        endISO = endDate.toISOString();
      }
    }
    
    return { startISO, endISO };
  };

  const { startISO, endISO } = getInitialDates();

  const [formData, setFormData] = useState({
    vehicle_id: searchParams.get('vehicle_id') || '',
    start_at: startISO,
    end_at: endISO,
    pickup_location: searchParams.get('pickup') || '',
    return_location: searchParams.get('return') || '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    baby_seat: false,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      setBookingId(data.booking_id);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Réservation confirmée !
            </h1>
            <p className="text-gray-600 mb-4">
              Votre réservation a été enregistrée avec succès.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              <strong>Numéro de réservation:</strong> {bookingId}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Un email de confirmation a été envoyé à votre adresse email.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Nouvelle recherche
            </button>
          </div>
        </div>
      </div>
    );
  }

  const startDate = formData.start_at ? new Date(formData.start_at) : null;
  const endDate = formData.end_at ? new Date(formData.end_at) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finaliser votre réservation
          </h1>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Récapitulatif
          </h2>
          <div className="space-y-2 text-sm">
            {startDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Début:</span>
                <span className="font-medium">
                  {startDate.toLocaleString('fr-FR', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            )}
            {endDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Fin:</span>
                <span className="font-medium">
                  {endDate.toLocaleString('fr-FR', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Prise en charge:</span>
              <span className="font-medium">{formData.pickup_location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retour:</span>
              <span className="font-medium">{formData.return_location}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="customer_email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                id="customer_phone"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="baby_seat"
                name="baby_seat"
                checked={formData.baby_seat}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="baby_seat" className="ml-2 text-sm font-medium text-gray-700">
                Siège bébé
              </label>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Traitement...' : 'Confirmer la réservation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <BookPageContent />
    </Suspense>
  );
}

