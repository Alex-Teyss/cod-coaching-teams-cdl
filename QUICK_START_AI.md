# Guide Rapide - Analyse IA de Screenshots COD

## 🚀 Démarrage en 3 étapes

### Étape 1 : Obtenir votre clé API OpenAI (2 minutes)

1. Allez sur : **https://platform.openai.com/api-keys**
2. Connectez-vous ou créez un compte OpenAI
3. Cliquez sur **"Create new secret key"**
4. Donnez un nom à votre clé (ex: "COD Coaching Analysis")
5. Copiez la clé (commence par `sk-proj-...`)

**Important** : Vous devez avoir des crédits sur votre compte OpenAI. Les nouveaux comptes reçoivent souvent un crédit initial.

### Étape 2 : Ajouter la clé à votre projet

Créez ou modifiez votre fichier `.env` à la racine du projet :

```bash
OPENAI_API_KEY="sk-proj-VOTRE_CLE_ICI"
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

- ✅ **Jeux** : Modern Warfare 2, Modern Warfare 3, Black Ops 6, Black Ops 7
- ✅ **Modes** : Hardpoint, Search & Destroy, Control, Domination, TDM, Kill Confirmed
- ✅ **Formats** : PNG, JPG, JPEG, WebP
- ✅ **Qualité** : Minimum 1920x1080 recommandé

## 💰 Coûts

OpenAI GPT-4o est un service payant :
- **Prix** : ~$2.50 par million de tokens en entrée, ~$10 par million de tokens en sortie
- **Estimation** : ~$0.02-0.05 par screenshot analysé
- **Crédit initial** : Les nouveaux comptes reçoivent souvent $5 de crédit gratuit

Vous pouvez consulter vos crédits et usage sur https://platform.openai.com/usage

## ❓ Problèmes ?

### "Invalid API key"
- Vérifiez que vous avez bien copié la clé complète
- Vérifiez qu'il n'y a pas d'espaces dans le `.env`
- Assurez-vous que la clé commence par `sk-proj-` ou `sk-`
- Redémarrez le serveur après modification

### "Insufficient quota"
- Vous n'avez plus de crédits sur votre compte OpenAI
- Ajoutez un moyen de paiement sur https://platform.openai.com/settings/organization/billing
- Ou attendez la réinitialisation mensuelle si vous êtes sur un plan gratuit

### L'analyse ne fonctionne pas bien
- Assurez-vous que le screenshot est net et lisible
- Le scoreboard doit être visible en entier
- Utilisez un screenshot de bonne qualité (pas compressé)

### "Rate limit exceeded"
- Vous avez dépassé le nombre de requêtes autorisées
- Les limites varient selon votre tier OpenAI (gratuit vs payant)
- Attendez quelques secondes et réessayez

## 📚 Plus d'infos

- **Documentation OpenAI** : https://platform.openai.com/docs
- **Tarification** : https://openai.com/api/pricing/
- **Usage & Billing** : https://platform.openai.com/usage

---

**Prêt à analyser vos premiers scoreboards ?** 🎮
