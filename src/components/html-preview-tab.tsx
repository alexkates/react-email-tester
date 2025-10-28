"use client";

import { TabsContent } from "@/components/ui/tabs";
import { useEmail } from "@/components/email-context";

export function HtmlPreviewTab({ value }: { value: string }) {
  const { emailContent } = useEmail();

  return (
    <TabsContent value={value} className="mt-4 flex-1 overflow-hidden">
      <div className="h-full overflow-auto rounded-lg bg-muted/30 p-4">
        <div
          className="wrap-break-word"
          dangerouslySetInnerHTML={{ __html: emailContent }}
        />
      </div>
    </TabsContent>
  );
}
