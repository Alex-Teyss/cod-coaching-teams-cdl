# COD Coaching Teams

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
