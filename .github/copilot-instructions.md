# React Email Preview - AI Coding Agent Instructions

## Project Overview

Next.js 16 application with React 19 for email preview functionality. Uses App Router architecture with server/client component patterns.

## Tech Stack & Key Dependencies

- **Framework**: Next.js 16.0.0 (App Router) + React 19.2.0
- **Styling**: Tailwind CSS v4 with PostCSS (`@tailwindcss/postcss`)
- **UI Components**: shadcn/ui (New York style) + Radix UI primitives
- **Theming**: `next-themes` with light/dark/system modes
- **Icons**: `lucide-react`
- **Forms**: `react-hook-form` + `zod` + `@hookform/resolvers`
- **Package Manager**: Bun (see `bun.lock`)

## Architecture & Project Structure

### Path Aliases (tsconfig.json)

Always use `@/` prefix for imports:

```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
```

### Component Organization

- **`src/app/`**: Next.js App Router pages (server components by default)
- **`src/components/ui/`**: shadcn/ui components (all client components)
- **`src/components/`**: Custom shared components (mix of server/client)
- **`src/lib/`**: Utility functions and shared logic
- **`src/hooks/`**: React hooks

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
  - Browser APIs (localStorage, window)
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
