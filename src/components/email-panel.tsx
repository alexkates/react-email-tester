"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  SandboxProvider,
  SandboxLayout,
  SandboxCodeEditor,
  SandboxTabs,
  SandboxTabsList,
  SandboxTabsTrigger,
  SandboxTabsContent,
} from "@/components/ui/shadcn-io/sandbox";
import { CodeIcon, AppWindowIcon } from "lucide-react";
import { EmailPreview } from "@/components/email-preview";
import { EmailPreviewProvider } from "@/contexts/email-preview-context";
import { FileManagerProvider } from "@/contexts/file-manager-context";
import { CompileButton } from "@/components/compile-button";
import { ModeToggle } from "@/components/mode-toggle";
import { FileExplorer } from "@/components/file-explorer";
import { defaultEmailContent } from "@/lib/default-email";

export function EmailPanel() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("code");

  const handleCompileComplete = useCallback(() => {
    setActiveTab("preview");
  }, []);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <SandboxProvider
      theme={theme === "dark" ? "dark" : "light"}
      files={{
        "/index.jsx": defaultEmailContent,
      }}
      options={{
        activeFile: "/index.jsx",
      }}
    >
      <FileManagerProvider>
        <EmailPreviewProvider onCompileComplete={handleCompileComplete}>
          <SandboxLayout>
            <SandboxTabs value={activeTab} onValueChange={setActiveTab}>
              <SandboxTabsList className="justify-between">
                <div>
                  <SandboxTabsTrigger value="code">
                    <CodeIcon size={14} />
                    Code
                  </SandboxTabsTrigger>
                  <SandboxTabsTrigger value="preview">
                    <AppWindowIcon size={14} />
                    Preview
                  </SandboxTabsTrigger>
                </div>
                <h1 className="text-xl font-semibold text-primary">
                  React Email Preview
                </h1>
                <div className="flex gap-2">
                  <CompileButton />
                  <ModeToggle />
                </div>
              </SandboxTabsList>
              <SandboxTabsContent className="overflow-hidden" value="code">
                <div className="flex h-full">
                  <div className="w-64 shrink-0">
                    <FileExplorer />
                  </div>
                  <div className="flex-1">
                    <SandboxCodeEditor
                      showLineNumbers
                      showInlineErrors
                      className="h-full"
                    />
                  </div>
                </div>
              </SandboxTabsContent>
              <SandboxTabsContent className="overflow-hidden" value="preview">
                <EmailPreview />
              </SandboxTabsContent>
            </SandboxTabs>
          </SandboxLayout>
        </EmailPreviewProvider>
      </FileManagerProvider>
    </SandboxProvider>
  );
}
