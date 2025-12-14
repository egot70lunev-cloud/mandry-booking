# Schéma SQL pour Supabase SQL Editor

Copiez-collez le contenu ci-dessous dans le **SQL Editor** de Supabase et exécutez-le.

---

```sql
-- Extension pour les contraintes d'exclusion
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Table vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    category text NOT NULL,
    deposit_eur integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Table vehicle_rates
CREATE TABLE IF NOT EXISTS vehicle_rates (
    id bigserial PRIMARY KEY,
    vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    min_days int NOT NULL,
    max_days int NULL, -- NULL = illimité
    price_per_day_eur int NOT NULL
);

-- Table bookings
CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    start_at timestamptz NOT NULL,
    end_at timestamptz NOT NULL,
    pickup_location text NOT NULL,
    return_location text NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    baby_seat boolean DEFAULT false,
    notes text,
    total_estimated_eur int NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz DEFAULT now()
);

-- Contrainte d'exclusion pour empêcher les chevauchements
-- Utilise tstzrange avec '[)' (inclusif au début, exclusif à la fin)
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_range ON bookings USING GIST (vehicle_id, tstzrange(start_at, end_at, '[)'));

ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_no_overlap;

ALTER TABLE bookings
ADD CONSTRAINT bookings_no_overlap
EXCLUDE USING GIST (
    vehicle_id WITH =,
    tstzrange(start_at, end_at, '[)') WITH &&
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_rates_vehicle_id ON vehicle_rates(vehicle_id);

-- Fonction RPC pour rechercher les véhicules disponibles
CREATE OR REPLACE FUNCTION public.search_available_vehicles(
    p_start timestamptz,
    p_end timestamptz,
    p_category text DEFAULT NULL
)
RETURNS TABLE (
    vehicle_id uuid,
    name text,
    category text,
    deposit_eur integer,
    min_price_per_day_eur integer,
    estimated_total_eur integer
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_days integer;
BEGIN
    -- Calculer le nombre de jours (arrondi à l'entier supérieur)
    v_days := CEIL(EXTRACT(EPOCH FROM (p_end - p_start)) / 86400);
    IF v_days < 1 THEN
        v_days := 1;
    END IF;

    RETURN QUERY
    SELECT 
        v.id AS vehicle_id,
        v.name,
        v.category,
        v.deposit_eur,
        COALESCE(
            (SELECT MIN(vr.price_per_day_eur)
             FROM vehicle_rates vr
             WHERE vr.vehicle_id = v.id
               AND vr.min_days <= v_days
               AND (vr.max_days IS NULL OR vr.max_days >= v_days)),
            0
        ) AS min_price_per_day_eur,
        (COALESCE(
            (SELECT MIN(vr.price_per_day_eur)
             FROM vehicle_rates vr
             WHERE vr.vehicle_id = v.id
               AND vr.min_days <= v_days
               AND (vr.max_days IS NULL OR vr.max_days >= v_days)),
            0
        ) * v_days + v.deposit_eur) AS estimated_total_eur
    FROM vehicles v
    WHERE (p_category IS NULL OR v.category = p_category)
      AND v.id NOT IN (
          -- Exclure les véhicules avec des réservations qui chevauchent
          SELECT DISTINCT b.vehicle_id
          FROM bookings b
          WHERE b.status != 'cancelled'
            AND tstzrange(b.start_at, b.end_at, '[)') && tstzrange(p_start, p_end, '[)')
      )
      AND EXISTS (
          -- S'assurer qu'il y a au moins un tarif valide pour cette durée
          SELECT 1
          FROM vehicle_rates vr
          WHERE vr.vehicle_id = v.id
            AND vr.min_days <= v_days
            AND (vr.max_days IS NULL OR vr.max_days >= v_days)
      )
    ORDER BY v.name;
END;
$$;
```

---

## Données de test (optionnel)

Après avoir créé le schéma, vous pouvez exécuter ce script pour ajouter des véhicules de test :

```sql
-- Véhicule 1: Berline économique
INSERT INTO vehicles (id, name, category, deposit_eur) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Renault Clio', 'economy', 200)
ON CONFLICT (id) DO NOTHING;

-- Tarifs pour la Clio
INSERT INTO vehicle_rates (vehicle_id, min_days, max_days, price_per_day_eur) VALUES
('550e8400-e29b-41d4-a716-446655440000', 1, 3, 45),
('550e8400-e29b-41d4-a716-446655440000', 4, 7, 40),
('550e8400-e29b-41d4-a716-446655440000', 8, NULL, 35)
ON CONFLICT DO NOTHING;

-- Véhicule 2: SUV premium
INSERT INTO vehicles (id, name, category, deposit_eur) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'BMW X5', 'premium', 500)
ON CONFLICT (id) DO NOTHING;

-- Tarifs pour le BMW X5
INSERT INTO vehicle_rates (vehicle_id, min_days, max_days, price_per_day_eur) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 3, 120),
('550e8400-e29b-41d4-a716-446655440001', 4, 7, 110),
('550e8400-e29b-41d4-a716-446655440001', 8, NULL, 100)
ON CONFLICT DO NOTHING;
```



