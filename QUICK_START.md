# 🚀 Démarrage rapide

## 1. Installation

```bash
npm install
```

## 2. Configuration

Copiez `env.example` vers `.env.local` et remplissez les valeurs :

```bash
# Windows PowerShell
Copy-Item env.example .env.local

# Linux/Mac
cp env.example .env.local
```

Puis éditez `.env.local` avec vos clés Supabase et Resend.

## 3. Base de données Supabase

1. Allez dans votre projet Supabase → **SQL Editor**
2. Copiez-collez le contenu de `supabase/schema.sql`
3. Exécutez le script
4. (Optionnel) Exécutez `supabase/seed.sql` pour des données de test

## 4. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 5. Tester

- Page d'accueil : http://localhost:3000
- Page booking (iframe) : http://localhost:3000/booking
- API disponible : http://localhost:3000/api/available?start=2024-01-15T10:00:00Z&end=2024-01-20T10:00:00Z

## ✅ Checklist

- [ ] `npm install` exécuté
- [ ] `.env.local` créé et rempli
- [ ] Schéma Supabase créé
- [ ] `npm run dev` fonctionne
- [ ] La recherche de véhicules fonctionne
- [ ] Une réservation peut être créée
- [ ] Les emails sont envoyés

## 📚 Documentation complète

- `README.md` : Documentation complète
- `DEPLOYMENT.md` : Guide de déploiement sur Vercel



