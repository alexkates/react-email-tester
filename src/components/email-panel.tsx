"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeTab } from "@/components/code-tab";
import { HtmlPreviewTab } from "@/components/html-preview-tab";

export function EmailPanel() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border p-4">
      <Tabs defaultValue="code" className="flex h-full flex-col">
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <CodeTab />
        <HtmlPreviewTab value="preview" />
      </Tabs>
    </div>
  );
}
