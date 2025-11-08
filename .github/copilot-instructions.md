# React Email Tester - AI Coding Agent Instructions

## Project Overview

A modern browser-based email template editor and previewer built with Next.js 16 and React 19. Enables developers to write React email components using `@react-email/components` with live preview, multi-file support, and responsive viewport testing. Uses App Router architecture with server/client component patterns.

## Tech Stack & Key Dependencies

### Core Framework

- **Framework**: Next.js 16.0.1 (App Router) + React 19.2.0
- **Language**: TypeScript 5.9.3 (strict mode)
- **Runtime**: Bun (primary package manager)

### Email Functionality

- **Email Components**: `@react-email/components` 1.0.0 + `@react-email/render` 2.0.0
- **Code Editor**: `@codesandbox/sandpack-react` 2.20.0
- **Bundler**: `esbuild` 0.25.12 (for runtime email compilation)

### Styling & UI

- **CSS Framework**: Tailwind CSS v4 with PostCSS (`@tailwindcss/postcss` 4.1.17)
- **UI Components**: shadcn/ui (New York style) + Radix UI primitives
- **Theming**: `next-themes` 0.4.6 (light/dark/system modes)
- **Icons**: `lucide-react` 0.553.0
- **Utilities**: `class-variance-authority`, `clsx`, `tailwind-merge`

### Forms & Validation

- **Forms**: `react-hook-form` 7.66.0
- **Validation**: `zod` 4.1.12 + `@hookform/resolvers` 5.2.2

### Code Quality

- **Formatter**: Prettier 3.6.2 + `prettier-plugin-tailwindcss` 0.7.1

## Architecture & Project Structure

### Directory Layout

```
src/
├── app/                    # Next.js App Router (server components by default)
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page (client component with SandboxProvider)
│   └── globals.css        # Tailwind v4 theme configuration
├── components/            # Feature components
│   ├── editor.tsx         # Main editor interface with resizable panels
│   ├── email-preview.tsx  # Compiled email HTML/text preview
│   ├── file-explorer.tsx  # File management sidebar
│   ├── compile-button.tsx # Email compilation trigger
│   └── ui/               # shadcn/ui components (all client components)
├── contexts/             # React Context providers
│   ├── editor-context.tsx # Editor state (files, compilation, viewport)
│   └── theme-context.tsx  # Theme switching logic
├── hooks/                # Custom React hooks
│   └── use-mobile.ts     # Mobile detection utility
├── lib/                  # Utility functions
│   ├── utils.ts          # cn() utility for className merging
│   └── default-email.ts  # Initial welcome email template
├── server/               # Server-side logic
│   └── compile-email.ts  # esbuild-based email compilation
└── types/                # TypeScript type definitions
    ├── compiled-email.ts # Email compilation result types
    └── viewport-mode.ts  # Viewport mode union type
```

### Path Aliases (tsconfig.json)

Always use `@/` prefix for imports:

```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/contexts/editor-context";
import { compileEmail } from "@/server/compile-email";
```

### Component Organization

- **`src/app/`**: Next.js App Router pages (server components by default)
- **`src/components/ui/`**: shadcn/ui components (all client components)
- **`src/components/`**: Custom feature components (mix of server/client)
- **`src/contexts/`**: React Context providers (client components with `"use client"`)
- **`src/lib/`**: Utility functions and shared logic (pure functions)
- **`src/hooks/`**: Custom React hooks (client-side only)
- **`src/server/`**: Server-side compilation and data processing
- **`src/types/`**: TypeScript type definitions and interfaces

## Styling Conventions

### Tailwind v4 Configuration

This project uses **Tailwind CSS v4** with inline `@theme` directive in `globals.css`. Key differences from v3:

- No `tailwind.config.js` - config is in CSS via `@theme inline`
- Uses `@import "tailwindcss"` instead of `@tailwind` directives
- Custom variants: `@custom-variant dark (&:is(.dark *))`

### Design System

- **Color System**: OKLCH color space for all theme colors (not HSL)
- **Theme Variables**: Follow shadcn naming (`--background`, `--foreground`, `--primary`, etc.)
- **Radius Tokens**: `--radius-sm|md|lg|xl` derived from `--radius` (0.625rem base)
- **Fonts**: Geist Sans + Geist Mono via `next/font/google`

### Component Styling Pattern

All UI components use:

```typescript
import { cn } from "@/lib/utils"; // twMerge + clsx

<Component className={cn("base-styles", conditionalClasses, className)} />;
```

### Data Attributes

Components use `data-slot` for consistent styling hooks:

```tsx
<button data-slot="button" />
<div data-slot="card-header" />
```

## UI Component Patterns (shadcn/ui)

### Component Anatomy

shadcn components follow consistent structure:

1. Import Radix UI primitives
2. Use `class-variance-authority` (cva) for variants
3. Export wrapper function accepting `VariantProps`
4. Always forward `className` and spread props

Example from `button.tsx`:

```typescript
const buttonVariants = cva("base-classes", {
  variants: { variant: {...}, size: {...} },
  defaultVariants: { variant: "default", size: "default" }
})

function Button({ variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

### Compound Components

Components like Card export multiple related components:

```typescript
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
```

## Development Workflow

### Commands

```bash
bun dev      # Start dev server (http://localhost:3000)
bun build    # Production build
bun start    # Start production server
```

### Client vs Server Components

- **Default**: All components in `app/` are server components
- **Client markers**: Use `"use client"` directive for:
  - Interactive components (onClick, useState, etc.)
  - Browser APIs (window, etc.)
  - React hooks (useEffect, useContext)
  - Theme components (ThemeToggle, ThemeProvider)
  - All shadcn UI components in `components/ui/`

### Theme Implementation

Root layout sets up theming:

```tsx
<html suppressHydrationWarning>
  {" "}
  {/* Required for next-themes */}
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    {children}
  </ThemeProvider>
</html>
```

## Code Conventions

### TypeScript

- Strict mode enabled
- Use `React.ComponentProps<"element">` for prop spreading
- Component prop types: `{ children }: Readonly<{ children: React.ReactNode }>`

### Component Files

- One component per file for UI components
- Export component and any related types/variants
- Use named exports for compound components
- **Prefer smaller, focused components**: Break down complex UI into smaller, reusable components rather than building monolithic components. This improves maintainability, testability, and reusability

### Comments

- **Do NOT add one-line comments for obvious code**: Avoid comments like "Check if we're in the browser", "State to store our value", or "Build with esbuild"
- Comments should explain **why**, not **what**: The code itself should be self-documenting
- Use comments for complex logic, non-obvious decisions, or important context that can't be expressed in code

### Styling Classes

- Order: Layout → Spacing → Colors → Typography → Effects
- Use semantic color tokens (`bg-primary`, `text-foreground`) not raw colors
- Responsive modifiers: `md:text-sm` (mobile-first)
- Dark mode: `dark:bg-input/30` (class-based strategy)

## Key Files Reference

- **`components.json`**: shadcn/ui configuration (style: "new-york")
- **`src/app/layout.tsx`**: Root layout with theme + header structure
- **`src/lib/utils.ts`**: `cn()` utility for className merging
- **`src/app/globals.css`**: Theme variables and Tailwind imports

## Common Patterns

### Adding New shadcn Components

```bash
# Components are already installed, check components/ui/ first
# If missing, follow shadcn docs for manual copy or npx shadcn@latest add
```

### Creating New Pages

```typescript
// src/app/new-page/page.tsx (server component by default)
export default function NewPage() {
  return <div>Content</div>;
}
```

### Creating Interactive Features

```typescript
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function InteractiveComponent() {
  const [state, setState] = useState();
  // ... logic
}
```
