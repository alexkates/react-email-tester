"use client";

import "web-streams-polyfill/polyfill";
import { useSandpack } from "@codesandbox/sandpack-react";
import { createContext, useContext, useState, useCallback } from "react";
import { compileEmail } from "@/server/compile-email";
import * as React from "react";

type CompiledEmail = {
  fileName: string;
  html: string;
};

type ViewportMode = "desktop" | "mobile";

type EmailPreviewContextValue = {
  isCompiling: boolean;
  compiledEmails: CompiledEmail[];
  activePreview: string;
  setActivePreview: (fileName: string) => void;
  compile: () => Promise<void>;
  onCompileComplete?: () => void;
  addFile: (filePath: string, content: string) => void;
  deleteFile: (filePath: string) => void;
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
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
  onAddFile,
  onDeleteFile,
}: {
  children: React.ReactNode;
  onCompileComplete?: () => void;
  onAddFile?: (filePath: string, content: string) => void;
  onDeleteFile?: (filePath: string) => void;
}) {
  const { sandpack } = useSandpack();
  const [compiledEmails, setCompiledEmails] = useState<CompiledEmail[]>([]);
  const [activePreview, setActivePreview] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");

  const addFile = useCallback(
    (filePath: string, content: string) => {
      onAddFile?.(filePath, content);
    },
    [onAddFile]
  );

  const deleteFile = useCallback(
    (filePath: string) => {
      onDeleteFile?.(filePath);
    },
    [onDeleteFile]
  );

  const compile = useCallback(async () => {
    setIsCompiling(true);

    const emailFiles = Object.keys(sandpack.files).filter(
      (path) =>
        (path.endsWith(".jsx") || path.endsWith(".tsx")) &&
        !path.includes("node_modules")
    );

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
        addFile,
        deleteFile,
        viewportMode,
        setViewportMode,
      }}
    >
      {children}
    </EmailPreviewContext.Provider>
  );
}
