"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EmailProvider, useEmail } from "@/components/email-context";

function EmailPanel() {
  const { emailContent, setEmailContent } = useEmail();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border p-4">
      <Tabs defaultValue="code" className="flex h-full flex-col">
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="plain-text">Plain Text</TabsTrigger>
          <TabsTrigger value="apple-mail">Apple Mail</TabsTrigger>
          <TabsTrigger value="gmail">Gmail</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="mt-4 flex-1 overflow-hidden">
          <Textarea
            placeholder="Paste your email HTML here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="h-full resize-none font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="plain-text" className="mt-4 flex-1 overflow-hidden">
          <div className="h-full overflow-auto rounded-lg border bg-muted/30 p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {emailContent.replace(/<[^>]*>/g, "")}
            </pre>
          </div>
        </TabsContent>

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

export default function Home() {
  return (
    <EmailProvider>
      <EmailPanel />
    </EmailProvider>
  );
}
