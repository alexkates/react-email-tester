import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "React Email Preview",
    template: "%s | React Email Preview",
  },
  description:
    "Create and test React Email templates using an interactive editor with live preview.",
  keywords: ["react", "email", "preview", "templates", "editor", "react-email"],
  authors: [{ name: "Alex Kates" }],
  creator: "Alex Kates",
  metadataBase: new URL("https://react-email-preview.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://react-email-preview.app",
    title: "React Email Preview",
    description:
      "Create and test React Email templates using an interactive editor with live preview.",
    siteName: "React Email Preview",
  },
  twitter: {
    card: "summary_large_image",
    title: "React Email Preview",
    description:
      "Create and test React Email templates using an interactive editor with live preview.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen flex-col overflow-hidden">
            <main className="container mx-auto flex max-w-7xl flex-1 flex-col overflow-hidden px-4 py-6">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
