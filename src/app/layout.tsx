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

const title = "React Email Preview";
const description =
  "Create and test React Email templates using an interactive editor with live preview.";
const url = "https://react-email-preview.app";
const images = ["/opengraph-image.png"];
const keywords = [
  "react",
  "email",
  "preview",
  "templates",
  "editor",
  "react-email",
];

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  keywords,
  authors: [{ name: "Alex Kates" }],
  creator: "Alex Kates",
  openGraph: {
    title,
    description,
    type: "website",
    siteName: title,
    images,
    url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images,
    creator: "@thealexkates",
    site: "@thealexkates",
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
