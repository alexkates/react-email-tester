"use client";

import { Textarea } from "@/components/ui/textarea";
import { useEmail } from "@/components/email-context";

export function EmailInputPanel() {
  const { emailContent, setEmailContent } = useEmail();

  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <h2 className="mb-8 text-lg font-normal">React Email or HTML</h2>
      <Textarea
        placeholder="Paste your email HTML here..."
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        className="h-full resize-none font-mono text-sm"
      />
    </div>
  );
}
