-- Seed data pour les tests
-- Exécuter après avoir créé le schéma (supabase/schema.sql)
-- Copier-coller ce fichier dans Supabase SQL Editor et exécuter

-- Véhicule 1: Berline économique
WITH vehicle1 AS (
  INSERT INTO vehicles (name, category, deposit_eur)
  VALUES ('Renault Clio', 'economy', 200)
  ON CONFLICT DO NOTHING
  RETURNING id
),
vehicle1_id AS (
  SELECT id FROM vehicle1
  UNION ALL
  SELECT id FROM vehicles WHERE name = 'Renault Clio' LIMIT 1
  LIMIT 1
)
INSERT INTO vehicle_rates (vehicle_id, min_days, max_days, price_per_day_eur)
SELECT 
  (SELECT id FROM vehicle1_id),
  min_days,
  max_days,
  price_per_day_eur
FROM (VALUES
  (1, 3, 45),
  (4, 7, 40),
  (8, NULL::int, 35)
) AS rates(min_days, max_days, price_per_day_eur)
WHERE NOT EXISTS (
  SELECT 1 FROM vehicle_rates vr
  WHERE vr.vehicle_id = (SELECT id FROM vehicle1_id)
    AND vr.min_days = rates.min_days
);

-- Véhicule 2: SUV premium
WITH vehicle2 AS (
  INSERT INTO vehicles (name, category, deposit_eur)
  VALUES ('BMW X5', 'premium', 500)
  ON CONFLICT DO NOTHING
  RETURNING id
),
vehicle2_id AS (
  SELECT id FROM vehicle2
  UNION ALL
  SELECT id FROM vehicles WHERE name = 'BMW X5' LIMIT 1
  LIMIT 1
)
INSERT INTO vehicle_rates (vehicle_id, min_days, max_days, price_per_day_eur)
SELECT 
  (SELECT id FROM vehicle2_id),
  min_days,
  max_days,
  price_per_day_eur
FROM (VALUES
  (1, 3, 120),
  (4, 7, 110),
  (8, NULL::int, 100)
) AS rates(min_days, max_days, price_per_day_eur)
WHERE NOT EXISTS (
  SELECT 1 FROM vehicle_rates vr
  WHERE vr.vehicle_id = (SELECT id FROM vehicle2_id)
    AND vr.min_days = rates.min_days
);

-- Véhicule 3: Compact économique
WITH vehicle3 AS (
  INSERT INTO vehicles (name, category, deposit_eur)
  VALUES ('Peugeot 208', 'economy', 150)
  ON CONFLICT DO NOTHING
  RETURNING id
),
vehicle3_id AS (
  SELECT id FROM vehicle3
  UNION ALL
  SELECT id FROM vehicles WHERE name = 'Peugeot 208' LIMIT 1
  LIMIT 1
)
INSERT INTO vehicle_rates (vehicle_id, min_days, max_days, price_per_day_eur)
SELECT 
  (SELECT id FROM vehicle3_id),
  min_days,
  max_days,
  price_per_day_eur
FROM (VALUES
  (1, 3, 35),
  (4, 7, 30),
  (8, NULL::int, 25)
) AS rates(min_days, max_days, price_per_day_eur)
WHERE NOT EXISTS (
  SELECT 1 FROM vehicle_rates vr
  WHERE vr.vehicle_id = (SELECT id FROM vehicle3_id)
    AND vr.min_days = rates.min_days
);

-- Véhicule 4: SUV familial
WITH vehicle4 AS (
  INSERT INTO vehicles (name, category, deposit_eur)
  VALUES ('Volkswagen Tiguan', 'suv', 300)
  ON CONFLICT DO NOTHING
  RETURNING id
),
vehicle4_id AS (
  SELECT id FROM vehicle4
  UNION ALL
  SELECT id FROM vehicles WHERE name = 'Volkswagen Tiguan' LIMIT 1
  LIMIT 1
)
INSERT INTO vehicle_rates (vehicle_id, min_days, max_days, price_per_day_eur)
SELECT 
  (SELECT id FROM vehicle4_id),
  min_days,
  max_days,
  price_per_day_eur
FROM (VALUES
  (1, 3, 65),
  (4, 7, 60),
  (8, NULL::int, 55)
) AS rates(min_days, max_days, price_per_day_eur)
WHERE NOT EXISTS (
  SELECT 1 FROM vehicle_rates vr
  WHERE vr.vehicle_id = (SELECT id FROM vehicle4_id)
    AND vr.min_days = rates.min_days
);

-- Véhicule 5: Berline premium
WITH vehicle5 AS (
  INSERT INTO vehicles (name, category, deposit_eur)
  VALUES ('Mercedes-Benz Classe C', 'premium', 400)
  ON CONFLICT DO NOTHING
  RETURNING id
),
vehicle5_id AS (
  SELECT id FROM vehicle5
  UNION ALL
  SELECT id FROM vehicles WHERE name = 'Mercedes-Benz Classe C' LIMIT 1
  LIMIT 1
)
INSERT INTO vehicle_rates (vehicle_id, min_days, max_days, price_per_day_eur)
SELECT 
  (SELECT id FROM vehicle5_id),
  min_days,
  max_days,
  price_per_day_eur
FROM (VALUES
  (1, 3, 95),
  (4, 7, 85),
  (8, NULL::int, 75)
) AS rates(min_days, max_days, price_per_day_eur)
WHERE NOT EXISTS (
  SELECT 1 FROM vehicle_rates vr
  WHERE vr.vehicle_id = (SELECT id FROM vehicle5_id)
    AND vr.min_days = rates.min_days
);

-- Véhicule 6: Van utilitaire
WITH vehicle6 AS (
  INSERT INTO vehicles (name, category, deposit_eur)
  VALUES ('Ford Transit', 'van', 350)
  ON CONFLICT DO NOTHING
  RETURNING id
),
vehicle6_id AS (
  SELECT id FROM vehicle6
  UNION ALL
  SELECT id FROM vehicles WHERE name = 'Ford Transit' LIMIT 1
  LIMIT 1
)
INSERT INTO vehicle_rates (vehicle_id, min_days, max_days, price_per_day_eur)
SELECT 
  (SELECT id FROM vehicle6_id),
  min_days,
  max_days,
  price_per_day_eur
FROM (VALUES
  (1, 3, 70),
  (4, 7, 65),
  (8, NULL::int, 60)
) AS rates(min_days, max_days, price_per_day_eur)
WHERE NOT EXISTS (
  SELECT 1 FROM vehicle_rates vr
  WHERE vr.vehicle_id = (SELECT id FROM vehicle6_id)
    AND vr.min_days = rates.min_days
);

-- Véhicule 7: Voiture de luxe
WITH vehicle7 AS (
  INSERT INTO vehicles (name, category, deposit_eur)
  VALUES ('Audi A8', 'luxury', 800)
  ON CONFLICT DO NOTHING
  RETURNING id
),
vehicle7_id AS (
  SELECT id FROM vehicle7
  UNION ALL
  SELECT id FROM vehicles WHERE name = 'Audi A8' LIMIT 1
  LIMIT 1
)
INSERT INTO vehicle_rates (vehicle_id, min_days, max_days, price_per_day_eur)
SELECT 
  (SELECT id FROM vehicle7_id),
  min_days,
  max_days,
  price_per_day_eur
FROM (VALUES
  (1, 3, 180),
  (4, 7, 165),
  (8, NULL::int, 150)
) AS rates(min_days, max_days, price_per_day_eur)
WHERE NOT EXISTS (
  SELECT 1 FROM vehicle_rates vr
  WHERE vr.vehicle_id = (SELECT id FROM vehicle7_id)
    AND vr.min_days = rates.min_days
);
