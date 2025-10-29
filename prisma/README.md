# Configuration Prisma Postgres

Ce projet utilise **Prisma Postgres** - une base de données PostgreSQL managée avec Accelerate intégré pour le connection pooling et le cache global.

## Configuration initiale

### 1. Créer une base de données Prisma Postgres

**Option A : Via Prisma Console (Recommandé)**

1. Visitez [Prisma Console](https://console.prisma.io)
2. Connectez-vous avec votre compte
3. Cliquez sur "New Project" ou "Create Database"
4. Sélectionnez "Prisma Postgres"
5. Choisissez votre région (par exemple, `eu-central-1` pour l'Europe)
6. Donnez un nom à votre base de données
7. Cliquez sur "Create"

Après création, vous obtiendrez deux URLs :
- **Connection string (Accelerate)** : `prisma://accelerate.prisma-data.net/?api_key=...`
- **Direct connection string** : `postgresql://...@...prisma-data.net:5432/...`

**Option B : Utiliser PostgreSQL local ou autre provider**

Si vous préférez utiliser une base PostgreSQL existante (locale, Supabase, Neon, etc.), configurez simplement :

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
DIRECT_DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

Note : Sans Prisma Postgres, vous n'aurez pas Accelerate intégré, mais Prisma fonctionnera normalement.

### 2. Configurer les URLs dans .env

Copiez les URLs obtenues depuis Prisma Console dans votre fichier `.env` :

```env
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhb..."
DIRECT_DATABASE_URL="postgresql://...@...prisma-data.net:5432/...?sslmode=require"
```

### 3. Générer le client Prisma

```bash
pnpm prisma generate
```

### 4. Créer les tables dans la base de données

```bash
pnpm prisma migrate dev --name init
```

## Commandes utiles

### Développement

```bash
# Créer et appliquer une migration
pnpm prisma migrate dev --name description_du_changement

# Ouvrir Prisma Studio (interface graphique)
pnpm prisma studio

# Régénérer le client après modification du schema
pnpm prisma generate

# Formater le schema
pnpm prisma format
```

### Production

```bash
# Appliquer les migrations en production
pnpm prisma migrate deploy

# Voir le statut des migrations
pnpm prisma migrate status
```

### Gestion de la base de données

Pour gérer votre base Prisma Postgres, utilisez la [Prisma Console](https://console.prisma.io) où vous pouvez :
- Voir les métriques et statistiques
- Gérer les backups
- Monitorer les performances
- Gérer les clés API

## Utilisation dans le code

### Requêtes de base

```typescript
import { prisma } from '@/lib/prisma'

// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
})

// Read
const users = await prisma.user.findMany()

// Update
const updated = await prisma.user.update({
  where: { id: 'user-id' },
  data: { name: 'Jane Doe' },
})

// Delete
await prisma.user.delete({
  where: { id: 'user-id' },
})
```

### Utilisation du cache Accelerate

Prisma Postgres inclut Accelerate, vous pouvez donc utiliser le cache :

```typescript
// Cache pendant 60 secondes
const users = await prisma.user.findMany({
  cacheStrategy: {
    ttl: 60,      // Time to live en secondes
    swr: 10,      // Stale-while-revalidate (optionnel)
  },
})

// Cache avec tags (pour invalidation)
const posts = await prisma.post.findMany({
  cacheStrategy: {
    ttl: 300,
    tags: ['posts-list'],
  },
})
```

## Modèles de données

Les modèles sont définis dans [`schema.prisma`](./schema.prisma).

Exemple de modèle User actuel :

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Après modification du schema, exécutez :

```bash
pnpm prisma migrate dev --name description_du_changement
```

## Ressources

- [Documentation Prisma Postgres](https://www.prisma.io/postgres)
- [Documentation Prisma ORM](https://www.prisma.io/docs)
- [Documentation Accelerate](https://www.prisma.io/docs/accelerate)
- [Prisma Console](https://console.prisma.io)
