# 🚀 Checklist de déploiement Vercel - Mandry Booking

## ✅ ÉTAPE 1 : Déployer sur Vercel depuis GitHub

### Option A : Via l'interface web Vercel (recommandé)

1. **Aller sur Vercel**
   - Ouvrir https://vercel.com
   - Se connecter avec votre compte GitHub (egot70lunev-cloud)

2. **Importer le projet**
   - Cliquer sur **"Add New..."** → **"Project"**
   - Dans la liste des repositories, trouver **"mandry-booking"**
   - Cliquer sur **"Import"**

3. **Configuration du projet**
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (laisser par défaut)
   - **Build Command** : `npm run build` (détecté automatiquement)
   - **Output Directory** : `.next` (détecté automatiquement)
   - **Install Command** : `npm install` (détecté automatiquement)

4. **Déployer**
   - Cliquer sur **"Deploy"**
   - ⏳ Attendre 2-3 minutes pour le premier déploiement
   - ✅ Notez l'URL de déploiement : `https://mandry-booking-xxxxx.vercel.app`

### Option B : Via Vercel CLI

```bash
# Installer Vercel CLI globalement (une seule fois)
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer depuis le répertoire du projet
cd c:\Users\ПК\mandry-booking
vercel

# Suivre les instructions :
# - Link to existing project? No
# - Project name: mandry-booking
# - Directory: ./
# - Override settings? No

# Pour déployer en production
vercel --prod
```

---

## ✅ ÉTAPE 2 : Configurer les variables d'environnement

### Dans l'interface Vercel :

1. **Accéder aux paramètres du projet**
   - Aller sur https://vercel.com/dashboard
   - Cliquer sur le projet **"mandry-booking"**
   - Cliquer sur **"Settings"** (onglet en haut)
   - Cliquer sur **"Environment Variables"** (menu de gauche)

2. **Ajouter chaque variable pour Production ET Preview**

   Pour chaque variable ci-dessous, cliquer sur **"Add New"** et :
   - Entrer le **Name** et la **Value**
   - Cocher **Production** ET **Preview** (important !)
   - Cliquer sur **"Save"**

   **Variables à ajouter :**

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://votre-projet.supabase.co
   ✅ Production ✅ Preview

   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: votre_anon_key_ici
   ✅ Production ✅ Preview

   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: votre_service_role_key_ici
   ✅ Production ✅ Preview

   Name: RESEND_API_KEY
   Value: re_votre_api_key_ici
   ✅ Production ✅ Preview

   Name: EMAIL_FROM
   Value: noreply@votredomaine.com
   ✅ Production ✅ Preview

   Name: EMAIL_ADMIN
   Value: egot.70.lunev@gmail.com
   ✅ Production ✅ Preview
   ```

3. **Redéployer après avoir ajouté les variables**
   - Aller dans l'onglet **"Deployments"**
   - Cliquer sur les **3 points** (⋯) du dernier déploiement
   - Cliquer sur **"Redeploy"**
   - ⏳ Attendre la fin du redéploiement

---

## ✅ ÉTAPE 3 : Vérifier quelle route utiliser pour Framer

### ✅ Route à utiliser : `/booking`

**Explication :**
- `/booking` = Page de recherche de véhicules (optimisée pour iframe)
- `/book` = Page de formulaire de réservation (utilisée après sélection d'un véhicule)

**Flow complet :**
1. L'utilisateur arrive sur `/booking` (recherche)
2. Sélectionne un véhicule → redirige vers `/book?vehicle_id=...&start=...&end=...`
3. Remplit le formulaire → envoie la réservation

**Pour Framer, utilisez :** `https://votre-app.vercel.app/booking`

---

## ✅ ÉTAPE 4 : Code d'intégration Framer

### Option A : Redirection (RECOMMANDÉ) ⭐

**Avantages :**
- ✅ Meilleure UX (page pleine)
- ✅ Pas de problèmes de taille d'iframe
- ✅ Pas de problèmes CSP/X-Frame-Options
- ✅ Mobile-friendly

**Dans Framer :**

1. **Créer un bouton "Rechercher"**
   - Ajouter un composant **Button** ou **Link**
   - Texte : "Rechercher un véhicule" ou "Réserver"

2. **Configurer l'action**
   - **Action** : "Open URL"
   - **URL** : `https://votre-app.vercel.app/booking`
   - **Target** : `_blank` (nouvel onglet) ou `_self` (même onglet)

**Code HTML/CSS si vous utilisez un Embed HTML :**

```html
<a 
  href="https://votre-app.vercel.app/booking" 
  target="_blank"
  style="
    display: inline-block;
    padding: 12px 24px;
    background-color: #2563eb;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.2s;
  "
  onmouseover="this.style.backgroundColor='#1d4ed8'"
  onmouseout="this.style.backgroundColor='#2563eb'"
>
  Rechercher un véhicule
</a>
```

---

### Option B : Embed iframe

**⚠️ Points de blocage possibles :**

1. **CSP (Content-Security-Policy)**
   - ✅ **RÉGLÉ** : `next.config.js` configure `frame-ancestors *` pour `/booking` et `/book`

2. **X-Frame-Options**
   - ✅ **RÉGLÉ** : `next.config.js` configure `X-Frame-Options: ALLOWALL` pour `/booking` et `/book`

3. **Taille de l'iframe**
   - ⚠️ À configurer dans Framer selon vos besoins

**Dans Framer :**

1. **Ajouter un composant Embed**
   - Dans Framer, ajouter un composant **Embed** ou **Iframe**

2. **Configurer l'URL**
   - **URL** : `https://votre-app.vercel.app/booking`
   - **Width** : `100%` ou `800px` (selon votre design)
   - **Height** : `600px` ou `100vh` (selon votre design)

**Code HTML si vous utilisez un Embed HTML :**

```html
<iframe 
  src="https://votre-app.vercel.app/booking"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px;"
  title="Réservation de véhicule"
></iframe>
```

**Si vous avez des problèmes CSP dans Framer :**

Les headers sont déjà configurés dans `next.config.js`, mais si Framer bloque encore :

1. Vérifier que vous utilisez bien `/booking` (pas `/`)
2. Vérifier que le déploiement Vercel est à jour
3. Tester dans un navigateur : `https://votre-app.vercel.app/booking`
4. Ouvrir la console du navigateur (F12) pour voir les erreurs CSP

---

## ✅ ÉTAPE 5 : Vérifier l'endpoint /health

**Endpoint créé :** `GET /api/health`

**Test :**

1. **Après le déploiement Vercel, tester :**
   ```
   https://votre-app.vercel.app/api/health
   ```

2. **Réponse attendue :**
   ```json
   {
     "ok": true
   }
   ```

3. **Si ça fonctionne :**
   - ✅ Vercel tourne correctement
   - ✅ Les routes API sont accessibles

4. **Si ça ne fonctionne pas :**
   - Vérifier que le déploiement est terminé
   - Vérifier les logs Vercel (onglet "Deployments" → cliquer sur le déploiement → "Functions")

---

## 📋 Checklist finale

### Avant de déployer
- [ ] Le projet build localement : `npm run build` ✅ (déjà fait)
- [ ] Les fichiers sont commités et pushés sur GitHub ✅ (déjà fait)
- [ ] Le repository est accessible : https://github.com/egot70lunev-cloud/mandry-booking ✅

### Déploiement Vercel
- [ ] Projet importé depuis GitHub
- [ ] Premier déploiement réussi
- [ ] URL de production notée : `https://mandry-booking-xxxxx.vercel.app`

### Variables d'environnement
- [ ] `NEXT_PUBLIC_SUPABASE_URL` ajoutée (Production + Preview)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` ajoutée (Production + Preview)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ajoutée (Production + Preview)
- [ ] `RESEND_API_KEY` ajoutée (Production + Preview)
- [ ] `EMAIL_FROM` ajoutée (Production + Preview)
- [ ] `EMAIL_ADMIN` ajoutée (Production + Preview)
- [ ] Redéploiement effectué après ajout des variables

### Tests
- [ ] `/api/health` retourne `{ ok: true }`
- [ ] `/booking` s'affiche correctement
- [ ] Recherche de véhicules fonctionne
- [ ] Réservation fonctionne (test complet)

### Intégration Framer
- [ ] Route `/booking` identifiée et testée
- [ ] Option A (redirection) ou Option B (iframe) choisie
- [ ] Code d'intégration ajouté dans Framer
- [ ] Test de l'intégration dans Framer

---

## 🔧 Dépannage

### Problème : Les variables d'environnement ne sont pas prises en compte

**Solution :**
1. Vérifier que les variables sont bien cochées pour **Production** ET **Preview**
2. Redéployer manuellement (Deployments → ⋯ → Redeploy)
3. Vérifier les logs de build dans Vercel

### Problème : L'iframe ne s'affiche pas dans Framer

**Solution :**
1. Vérifier que vous utilisez `/booking` (pas `/`)
2. Tester l'URL directement dans un navigateur
3. Vérifier la console du navigateur (F12) pour les erreurs CSP
4. Les headers sont déjà configurés dans `next.config.js` - si ça ne fonctionne toujours pas, vérifier que le déploiement est à jour

### Problème : Erreur 500 sur les routes API

**Solution :**
1. Vérifier que toutes les variables d'environnement sont bien configurées
2. Vérifier les logs Vercel (Deployments → Functions)
3. Tester `/api/health` d'abord pour vérifier que les routes fonctionnent

### Problème : Les emails ne sont pas envoyés

**Solution :**
1. Vérifier `RESEND_API_KEY` dans Vercel
2. Vérifier `EMAIL_FROM` et `EMAIL_ADMIN`
3. Tester avec `/api/test-email` après déploiement
4. Vérifier les logs Resend dans votre dashboard Resend

---

## 📞 Support

- **Documentation Vercel** : https://vercel.com/docs
- **Documentation Next.js** : https://nextjs.org/docs
- **Logs Vercel** : Dashboard → Projet → Deployments → Cliquer sur un déploiement

---

**✅ Tout est prêt ! Bon déploiement ! 🚀**
