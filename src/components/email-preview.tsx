"use client";

import { useEmailPreview } from "@/contexts/email-preview-context";

export function EmailPreview() {
  const { compiledHtml } = useEmailPreview();

  return (
    <div className="h-full overflow-auto bg-muted/30 p-4">
      <div
        className="wrap-break-word"
        dangerouslySetInnerHTML={{ __html: compiledHtml }}
      />
    </div>
  );
}
