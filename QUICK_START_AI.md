# Guide Rapide - Analyse IA de Screenshots COD

## 🚀 Démarrage en 3 étapes

### Étape 1 : Obtenir votre clé API Gemini (2 minutes)

1. Allez sur : **https://aistudio.google.com/app/apikey**
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Create API Key"** ou **"Get API Key"**
4. Copiez la clé (commence par `AIzaSy...`)

### Étape 2 : Ajouter la clé à votre projet

Créez ou modifiez votre fichier `.env` à la racine du projet :

```bash
GEMINI_API_KEY="AIzaSy_VOTRE_CLE_ICI"
```

### Étape 3 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
pnpm dev
```

## ✅ C'est prêt !

### Comment utiliser l'analyse IA

1. **Connectez-vous** en tant que **Coach**
2. Dans la sidebar, cliquez sur **"IA - Analyse"** ✨
3. **Uploadez** un screenshot de scoreboard COD
4. Cliquez sur **"Analyser le screenshot"**
5. **Patientez** 3-5 secondes
6. **Les résultats s'affichent** automatiquement !

## 📸 Screenshots supportés

- ✅ **Jeux** : Modern Warfare 2, Modern Warfare 3, Black Ops 6
- ✅ **Modes** : Hardpoint, Search & Destroy, Control
- ✅ **Formats** : PNG, JPG, JPEG, WebP
- ✅ **Qualité** : Minimum 1920x1080 recommandé

## 💰 C'est gratuit ?

**OUI !** Gemini 1.5 Flash est 100% gratuit avec :
- 15 requêtes par minute
- 1500 requêtes par jour
- 1 million de tokens par mois

Largement suffisant pour un coach !

## ❓ Problèmes ?

### "API key not valid"
- Vérifiez que vous avez bien copié la clé complète
- Vérifiez qu'il n'y a pas d'espaces dans le `.env`
- Redémarrez le serveur après modification

### L'analyse ne fonctionne pas bien
- Assurez-vous que le screenshot est net et lisible
- Le scoreboard doit être visible en entier
- Utilisez un screenshot de bonne qualité (pas compressé)

### "Quota exceeded"
- Vous avez dépassé les 15 requêtes/minute
- Attendez 1 minute et réessayez

## 📚 Plus d'infos

Consultez `GEMINI_SETUP.md` pour le guide complet !

---

**Prêt à analyser vos premiers scoreboards ?** 🎮
