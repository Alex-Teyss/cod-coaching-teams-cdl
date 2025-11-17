# Configuration de Google Gemini AI

Ce guide vous explique comment configurer Google Gemini AI pour l'analyse automatique de screenshots de scoreboards COD.

## Pourquoi Gemini ?

- ✅ **100% GRATUIT** (modèle `gemini-1.5-flash`)
- ✅ Analyse d'images native
- ✅ Excellent pour l'OCR et l'extraction de données structurées
- ✅ Pas besoin de carte de crédit pour commencer
- ✅ Quota généreux : 15 requêtes par minute, 1500 par jour (gratuit)

## Étape 1 : Obtenir une clé API Gemini

1. **Rendez-vous sur Google AI Studio** : [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2. **Connectez-vous** avec votre compte Google

3. **Cliquez sur "Get API Key"** ou "Create API Key"

4. **Sélectionnez ou créez un projet Google Cloud**
   - Si c'est votre première fois, un projet sera créé automatiquement
   - Sinon, sélectionnez un projet existant

5. **Copiez votre clé API**
   - Elle ressemble à : `AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ **Ne partagez JAMAIS cette clé publiquement**

## Étape 2 : Configurer votre application

1. **Ajoutez la clé à votre fichier `.env`** :

```bash
GEMINI_API_KEY="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

2. **Redémarrez votre serveur de développement** :

```bash
pnpm dev
```

## Étape 3 : Tester l'analyse

1. Connectez-vous en tant que **Coach**
2. Allez dans l'onglet **"IA - Analyse"** dans la sidebar
3. Uploadez un screenshot de scoreboard COD
4. Cliquez sur **"Analyser le screenshot"**
5. Les résultats s'affichent automatiquement !

## Limites et quotas (plan gratuit)

- **15 requêtes par minute**
- **1 500 requêtes par jour**
- **1 million de tokens par mois**

Pour la plupart des coaches, ces limites sont largement suffisantes !

## Formats de screenshots supportés

- PNG, JPG, JPEG, WebP
- Résolution recommandée : 1920x1080 minimum
- Le screenshot doit être **lisible** et **non flou**

## Modes de jeu supportés

L'IA détecte automatiquement :

- ✅ **Hardpoint** (avec damage, hill time)
- ✅ **Search & Destroy** (avec plants, defuses)
- ✅ **Control** (avec captures, zone time)

## Jeux supportés

- Call of Duty: Modern Warfare 3
- Call of Duty: Modern Warfare 2
- Call of Duty: Black Ops 6

## Dépannage

### Erreur "API key not valid"

- Vérifiez que vous avez bien copié la clé complète
- Vérifiez qu'il n'y a pas d'espaces avant/après dans le `.env`
- Redémarrez le serveur après modification du `.env`

### Erreur "Quota exceeded"

- Vous avez dépassé les limites gratuites
- Attendez la prochaine période (minute ou journée)
- Ou passez à un plan payant sur Google Cloud

### L'analyse ne fonctionne pas bien

- Assurez-vous que le screenshot est net et lisible
- Évitez les screenshots trop petits ou compressés
- Le scoreboard doit être visible en entier
- Essayez avec une meilleure qualité d'image

## Sécurité

⚠️ **Ne committez JAMAIS votre clé API dans Git !**

Le fichier `.env` est déjà dans `.gitignore` pour éviter cela.

## Passer en production

Pour la production, vous pouvez :

1. Utiliser le plan gratuit (suffisant pour la plupart des cas)
2. Activer la facturation sur Google Cloud pour des limites plus élevées
3. Monitorer l'utilisation via [Google Cloud Console](https://console.cloud.google.com/)

## Support

Pour toute question ou problème, contactez : contact@codcoachingteams.com
