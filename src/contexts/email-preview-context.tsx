"use client";

import "web-streams-polyfill/polyfill";
import { useSandpack } from "@codesandbox/sandpack-react";
import { createContext, useContext, useState, useCallback } from "react";
import { compileEmail } from "@/app/actions/compile-email";
import * as React from "react";

type CompiledEmail = {
  fileName: string;
  html: string;
};

type EmailPreviewContextValue = {
  isCompiling: boolean;
  compiledEmails: CompiledEmail[];
  activePreview: string;
  setActivePreview: (fileName: string) => void;
  compile: () => Promise<void>;
  onCompileComplete?: () => void;
  files: Record<string, string>;
  addFile: (filePath: string, content: string) => void;
};

const EmailPreviewContext = createContext<EmailPreviewContextValue | undefined>(
  undefined
);

export const useEmailPreview = () => {
  const context = useContext(EmailPreviewContext);
  if (!context) {
    throw new Error(
      "useEmailPreview must be used within an EmailPreviewProvider"
    );
  }
  return context;
};

export function EmailPreviewProvider({
  children,
  onCompileComplete,
  initialFiles,
  onFilesUpdate,
}: {
  children: React.ReactNode;
  onCompileComplete?: () => void;
  initialFiles: Record<string, string>;
  onFilesUpdate?: (files: Record<string, string>) => void;
}) {
  const { sandpack } = useSandpack();
  const [compiledEmails, setCompiledEmails] = useState<CompiledEmail[]>([]);
  const [activePreview, setActivePreview] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [files, setFiles] = useState<Record<string, string>>(initialFiles);

  const addFile = useCallback(
    (filePath: string, content: string) => {
      const updatedFiles = {
        ...files,
        [filePath]: content,
      };
      setFiles(updatedFiles);
      onFilesUpdate?.(updatedFiles);

      // Also update Sandpack
      sandpack.updateFile(filePath, content);
      setTimeout(() => {
        sandpack.setActiveFile(filePath);
      }, 50);
    },
    [files, onFilesUpdate, sandpack]
  );

  const compile = useCallback(async () => {
    setIsCompiling(true);

    // Get all email files (jsx/tsx files)
    const emailFiles = Object.keys(sandpack.files).filter(
      (path) =>
        (path.endsWith(".jsx") || path.endsWith(".tsx")) &&
        !path.includes("node_modules")
    );

    // Compile all files
    const compiledResults = await Promise.all(
      emailFiles.map(async (filePath) => {
        const emailContent = sandpack.files[filePath]?.code || "";
        const html = await compileEmail(emailContent);
        return {
          fileName: filePath.replace("/", ""),
          html,
        };
      })
    );

    setCompiledEmails(compiledResults);

    // Set active preview to the first file if not set
    if (compiledResults.length > 0 && !activePreview) {
      setActivePreview(compiledResults[0].fileName);
    }

    setIsCompiling(false);
    onCompileComplete?.();
  }, [sandpack.files, activePreview, onCompileComplete]);

  return (
    <EmailPreviewContext.Provider
      value={{
        isCompiling,
        compiledEmails,
        activePreview,
        setActivePreview,
        compile,
        onCompileComplete,
        files,
        addFile,
      }}
    >
      {children}
    </EmailPreviewContext.Provider>
  );
}
