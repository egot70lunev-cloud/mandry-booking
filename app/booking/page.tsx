'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Vehicle {
  vehicle_id: string;
  name: string;
  category: string;
  deposit_eur: number;
  min_price_per_day_eur: number;
  estimated_total_eur: number;
}

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === '1';
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [category, setCategory] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set html/body height to 100% in embed mode
  useEffect(() => {
    if (isEmbed) {
      document.documentElement.style.height = '100%';
      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
      document.body.style.height = '100%';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      if (isEmbed) {
        document.documentElement.style.height = '';
        document.documentElement.style.margin = '';
        document.documentElement.style.padding = '';
        document.body.style.height = '';
        document.body.style.margin = '';
        document.body.style.padding = '';
        document.body.style.overflow = '';
      }
    };
  }, [isEmbed]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!start || !end || !pickupLocation || !returnLocation) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        ...(category && { category }),
      });

      const response = await fetch(`/api/available?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la recherche');
      }

      setVehicles(data.vehicles || []);
      if (data.vehicles && data.vehicles.length === 0) {
        setError('Aucun véhicule disponible pour ces dates');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (vehicle: Vehicle) => {
    const params = new URLSearchParams({
      vehicle_id: vehicle.vehicle_id,
      start: start,
      end: end,
      pickup: pickupLocation,
      return: returnLocation,
      ...(isEmbed && { embed: '1' }),
    });
    router.push(`/book?${params}`);
  };

  const bookingContent = (
    <>
      {!isEmbed && (
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mandry Booking
          </h1>
          <p className="text-gray-600">Réservez votre véhicule en quelques clics</p>
        </header>
      )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                  Date et heure de début *
                </label>
                <input
                  type="datetime-local"
                  id="start"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                  Date et heure de fin *
                </label>
                <input
                  type="datetime-local"
                  id="end"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de prise en charge *
                </label>
                <input
                  type="text"
                  id="pickup"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Ex: Aéroport de Paris"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="return" className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de retour *
                </label>
                <input
                  type="text"
                  id="return"
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                  placeholder="Ex: Aéroport de Paris"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie (optionnel)
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  <option value="economy">Économique</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxe</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Recherche en cours...' : 'Rechercher'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {vehicles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Véhicules disponibles ({vehicles.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.vehicle_id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {vehicle.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 capitalize">
                    {vehicle.category}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix/jour:</span>
                      <span className="font-semibold">{vehicle.min_price_per_day_eur} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dépôt:</span>
                      <span className="font-semibold">{vehicle.deposit_eur} €</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-900 font-bold">Total estimé:</span>
                      <span className="text-blue-600 font-bold text-lg">
                        {vehicle.estimated_total_eur} €
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBook(vehicle)}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Réserver
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );

    if (isEmbed) {
      return (
        <div className="h-full w-full bg-white overflow-auto">
          <div className="w-full max-w-6xl mx-auto px-4 py-8">
            {bookingContent}
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {bookingContent}
        </div>
      </div>
    );
  }

  export default function BookingPage() {
    return (
      <Suspense fallback={
        <div className="h-full w-full flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }>
        <BookingPageContent />
      </Suspense>
    );
  }



