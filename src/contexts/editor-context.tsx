"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { compileEmail } from "@/server/compile-email";
import { CompiledEmail } from "@/types/compiled-email";
import { ViewportMode } from "@/types/viewport-mode";
import { useSandpack } from "@codesandbox/sandpack-react";

type EditorContextValue = {
  activePreview: string;
  compile: (sandpackFiles: Record<string, { code: string }>) => Promise<void>;
  compiledEmails: CompiledEmail[];
  isCompiling: boolean;
  setActivePreview: (fileName: string) => void;
  setViewportMode: (mode: ViewportMode) => void;
  viewportMode: ViewportMode;
  visibleFiles: string[];
};

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const { sandpack } = useSandpack();
  const [compiledEmails, setCompiledEmails] = useState<CompiledEmail[]>([]);
  const [activePreview, setActivePreview] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");

  const visibleFiles = Object.keys(sandpack.files).filter((path) =>
    path.endsWith(".tsx")
  );

  const compile = useCallback(
    async (sandpackFiles: Record<string, { code: string }>) => {
      setIsCompiling(true);

      const emailFiles = Object.keys(sandpackFiles).filter(
        (path) =>
          (path.endsWith(".jsx") || path.endsWith(".tsx")) &&
          !path.includes("node_modules")
      );

      const compiledResults = await Promise.all(
        emailFiles.map(async (filePath) => {
          const emailContent = sandpackFiles[filePath]?.code || "";
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
    },
    [activePreview]
  );

  return (
    <EditorContext.Provider
      value={{
        activePreview,
        compile,
        compiledEmails,
        isCompiling,
        setActivePreview,
        setViewportMode,
        viewportMode,
        visibleFiles,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
