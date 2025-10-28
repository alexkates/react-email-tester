"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmail } from "@/components/email-context";

export function EmailPreviewPanel() {
  const { emailContent } = useEmail();

  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <Tabs defaultValue="apple-mail" className="flex h-full flex-col">
        <TabsList>
          <TabsTrigger value="apple-mail">Apple Mail</TabsTrigger>
          <TabsTrigger value="gmail">Gmail</TabsTrigger>
        </TabsList>
        <TabsContent value="apple-mail" className="mt-4 flex-1 overflow-hidden">
          <div className="h-full overflow-auto rounded-lg border bg-muted/30 p-4">
            <div
              className="wrap-break-word"
              dangerouslySetInnerHTML={{ __html: emailContent }}
            />
          </div>
        </TabsContent>
        <TabsContent value="gmail" className="mt-4 flex-1 overflow-hidden">
          <div className="h-full overflow-auto rounded-lg border bg-muted/30 p-4">
            <div
              className="wrap-break-word"
              dangerouslySetInnerHTML={{ __html: emailContent }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
