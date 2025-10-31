"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  SandboxProvider,
  SandboxLayout,
  SandboxCodeEditor,
  SandboxFileExplorer,
  SandboxTabs,
  SandboxTabsList,
  SandboxTabsTrigger,
  SandboxTabsContent,
} from "@/components/ui/shadcn-io/sandbox";
import { CodeIcon, AppWindowIcon } from "lucide-react";
import { EmailPreview } from "@/components/email-preview";
import { EmailPreviewProvider } from "@/contexts/email-preview-context";
import { CompileButton } from "@/components/compile-button";
import { ModeToggle } from "@/components/mode-toggle";
import { appleReceiptTemplate } from "@/templates/apple-receipt";

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
        "/apple-receipt.jsx": appleReceiptTemplate,
      }}
      options={{
        activeFile: "/apple-receipt.jsx",
      }}
    >
      <EmailPreviewProvider onCompileComplete={handleCompileComplete}>
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
          <SandboxTabsContent value="code">
            <SandboxLayout>
              <SandboxFileExplorer />
              <SandboxCodeEditor showLineNumbers />
            </SandboxLayout>
          </SandboxTabsContent>
          <SandboxTabsContent value="preview">
            <EmailPreview />
          </SandboxTabsContent>
        </SandboxTabs>
      </EmailPreviewProvider>
    </SandboxProvider>
  );
}
