# React Email Tester

A modern, browser-based email template editor and previewer built with Next.js 16, React 19, and [react-email](https://react.email). Write React email components with instant visual feedback in multiple viewport sizes.

## Features

- **Live Code Editor**: Write React email components with syntax highlighting powered by Sandpack
- **Real-time Preview**: See compiled email output instantly with HTML and plain text views
- **Responsive Viewports**: Test emails across Desktop, Mobile, and Source code views
- **Multi-file Support**: Organize complex email templates with a file explorer
- **Dark Mode**: Built-in theme switching with system preference detection
- **Type-safe**: Full TypeScript support with strict mode enabled
- **Modern Stack**: Next.js 16 App Router + React 19 + Tailwind v4

## Tech Stack

- **Framework**: [Next.js 16.0.0](https://nextjs.org) with App Router
- **UI Library**: [React 19.2.0](https://react.dev)
- **Email**: [@react-email/components](https://react.email)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Code Editor**: [@codesandbox/sandpack-react](https://sandpack.codesandbox.io/)
- **Build Tool**: [esbuild](https://esbuild.github.io/)
- **Package Manager**: [Bun](https://bun.sh)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/alexkates/react-email-tester.git
cd react-email-tester

# Install dependencies
bun install
```

### Development

```bash
# Start the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the editor.

### Production

```bash
# Build for production
bun build

# Start production server
bun start
```

## Usage

### Writing Email Templates

Create React components using `@react-email/components`:

```tsx
import { Html, Button, Text } from "@react-email/components";

export default function WelcomeEmail() {
  return (
    <Html>
      <Text>Welcome to our platform!</Text>
      <Button href="https://example.com">Get Started</Button>
    </Html>
  );
}
```

### Available Components

All [@react-email/components](https://react.email/docs/components/html) are available:

- `Html`, `Head`, `Body`, `Container`
- `Button`, `Link`, `Text`, `Heading`
- `Img`, `Hr`, `Section`, `Column`, `Row`
- And more...

### File Management

- **Create**: Click "New File" to add email templates
- **Switch**: Use the file explorer to navigate between files
- **Compile**: Click "Compile" to generate HTML and preview

### Viewport Modes

- **Desktop**: Full-width email preview (600px+)
- **Mobile**: Mobile-optimized preview (375px)

## Architecture

### Server-Side Compilation

Email templates are compiled server-side using `esbuild`:

1. User code is bundled with esbuild
2. React components are rendered to HTML via `@react-email/render`
3. Sandboxed execution prevents arbitrary code execution

## Scripts

```bash
bun dev           # Start development server
bun build         # Build for production
bun start         # Start production server
bun format        # Format code with Prettier
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

Built with:

- [Next.js](https://nextjs.org) - React framework
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [react-email](https://react.email) - Email component library
- [Sandpack](https://sandpack.codesandbox.io/) - Code editor
