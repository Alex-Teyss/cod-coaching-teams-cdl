# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

COD Coaching Teams is a Next.js 16 application for managing Call of Duty coaching teams. Built with React 19, TypeScript, Tailwind CSS v4, and uses pnpm as the package manager.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Database Commands

```bash
# Generate Prisma Client (after schema changes)
pnpm prisma generate

# Create a new migration
pnpm prisma migrate dev --name <migration_name>

# Apply migrations
pnpm prisma migrate deploy

# View database in Prisma Studio
pnpm prisma studio

# Check migration status
pnpm prisma migrate status

# Reset database (development only)
pnpm prisma migrate reset
```

## Architecture

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL with Prisma ORM + Prisma Accelerate (connection pooling & caching)
- **Authentication**: Better Auth with email/password and Google OAuth
- **Email**: Resend (configured for test mode in development)
- **UI Components**: shadcn/ui (New York style, neutral base color)
- **Styling**: Tailwind CSS v4 with CSS variables
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Animations**: Motion (Framer Motion)

### Role-Based Access Control

The application has three user roles with distinct access levels:

- **ADMIN**: Full system access, can validate teams
- **COACH**: Create and manage teams, invite players
- **PLAYER**: Join teams via invitation, view own team dashboard

Role-based routing is handled by `lib/role-redirect.ts:8` which redirects users to their appropriate dashboard after login.

### Application Structure

```
app/
├── (public)
│   ├── login/          # Authentication pages
│   └── signup/
├── admin/              # Admin-only pages (protected)
│   └── dashboard/
├── coach/              # Coach-only pages (protected)
│   ├── dashboard/
│   ├── teams/new/
│   └── invitations/
├── player/             # Player-only pages (protected)
│   ├── dashboard/
│   └── invitations/
└── api/                # API routes
    ├── auth/[...all]/  # Better Auth handler
    ├── teams/          # Team management
    └── invitations/    # Invitation system
```

### Path Aliases

Configured in `tsconfig.json:22`:
- `@/*` - Root directory
- `@/components` - UI components
- `@/lib` - Utilities and server-side logic
- `@/components/ui` - shadcn/ui components
- `@/hooks` - React hooks

### Database Schema

Key models in `prisma/schema.prisma`:

- **User**: Core user model with role (ADMIN/COACH/PLAYER), team relationship
- **Team**: Team entity with coach relationship and validation status
- **Invitation**: Team invitations with email, status (PENDING/ACCEPTED/DECLINED/EXPIRED)
- **Session/Account**: Better Auth authentication tables
- **Verification**: Email verification tokens

The schema uses:
- `DATABASE_URL`: Prisma Accelerate URL for queries (with pooling/caching)
- `DIRECT_DATABASE_URL`: Direct PostgreSQL URL for migrations

### Authentication System

Authentication is managed by Better Auth (`lib/auth.ts:5`):

- **Email/Password**: Built-in authentication
- **Google OAuth**: Optional social login
- **Session Management**: Token-based with database sessions
- **User Fields**: Extended with `role` and `teamId` fields

Client-side auth hooks are available via `lib/auth-client.ts`.

### Email System

Email functionality (`lib/email.ts:10`) uses Resend:

- **Development**: Uses `onboarding@resend.dev` (test mode, only sends to registered email)
- **Production**: Requires domain verification at resend.com/domains
- **Template**: HTML email template for team invitations with 7-day expiration

See `RESEND_EMAIL_SETUP.md` for detailed email configuration guide.

### Key Configuration Files

- `next.config.ts`: Next.js config with security headers, image optimization, production console removal
- `components.json`: shadcn/ui configuration (New York style, neutral colors)
- `app/globals.css`: Global styles with Tailwind directives and CSS variables
- `.env.example`: Environment variable template with database, auth, and email configuration

## Environment Variables

Required variables (see `.env.example`):

```bash
# Database
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
DIRECT_DATABASE_URL="postgresql://user:password@host..."

# Authentication
BETTER_AUTH_SECRET="generated-with-openssl-rand-base64-32"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email
RESEND_API_KEY="re_xxxxxxxxxx"
EMAIL_FROM="COD Coaching <noreply@yourdomain.com>"
```

## Adding shadcn/ui Components

```bash
pnpx shadcn@latest add <component-name>
```

Components are added to `components/ui/` with configured aliases and styling.

## Development Workflow

1. **Database Changes**: Update `prisma/schema.prisma` → run `pnpm prisma migrate dev`
2. **New Features**: Follow role-based routing patterns in existing pages
3. **API Routes**: Use Better Auth session validation for protected endpoints
4. **Form Validation**: Use Zod schemas in `lib/validations/` directory
5. **Email Testing**: Use your own email address in development (Resend test mode)
6. **Ident Spacing**:Always use indent space 2