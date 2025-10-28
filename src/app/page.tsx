"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Home() {
  const [emailContent, setEmailContent] = useState("");

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-1 rounded-lg border"
    >
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="flex h-full flex-col overflow-hidden p-4">
          <h2 className="mb-8 text-lg font-normal">React Email or HTML</h2>
          <Textarea
            placeholder="Paste your email HTML here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="h-full resize-none font-mono text-sm"
          />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="flex h-full flex-col overflow-hidden p-4">
          <Tabs defaultValue="apple-mail" className="flex h-full flex-col">
            <TabsList>
              <TabsTrigger value="apple-mail">Apple Mail</TabsTrigger>
              <TabsTrigger value="gmail">Gmail</TabsTrigger>
            </TabsList>
            <TabsContent
              value="apple-mail"
              className="mt-4 flex-1 overflow-hidden"
            >
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
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
