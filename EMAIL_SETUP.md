# Configuration de l'envoi d'emails

Le système utilise [Resend](https://resend.com) pour envoyer des emails d'invitation aux joueurs.

## Configuration

### 1. Créer un compte Resend

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit (100 emails/jour)

### 2. Obtenir une clé API

1. Dans le dashboard Resend, allez sur **API Keys**
2. Cliquez sur **Create API Key**
3. Donnez-lui un nom (ex: "COD Coaching Production")
4. Copiez la clé générée (elle commence par `re_`)

### 3. Configuration dans votre projet

Ajoutez ces variables à votre fichier `.env` :

```bash
# Clé API Resend
RESEND_API_KEY="re_votre_cle_api_ici"

# Email expéditeur (optionnel, par défaut: onboarding@resend.dev)
EMAIL_FROM="COD Coaching <noreply@votredomaine.com>"

# URL de votre application
NEXT_PUBLIC_APP_URL="https://votredomaine.com"
```

### 4. Vérifier votre domaine (Optionnel mais recommandé)

Pour utiliser votre propre domaine d'envoi :

1. Dans Resend, allez sur **Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine (ex: `votredomaine.com`)
4. Suivez les instructions pour ajouter les enregistrements DNS
5. Une fois vérifié, utilisez `noreply@votredomaine.com` dans `EMAIL_FROM`

## Mode développement

En développement, vous pouvez :

1. **Sans configuration** : Les invitations seront créées mais les emails ne seront pas envoyés. Un message apparaîtra dans les logs.

2. **Avec domaine de test Resend** : Utilisez `onboarding@resend.dev` comme expéditeur (pas besoin de vérifier de domaine)

```bash
RESEND_API_KEY="re_votre_cle"
EMAIL_FROM="onboarding@resend.dev"
```

## Vérifier que ça fonctionne

1. Créez une équipe en tant que coach
2. Invitez un joueur via son email
3. Vérifiez les logs du serveur pour voir :
   - `Envoi d'email à [email] pour l'équipe [nom]`
   - `Email envoyé avec succès: { id: '...' }`

4. L'email devrait arriver dans la boîte de réception du joueur

## Dépannage

### L'email n'est pas envoyé

Vérifiez dans les logs du serveur :

- **"RESEND_API_KEY non configurée"** → Ajoutez la clé API dans `.env`
- **"Erreur Resend"** → La clé API est invalide ou le domaine n'est pas vérifié
- **"Exception lors de l'envoi"** → Erreur réseau ou problème de configuration

### L'email arrive en spam

- Vérifiez votre domaine dans Resend
- Configurez SPF, DKIM et DMARC (Resend vous guide)
- Évitez les mots "spam" dans le sujet/contenu

### Limite atteinte

Le plan gratuit Resend permet :
- 100 emails par jour
- 3 000 emails par mois

Pour plus, passez au plan payant (~$20/mois pour 50k emails)

## Support

- Documentation Resend : https://resend.com/docs
- Support : https://resend.com/support
