"use client";

import {
  SandboxCodeEditor,
  SandboxTabs,
  SandboxTabsList,
  SandboxTabsContent,
  SandboxFooter,
} from "@/components/ui/shadcn-io/sandbox";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { CodeIcon, AppWindowIcon, GithubIcon } from "lucide-react";
import { EmailPreview } from "@/components/email-preview";
import { CompileButton } from "@/components/compile-button";
import { ViewportToggle } from "@/components/viewport-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileExplorer } from "@/components/file-explorer";
import { EmptyState } from "@/components/empty-state";
import { useEditor } from "@/contexts/editor-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

export function Editor() {
  const { visibleFiles } = useEditor();
  const [activeTab, setActiveTab] = useState("code");

  const hasFiles = visibleFiles.length > 0;

  if (!hasFiles) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b p-4">
          <h1 className="text-primary text-center text-xl font-semibold">
            React Email Tester
          </h1>
        </div>
        <div className="flex-1">
          <EmptyState />
        </div>
        <div className="flex items-center justify-between border-t p-4">
          <a
            href="https://github.com/alexkates/react-email-tester"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="View source on GitHub"
          >
            <GithubIcon size={18} />
          </a>
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
          <ButtonGroup>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("code")}
              className={cn(
                activeTab === "code" && "bg-accent text-accent-foreground"
              )}
            >
              <CodeIcon size={14} />
              Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("preview")}
              className={cn(
                activeTab === "preview" && "bg-accent text-accent-foreground"
              )}
            >
              <AppWindowIcon size={14} />
              Preview
            </Button>
          </ButtonGroup>
        </div>
        <h1 className="text-primary text-xl font-semibold">
          React Email Tester
        </h1>
        <div className="flex flex-1 justify-end gap-2">
          {activeTab === "preview" ? (
            <ViewportToggle />
          ) : (
            <CompileButton onCompileComplete={() => setActiveTab("preview")} />
          )}
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
        <a
          href="https://github.com/alexkates/react-email-tester"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="View source on GitHub"
        >
          <GithubIcon size={18} />
        </a>
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
