# Configuration d'UploadThing

Ce guide explique comment configurer UploadThing pour l'upload d'images de profil et d'équipe.

## 1. Créer un compte UploadThing

1. Visitez [uploadthing.com](https://uploadthing.com)
2. Connectez-vous avec votre compte GitHub
3. Créez une nouvelle application

## 2. Obtenir votre token API

1. Dans le dashboard UploadThing, allez dans "API Keys"
2. Copiez votre token (commence par `sk_live_...` ou `sk_test_...`)

## 3. Configurer les variables d'environnement

Ajoutez votre token dans votre fichier `.env` :

```bash
UPLOADTHING_TOKEN="votre-token-uploadthing-ici"
```

## 4. Configuration des endpoints

Les endpoints suivants sont configurés :

### Profile Image (`profileImage`)
- **Utilisateurs autorisés** : Tous les utilisateurs authentifiés
- **Taille max** : 4MB
- **Nombre de fichiers** : 1
- **Formats acceptés** : Images (JPG, PNG, GIF, etc.)

### Team Image (`teamImage`)
- **Utilisateurs autorisés** : Coaches et Admins uniquement
- **Taille max** : 4MB
- **Nombre de fichiers** : 1
- **Formats acceptés** : Images (JPG, PNG, GIF, etc.)

## 5. Utilisation

### Pages de profil

Les pages de profil sont disponibles pour chaque rôle :
- Admin : `/admin/profile`
- Coach : `/coach/profile`
- Player : `/player/profile`

### Création d'équipe

L'upload d'image d'équipe est disponible sur la page :
- `/coach/teams/new`

## 6. Stockage des images

Les images sont stockées sur les serveurs d'UploadThing et les URLs sont sauvegardées dans la base de données :
- `User.image` : URL de l'image de profil
- `Team.image` : URL du logo de l'équipe

## 7. Développement local

Pour le développement local, vous pouvez utiliser un token de test (`sk_test_...`) qui vous permettra de tester l'upload d'images sans limite de bande passante.

## 8. Production

Pour la production, assurez-vous d'utiliser un token de production (`sk_live_...`) et de configurer les limites appropriées dans le dashboard UploadThing.

## Support

Pour plus d'informations, consultez la [documentation UploadThing](https://docs.uploadthing.com).
