"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  SandboxProvider,
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
import { EmailPreviewProvider } from "@/contexts/email-preview-context";
import { CompileButton } from "@/components/compile-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileExplorer } from "@/components/file-explorer";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface EmailPanelProps {
  examples: Record<string, string>;
}

export function EmailPanel({ examples }: EmailPanelProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("code");

  const [files, setFiles] = useLocalStorage<Record<string, string>>(
    "react-email-preview-files",
    examples
  );

  const [activeFile, setActiveFile] = useState<string>(
    Object.keys(files)[0] || Object.keys(examples)[0]
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
    setActiveTab("code");
  }, []);

  const handleDeleteFile = useCallback(
    (filePath: string) => {
      setFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[filePath];
        return newFiles;
      });

      // If the deleted file was active, switch to another file
      if (activeFile === filePath) {
        const remainingFiles = Object.keys(files).filter((f) => f !== filePath);
        if (remainingFiles.length > 0) {
          setActiveFile(remainingFiles[0]);
        }
      }
    },
    [activeFile, files]
  );

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
        initialFiles={examples}
        onAddFile={handleAddFile}
        onDeleteFile={handleDeleteFile}
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
              <CompileButton />
            </div>
          </SandboxTabsList>
          <SandboxTabsContent value="code">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
                <FileExplorer
                  exampleTemplate={examples["/generic.tsx"] || ""}
                />
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
            <ThemeToggle />
          </SandboxFooter>
        </SandboxTabs>
      </EmailPreviewProvider>
    </SandboxProvider>
  );
}
