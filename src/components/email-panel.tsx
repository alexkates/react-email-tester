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
import { ThemeToggle } from "@/components/theme-toggle";
import { NewFileDialog } from "@/components/new-file-dialog";

interface EmailPanelProps {
  templates: Record<string, string>;
}

export function EmailPanel({ templates }: EmailPanelProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState<Record<string, string>>(templates);

  const handleCompileComplete = useCallback(() => {
    setActiveTab("preview");
  }, []);

  const handleFilesUpdate = useCallback(
    (updatedFiles: Record<string, string>) => {
      setFiles(updatedFiles);
    },
    []
  );

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <SandboxProvider
      theme={theme === "dark" ? "dark" : "light"}
      files={files}
      options={{
        activeFile: Object.keys(templates)[0],
      }}
    >
      <EmailPreviewProvider
        onCompileComplete={handleCompileComplete}
        initialFiles={templates}
        onFilesUpdate={handleFilesUpdate}
      >
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
            <h1 className="text-primary text-xl font-semibold">
              React Email Preview
            </h1>
            <div className="flex gap-2">
              <NewFileDialog />
              <CompileButton />
              <ThemeToggle />
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
