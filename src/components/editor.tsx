"use client";

import {
  SandboxCodeEditor,
  SandboxTabs,
  SandboxTabsList,
  SandboxTabsTrigger,
  SandboxTabsContent,
  SandboxFooter,
} from "@/components/ui/shadcn-io/sandbox";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { CodeIcon, AppWindowIcon } from "lucide-react";
import { EmailPreview } from "@/components/email-preview";
import { useEditor } from "@/contexts/editor-context";
import { CompileButton } from "@/components/compile-button";
import { ViewportToggle } from "@/components/viewport-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileExplorer } from "@/components/file-explorer";
import { EmptyState } from "@/components/empty-state";

export function Editor() {
  const { activeTab, setActiveTab, files } = useEditor();

  const hasFiles = Object.keys(files).length > 0;

  if (!hasFiles) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b p-4">
          <h1 className="text-primary text-center text-xl font-semibold">
            React Email Preview
          </h1>
        </div>
        <div className="flex-1">
          <EmptyState />
        </div>
        <div className="flex items-center justify-between border-t p-4">
          <div />
          <p className="text-muted-foreground text-sm">
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Next.js
            </a>
            ,{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-4 transition-colors"
            >
              shadcn/ui
            </a>{" "}
            and{" "}
            <a
              href="https://react.email"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-4 transition-colors"
            >
              react-email
            </a>
          </p>
          <ThemeToggle />
        </div>
      </div>
    );
  }

  return (
    <SandboxTabs value={activeTab} onValueChange={setActiveTab}>
      <SandboxTabsList className="justify-between">
        <div className="flex flex-1 justify-start">
          <SandboxTabsTrigger value="code">
            <CodeIcon size={14} />
            Code
          </SandboxTabsTrigger>
          <SandboxTabsTrigger value="preview">
            <AppWindowIcon size={14} />
            Preview
          </SandboxTabsTrigger>
        </div>
        <h1 className="text-primary text-xl font-semibold">
          React Email Tester
        </h1>
        <div className="flex flex-1 justify-end gap-2">
          {activeTab === "preview" ? <ViewportToggle /> : <CompileButton />}
        </div>
      </SandboxTabsList>
      <SandboxTabsContent value="code">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
            <FileExplorer />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <SandboxCodeEditor showLineNumbers />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SandboxTabsContent>
      <SandboxTabsContent value="preview">
        <EmailPreview />
      </SandboxTabsContent>
      <SandboxFooter>
        <div />
        <p className="text-muted-foreground text-sm">
          Built with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Next.js
          </a>
          ,{" "}
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline underline-offset-4 transition-colors"
          >
            shadcn/ui
          </a>{" "}
          and{" "}
          <a
            href="https://react.email"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline underline-offset-4 transition-colors"
          >
            react-email
          </a>
        </p>
        <ThemeToggle />
      </SandboxFooter>
    </SandboxTabs>
  );
}
