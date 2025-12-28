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
- **AI**: OpenAI GPT-4o (screenshot analysis with vision)
- **UI Components**: shadcn/ui (New York style, neutral base color)
- **Styling**: Tailwind CSS v4 with CSS variables
- **Icons**: Lucide React
- **Forms**: TanStack Form + Zod validation
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
│   ├── signup/
│   └── contact/        # Contact page with email form
├── admin/              # Admin-only pages (protected)
│   └── dashboard/
├── coach/              # Coach-only pages (protected)
│   ├── dashboard/
│   ├── teams/new/
│   ├── invitations/
│   └── ai-analysis/    # AI screenshot analysis
├── player/             # Player-only pages (protected)
│   ├── dashboard/
│   └── invitations/
└── api/                # API routes
    ├── auth/[...all]/  # Better Auth handler
    ├── teams/          # Team management
    ├── invitations/    # Invitation system
    ├── screenshots/    # AI screenshot analysis
    └── contact/        # Contact form submission
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
- **Match**: Match records with game mode, map, and result
- **Screenshot**: Screenshot uploads with AI analysis status
- **PlayerStats**: Player statistics extracted from screenshots
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

Email functionality (`lib/email.ts`) uses Resend:

- **Development**: Uses `onboarding@resend.dev` (test mode, only sends to registered email)
- **Production**: Requires domain verification at resend.com/domains
- **Templates**:
  - Team invitations with 7-day expiration (`sendInvitationEmail`)
  - Contact form messages to support (`sendContactEmail`)

The contact form (`/contact`) sends messages to the email configured in `SUPPORT_EMAIL` environment variable.

See `RESEND_EMAIL_SETUP.md` for detailed email configuration guide.

### AI Screenshot Analysis System

The application includes an AI-powered screenshot analysis system using OpenAI GPT-4o:

**Features**:
- Automatic extraction of scoreboard data from COD screenshots
- Support for multiple game modes (Hardpoint, Search & Destroy, Control)
- Support for MW2, MW3, and Black Ops 6
- Confidence scoring for extracted data
- Real-time analysis via `/coach/ai-analysis` page

**Architecture**:
- **API Route**: `app/api/screenshots/analyze/route.ts:67` - POST endpoint for image analysis
- **Components**:
  - `components/ai/screenshot-analyzer.tsx:11` - Upload and analysis UI
  - `components/ai/analysis-results.tsx:9` - Results display with tables
- **Types**: `lib/types/scoreboard.ts` - TypeScript definitions for scoreboard data

**Configuration**:
- Requires `OPENAI_API_KEY` environment variable
- Get API key at: https://platform.openai.com/api-keys
- Requires OpenAI account with credits or active subscription

**Workflow**:
1. Coach uploads screenshot via UI
2. Image is sent to OpenAI GPT-4o with structured prompt
3. AI extracts: game, mode, map, teams, players, stats
4. Results displayed in formatted tables with confidence levels

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
SUPPORT_EMAIL="contact@codcoachingteams.com"

# AI (OpenAI GPT-4o)
OPENAI_API_KEY="sk-proj-..."
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
6. **Ident Spacing**:Always use indent space 2# COD Coaching Teams

A comprehensive platform for managing Call of Duty coaching teams, built with Next.js 16, React 19, and TypeScript.

## Overview

COD Coaching Teams is a web application designed to help coaches manage their Call of Duty teams efficiently. The platform provides role-based access control, team management, player invitations, and an intuitive dashboard for coaches, players, and administrators.

## Features

### Current Features (Phase 0 - MVP)

- **Authentication & Authorization**
  - Email/password authentication
  - Google OAuth integration
  - Role-based access control (Admin, Coach, Player)
  - Password reset flow
  - Email verification

- **Team Management**
  - Create and manage teams (coaches only)
  - Team validation system (requires 4 players)
  - Team image uploads
  - Maximum 4 players per team

- **Invitation System**
  - Send email invitations to players
  - 7-day invitation expiration
  - Invitation status tracking (Pending, Accepted, Declined, Expired)
  - Automatic onboarding for new users
  - Accept invitations for existing users

- **Dashboards**
  - Admin dashboard with user and team statistics
  - Coach dashboard for team management
  - Player dashboard with team information
  - Real-time notifications

- **User Management**
  - Profile management
  - Role-based routing
  - Onboarding flows for different roles

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma Accelerate](https://www.prisma.io/accelerate)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Email**: [Resend](https://resend.com/)
- **File Uploads**: [UploadThing](https://uploadthing.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- [Git](https://git-scm.com/)

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd cod-coaching-teams-v1
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Then update the `.env` file with your configuration (see [Environment Variables](#environment-variables) section).

4. **Set up the database**

```bash
# Run Prisma migrations
pnpm prisma migrate dev

# Generate Prisma Client
pnpm prisma generate
```

5. **Seed the database (optional)**

```bash
pnpm prisma db seed
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Database

```env
# Prisma Accelerate URL for queries (with pooling/caching)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# Direct PostgreSQL URL for migrations
DIRECT_DATABASE_URL="postgresql://user:password@host:port/database"
```

### Authentication

```env
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-secret-key"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Email

```env
# Resend API key (get it from https://resend.com/api-keys)
RESEND_API_KEY="re_xxxxxxxxxx"

# Email sender (must be verified in Resend)
EMAIL_FROM="COD Coaching <noreply@yourdomain.com>"

# Support email
SUPPORT_EMAIL="contact@codcoachingteams.com"
```

### File Uploads

```env
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

## Development

### Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Commands

```bash
# Generate Prisma Client (after schema changes)
pnpm prisma generate

# Create a new migration
pnpm prisma migrate dev --name <migration_name>

# Apply migrations to production
pnpm prisma migrate deploy

# View database in Prisma Studio
pnpm prisma studio

# Check migration status
pnpm prisma migrate status

# Reset database (development only - WARNING: destroys all data)
pnpm prisma migrate reset
```

### Code Quality

```bash
# Run ESLint
pnpm lint

# Fix ESLint issues
pnpm lint --fix

# Run TypeScript type checking
pnpm tsc --noEmit
```

### Testing

```bash
# Run unit tests with Vitest
pnpm test

# Run unit tests in watch mode
pnpm test:watch

# Run E2E tests with Playwright
pnpm test:e2e

# Run E2E tests in UI mode
pnpm test:e2e:ui
```

### Build for Production

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
cod-coaching-teams-v1/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes (no auth required)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── invite/[id]/
│   │   └── contact/
│   ├── admin/                    # Admin-only routes
│   │   └── dashboard/
│   ├── coach/                    # Coach-only routes
│   │   ├── dashboard/
│   │   ├── teams/
│   │   └── invitations/
│   ├── player/                   # Player-only routes
│   │   ├── dashboard/
│   │   └── invitations/
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── teams/                # Team management
│   │   ├── invitations/          # Invitation management
│   │   └── contact/              # Contact form
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── auth/                     # Authentication components
│   ├── sidebar/                  # Sidebar navigation
│   └── ...
├── lib/                          # Utility functions
│   ├── auth.ts                   # Better Auth configuration
│   ├── auth-client.ts            # Client-side auth hooks
│   ├── prisma.ts                 # Prisma client
│   ├── email.ts                  # Email utilities
│   ├── role-redirect.ts          # Role-based redirects
│   ├── notification-links.ts     # Notification link generation
│   └── validations/              # Zod schemas
├── prisma/                       # Prisma schema and migrations
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration files
├── public/                       # Static assets
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   └── e2e/                      # E2E tests
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment variables template
├── components.json               # shadcn/ui configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.ts              # Vitest configuration
├── playwright.config.ts          # Playwright configuration
└── package.json                  # Dependencies and scripts
```

## Database Schema

The application uses the following main models:

- **User**: Core user model with role (ADMIN, COACH, PLAYER)
- **Team**: Team entity with coach relationship and validation status
- **Invitation**: Email-based team invitations with expiration
- **Notification**: In-app notifications for users
- **Session/Account**: Better Auth authentication tables
- **Verification**: Email verification and password reset tokens

For the complete schema, see `prisma/schema.prisma`.

## Role-Based Access Control

The application has three user roles:

### Admin
- Full system access
- View all users and teams
- Validate teams
- Access to admin dashboard

### Coach
- Create and manage teams
- Invite players to teams
- View team statistics
- Access to coach dashboard

### Player
- Join teams via invitation
- View own team information
- Access to player dashboard

Role-based routing is handled automatically in `middleware.ts` and `lib/role-redirect.ts`.

## Email Configuration

### Development

In development, Resend uses test mode with the `onboarding@resend.dev` sender. Emails are only sent to your registered email address.

### Production

1. **Verify your domain** at [resend.com/domains](https://resend.com/domains)
2. **Update EMAIL_FROM** in your environment variables
3. **Add DNS records** as instructed by Resend

For detailed email setup instructions, see `RESEND_EMAIL_SETUP.md`.

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Set up Prisma Accelerate**
   - Create a project at [prisma.io/accelerate](https://www.prisma.io/accelerate)
   - Copy the connection string to `DATABASE_URL`

4. **Run database migrations**

```bash
pnpm prisma migrate deploy
```

### Manual Deployment

For other hosting providers, follow these general steps:

1. Build the application: `pnpm build`
2. Set up environment variables
3. Run database migrations: `pnpm prisma migrate deploy`
4. Start the server: `pnpm start`

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run tests: `pnpm test && pnpm test:e2e`
4. Run linting: `pnpm lint`
5. Commit your changes: `git commit -m "Add my feature"`
6. Push to the branch: `git push origin feature/my-feature`
7. Create a Pull Request

## Roadmap

### Phase 1: Advanced Statistics & UX (In Progress)
- Screenshot upload for game statistics
- OCR pipeline for extracting player stats
- Player profile pages with detailed metrics
- Performance history and charts
- CSV exports

### Phase 2: Tactical Tools
- Map editor with drawing tools
- Black Ops 7 map templates
- Collaborative map editing
- Export to PNG/PDF

### Phase 3: Monetization
- Subscription system (Free/Pro/Team)
- One-time addon purchases
- Coach marketplace
- Booking and payment system
- Video session integration

### Phase 4: AI & Scale
- AI-powered gameplay analysis
- Personalized training recommendations
- Third-party integrations (YouTube, Discord, OBS)
- Internationalization
- Advanced monitoring and scaling

For the complete roadmap and technical plan, see the project documentation.

## License

All rights reserved.

## Support

For support, email contact@codcoachingteams.com or create an issue in the repository.

---

**Built with** ❤️ **by Alexandre**