"use client";

import { EmailProvider } from "@/components/email-context";
import { EmailPanel } from "@/components/email-panel";

export default function Home() {
  return (
    <EmailProvider>
      <EmailPanel />
    </EmailProvider>
  );
}
