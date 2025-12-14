# Mandry Booking - Système de réservation de véhicules

Système de réservation de véhicules complet avec Next.js 14, Supabase et Resend, prêt à être intégré dans Framer via iframe.

## 🚀 Stack technique

- **Next.js 14** (App Router) + TypeScript
- **Supabase** (service role uniquement côté serveur)
- **Resend** pour l'envoi d'emails
- **Tailwind CSS** pour l'UI

## 📋 Prérequis

- Node.js 18+ et npm
- Compte Supabase
- Compte Resend (pour les emails)

## 🛠️ Installation

1. **Cloner ou télécharger le projet**

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Copiez `env.example` vers `.env.local` :
   ```bash
   cp env.example .env.local
   ```
   
   Puis remplissez les valeurs dans `.env.local` :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
   SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
   
   RESEND_API_KEY=re_votre_api_key
   EMAIL_FROM=noreply@votredomaine.com
   EMAIL_ADMIN=admin@votredomaine.com
   ```

4. **Configurer Supabase**

   - Connectez-vous à votre projet Supabase
   - Allez dans **SQL Editor**
   - Exécutez le contenu de `supabase/schema.sql` pour créer les tables et la fonction RPC
   - (Optionnel) Exécutez `supabase/seed.sql` pour ajouter des données de test

   **Note:** Le schéma est idempotent (peut être exécuté plusieurs fois sans erreur).

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

   L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
mandry-booking/
├── app/
│   ├── api/
│   │   ├── available/route.ts    # GET /api/available
│   │   └── book/route.ts         # POST /api/book
│   ├── book/
│   │   └── page.tsx              # Page de réservation
│   ├── booking/
│   │   └── page.tsx              # Page pour iframe Framer
│   ├── layout.tsx
│   ├── page.tsx                  # Page d'accueil
│   └── globals.css
├── lib/
│   ├── supabase-server.ts        # Client Supabase (service role)
│   └── resend.ts                 # Configuration Resend + emails
├── supabase/
│   ├── schema.sql                # Schéma DB complet
│   └── seed.sql                  # Données de test
├── env.example
└── package.json
```

## 🗄️ Schéma de base de données

### Tables

- **vehicles** : Véhicules disponibles
- **vehicle_rates** : Tarifs par durée de location
- **bookings** : Réservations

### Contrainte d'exclusion

Une contrainte d'exclusion PostgreSQL empêche automatiquement les chevauchements de réservations pour le même véhicule. Cette protection est au niveau de la base de données, pas seulement dans le code.

### Fonction RPC

`search_available_vehicles(p_start, p_end, p_category)` : Recherche les véhicules disponibles pour une période donnée.

## 🔌 API Routes

### GET /api/available

Recherche les véhicules disponibles.

**Query parameters:**
- `start` (requis) : Date de début (ISO 8601)
- `end` (requis) : Date de fin (ISO 8601)
- `category` (optionnel) : Catégorie de véhicule

**Réponse:**
```json
{
  "vehicles": [
    {
      "vehicle_id": "uuid",
      "name": "Renault Clio",
      "category": "economy",
      "deposit_eur": 200,
      "min_price_per_day_eur": 45,
      "estimated_total_eur": 315
    }
  ]
}
```

### POST /api/book

Crée une nouvelle réservation.

**Body:**
```json
{
  "vehicle_id": "uuid",
  "start_at": "2024-01-15T10:00:00Z",
  "end_at": "2024-01-20T10:00:00Z",
  "pickup_location": "Aéroport de Paris",
  "return_location": "Aéroport de Paris",
  "customer_name": "Jean Dupont",
  "customer_email": "jean@example.com",
  "customer_phone": "+33123456789",
  "baby_seat": false,
  "notes": ""
}
```

**Réponse:**
```json
{
  "booking_id": "uuid",
  "total_estimated_eur": 315,
  "message": "Réservation créée avec succès"
}
```

**Codes d'erreur:**
- `400` : Données invalides
- `409` : Conflit (véhicule déjà réservé pour ces dates)
- `500` : Erreur serveur

## 📧 Emails

Lorsqu'une réservation est créée, deux emails sont envoyés via Resend :

1. **Email client** : Confirmation de réservation avec tous les détails
2. **Email admin** : Notification de nouvelle réservation

Les templates sont dans `lib/resend.ts`.

## 🎨 Pages

- `/` : Page d'accueil avec formulaire de recherche
- `/book` : Formulaire de réservation
- `/booking` : Version pour intégration iframe (identique à `/`)

## 🚀 Déploiement sur Vercel

1. **Préparer le projet**
   ```bash
   npm run build
   ```

2. **Déployer sur Vercel**
   - Connectez votre repo GitHub à Vercel
   - Ou utilisez la CLI Vercel :
     ```bash
     npm i -g vercel
     vercel
     ```

3. **Configurer les variables d'environnement sur Vercel**
   - Allez dans **Settings > Environment Variables**
   - Ajoutez toutes les variables de `.env.local`

4. **Redéployer** si nécessaire

## 🔗 Intégration dans Framer

Une fois déployé sur Vercel :

1. Dans Framer, ajoutez un composant **Embed**
2. Entrez l'URL de votre page de réservation : `https://votre-domaine.vercel.app/booking`
3. Ajustez la taille de l'iframe selon vos besoins

**Note:** La page `/booking` est optimisée pour l'intégration iframe. Le header `X-Frame-Options` est configuré dans `next.config.js` pour permettre l'intégration.

## ✅ Checklist de vérification

- [ ] `npm run dev` fonctionne
- [ ] Les variables d'environnement sont configurées
- [ ] Le schéma Supabase est créé
- [ ] `/api/available` renvoie des résultats
- [ ] Une réservation crée une ligne en DB
- [ ] Les emails sont envoyés (client + admin)
- [ ] Le chevauchement est bloqué par la DB (testez avec deux réservations qui se chevauchent)
- [ ] L'UI est utilisable et responsive
- [ ] Le build de production fonctionne (`npm run build`)

## 🧪 Tests manuels

1. **Test de recherche**
   - Remplissez le formulaire de recherche
   - Vérifiez que les véhicules disponibles s'affichent

2. **Test de réservation**
   - Créez une réservation
   - Vérifiez qu'elle apparaît dans Supabase
   - Vérifiez que les emails sont reçus

3. **Test de chevauchement**
   - Créez une première réservation pour un véhicule
   - Essayez de créer une deuxième réservation qui chevauche
   - Vérifiez que vous recevez une erreur 409

## 📝 Notes

- Les secrets sont uniquement dans `.env.local` (jamais hardcodés)
- Le service role Supabase est utilisé uniquement côté serveur
- La contrainte d'exclusion garantit l'intégrité des données au niveau DB
- Les emails sont envoyés de manière asynchrone (la réservation est créée même si l'email échoue)

## 🐛 Dépannage

**Erreur "Missing Supabase environment variables"**
- Vérifiez que `.env.local` existe et contient toutes les variables

**Erreur lors de l'exécution du schéma SQL**
- Vérifiez que l'extension `btree_gist` est activée
- Vérifiez que vous avez les droits d'administration sur la base

**Les emails ne sont pas envoyés**
- Vérifiez votre clé API Resend
- Vérifiez que le domaine est vérifié dans Resend
- Consultez les logs de l'application

**Erreur 409 lors de la réservation**
- C'est normal si le véhicule est déjà réservé pour ces dates
- La contrainte d'exclusion fonctionne correctement

## 📄 Licence

Ce projet est fourni tel quel pour usage personnel ou commercial.



