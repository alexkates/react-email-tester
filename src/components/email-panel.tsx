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
  defaultTemplates: Record<string, string>;
}

export function EmailPanel({ defaultTemplates }: EmailPanelProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState<Record<string, string>>(defaultTemplates);
  const [activeFile, setActiveFile] = useState<string>(
    Object.keys(defaultTemplates)[0]
  );

  const handleCompileComplete = useCallback(() => {
    setActiveTab("preview");
  }, []);

  const handleAddFile = useCallback((filePath: string, content: string) => {
    setFiles((prev) => ({
      ...prev,
      [filePath]: content,
    }));
    setActiveFile(filePath);
  }, []);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <SandboxProvider
      theme={theme === "dark" ? "dark" : "light"}
      files={files}
      options={{
        activeFile,
        visibleFiles: Object.keys(files),
      }}
    >
      <EmailPreviewProvider
        onCompileComplete={handleCompileComplete}
        initialFiles={defaultTemplates}
        onAddFile={handleAddFile}
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
              <NewFileDialog
                defaultTemplate={defaultTemplates["/generic.tsx"] || ""}
              />
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
