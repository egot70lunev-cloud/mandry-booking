# Guide de déploiement - Mandry Booking

## 🚀 Déploiement sur Vercel

### Étape 1 : Préparer le projet

1. **Vérifier que le build fonctionne localement**
   ```bash
   npm install
   npm run build
   ```

2. **Tester localement**
   ```bash
   npm run dev
   ```

### Étape 2 : Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Créez un compte ou connectez-vous
3. Connectez votre repository GitHub (ou utilisez la CLI)

### Étape 3 : Déployer via GitHub (recommandé)

1. **Pousser le code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/votre-username/mandry-booking.git
   git push -u origin main
   ```

2. **Dans Vercel**
   - Cliquez sur "New Project"
   - Importez votre repository
   - Vercel détectera automatiquement Next.js

### Étape 4 : Configurer les variables d'environnement

Dans Vercel, allez dans **Settings > Environment Variables** et ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
RESEND_API_KEY=re_votre_api_key
EMAIL_FROM=noreply@votredomaine.com
EMAIL_ADMIN=admin@votredomaine.com
```

**Important :** 
- Ajoutez ces variables pour **Production**, **Preview**, et **Development**
- Ne commitez JAMAIS `.env.local` dans Git

### Étape 5 : Configurer Supabase

1. **Créer le schéma**
   - Connectez-vous à [supabase.com](https://supabase.com)
   - Ouvrez votre projet
   - Allez dans **SQL Editor**
   - Copiez-collez le contenu de `supabase/schema.sql`
   - Exécutez le script

2. **Ajouter des données de test (optionnel)**
   - Dans **SQL Editor**, exécutez `supabase/seed.sql`

### Étape 6 : Configurer Resend

1. **Créer un compte Resend**
   - Allez sur [resend.com](https://resend.com)
   - Créez un compte
   - Générez une clé API

2. **Vérifier votre domaine**
   - Ajoutez votre domaine dans Resend
   - Configurez les enregistrements DNS requis
   - Attendez la vérification

3. **Utiliser le domaine vérifié**
   - Utilisez `noreply@votre-domaine-verifie.com` pour `EMAIL_FROM`
   - Utilisez `admin@votre-domaine-verifie.com` pour `EMAIL_ADMIN`

### Étape 7 : Déployer

1. **Déclencher le déploiement**
   - Si vous avez connecté GitHub, chaque push déclenche un déploiement
   - Ou utilisez la CLI : `vercel --prod`

2. **Vérifier le déploiement**
   - Vercel vous donnera une URL : `https://votre-projet.vercel.app`
   - Testez la page : `https://votre-projet.vercel.app/booking`

## 🔗 Intégration dans Framer

### Méthode 1 : Via Embed (recommandé)

1. **Dans Framer**
   - Ouvrez votre projet Framer
   - Ajoutez un composant **Embed** (ou **Code Component**)
   - Entrez l'URL : `https://votre-projet.vercel.app/booking`

2. **Ajuster la taille**
   - Définissez la largeur et la hauteur de l'iframe
   - Recommandé : 100% de largeur, hauteur minimale 800px

### Méthode 2 : Via Code Component

Si vous préférez utiliser un Code Component dans Framer :

```tsx
import { useEffect, useRef } from "react"

export default function BookingWidget() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Écouter les messages depuis l'iframe si nécessaire
    const handleMessage = (event: MessageEvent) => {
      // Traiter les messages
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src="https://votre-projet.vercel.app/booking"
      width="100%"
      height="800"
      style={{ border: "none" }}
    />
  )
}
```

## ✅ Vérifications post-déploiement

1. **Tester la recherche**
   - Allez sur `/booking`
   - Remplissez le formulaire
   - Vérifiez que les véhicules s'affichent

2. **Tester une réservation**
   - Créez une réservation de test
   - Vérifiez dans Supabase que la ligne est créée
   - Vérifiez que les emails sont reçus

3. **Tester le chevauchement**
   - Créez une première réservation
   - Essayez de créer une deuxième qui chevauche
   - Vérifiez l'erreur 409

4. **Tester l'intégration Framer**
   - Intégrez la page dans Framer
   - Vérifiez que tout fonctionne dans l'iframe

## 🐛 Dépannage

### Le build échoue sur Vercel

- Vérifiez les logs de build dans Vercel
- Assurez-vous que toutes les dépendances sont dans `package.json`
- Vérifiez que TypeScript compile sans erreur

### Les variables d'environnement ne sont pas prises en compte

- Vérifiez que vous les avez ajoutées dans Vercel
- Redéployez après avoir ajouté les variables
- Vérifiez que les noms correspondent exactement

### Les emails ne sont pas envoyés

- Vérifiez votre clé API Resend
- Vérifiez que le domaine est vérifié
- Consultez les logs Vercel (Function Logs)

### L'iframe ne s'affiche pas dans Framer

- Vérifiez que vous utilisez la page `/booking` (pas `/`)
- Vérifiez les headers dans `next.config.js`
- Testez l'URL directement dans un navigateur

## 📝 Notes importantes

- **Sécurité** : Ne commitez jamais `.env.local`
- **Performance** : Vercel met en cache automatiquement
- **Coûts** : Vercel Hobby est gratuit pour les projets personnels
- **Domaine personnalisé** : Vous pouvez ajouter un domaine personnalisé dans Vercel

## 🔄 Mises à jour

Pour mettre à jour l'application :

1. Faites vos modifications
2. Commitez et poussez sur GitHub
3. Vercel redéploiera automatiquement
4. Les variables d'environnement sont conservées

## 📞 Support

En cas de problème :
1. Consultez les logs Vercel
2. Consultez les logs Supabase
3. Vérifiez la console du navigateur
4. Testez les API routes directement



