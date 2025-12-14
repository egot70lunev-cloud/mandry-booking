# 📋 Commandes à exécuter

## Installation initiale

```bash
# Installer les dépendances
npm install
```

## Configuration

```bash
# Créer le fichier .env.local (Windows PowerShell)
Copy-Item env.example .env.local

# Créer le fichier .env.local (Linux/Mac)
cp env.example .env.local
```

Puis éditez `.env.local` avec vos clés.

## Développement

```bash
# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Build de production

```bash
# Créer un build de production
npm run build

# Lancer le serveur de production
npm start
```

## Linting

```bash
# Vérifier le code
npm run lint
```

## Base de données Supabase

1. Allez dans votre projet Supabase
2. Ouvrez **SQL Editor**
3. Copiez-collez le contenu de `supabase/schema.sql` (ou `supabase/SCHEMA_FOR_SUPABASE.md`)
4. Exécutez le script
5. **Données de test (optionnel mais recommandé)** : Copier-coller `supabase/seed.sql` dans Supabase SQL Editor et exécuter. Ce script insère 7 véhicules de test avec leurs tarifs associés pour tester l'application.

## Déploiement Vercel

```bash
# Installer Vercel CLI (une seule fois)
npm i -g vercel

# Déployer
vercel

# Déployer en production
vercel --prod
```

Ou connectez votre repo GitHub à Vercel pour un déploiement automatique.

## Vérification

```bash
# Tester que tout compile
npm run build

# Tester localement
npm run dev
```

Ensuite testez :
- http://localhost:3000 (page d'accueil)
- http://localhost:3000/booking (page iframe)
- http://localhost:3000/api/available?start=2024-01-15T10:00:00Z&end=2024-01-20T10:00:00Z (API)


