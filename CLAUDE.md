# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using React 19, TypeScript, and Tailwind CSS v4. The project is set up with shadcn/ui components (New York style) and uses pnpm as the package manager.

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

## Architecture

### Project Structure

- **App Router**: Uses Next.js 14+ App Router pattern with [app/](app/) directory
- **Component Library**: shadcn/ui components configured with:
  - Style: "new-york"
  - Base color: neutral
  - CSS variables enabled
  - Lucide icons
- **Styling**: Tailwind CSS v4 with PostCSS, using CSS variables for theming

### Path Aliases

Configured in [tsconfig.json](tsconfig.json):
- `@/*` maps to root directory
- `@/components` - UI components
- `@/lib` - Utilities (e.g., [lib/utils.ts](lib/utils.ts) with `cn()` helper)
- `@/components/ui` - shadcn/ui components
- `@/hooks` - React hooks

### Key Files

- [app/layout.tsx](app/layout.tsx) - Root layout with Geist fonts (sans & mono)
- [app/page.tsx](app/page.tsx) - Homepage
- [app/globals.css](app/globals.css) - Global styles with Tailwind directives
- [components.json](components.json) - shadcn/ui configuration
- [lib/utils.ts](lib/utils.ts) - Utility functions, notably `cn()` for merging Tailwind classes

### TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- JSX: react-jsx (React 19's automatic runtime)
- Module resolution: bundler

## Adding shadcn/ui Components

This project uses shadcn/ui. To add new components:

```bash
pnpx shadcn@latest add [component-name]
```

Components will be added to [components/ui/](components/ui/) with the configured aliases and styling.
