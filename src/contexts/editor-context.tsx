"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { compileEmail } from "@/server/compile-email";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_WELCOME_EMAIL } from "@/lib/default-email";
import * as React from "react";

type CompiledEmail = {
  fileName: string;
  html: string;
};

type ViewportMode = "desktop" | "mobile";

type EditorContextValue = {
  activeFile: string;
  activePreview: string;
  activeTab: string;
  addFile: (filePath: string, content: string) => void;
  compile: (sandpackFiles: Record<string, { code: string }>) => Promise<void>;
  compiledEmails: CompiledEmail[];
  deleteFile: (filePath: string) => void;
  files: Record<string, string>;
  isCompiling: boolean;
  mounted: boolean;
  setActiveFile: (file: string) => void;
  setActivePreview: (fileName: string) => void;
  setActiveTab: (tab: string) => void;
  setFiles: (
    files:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void;
  setViewportMode: (mode: ViewportMode) => void;
  viewportMode: ViewportMode;
};

const DEFAULT_FILES = { "welcome.tsx": DEFAULT_WELCOME_EMAIL };

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useLocalStorage<Record<string, string>>(
    "react-email-preview-files",
    DEFAULT_FILES
  );
  const [activeFile, setActiveFile] = useState<string>("");
  const [compiledEmails, setCompiledEmails] = useState<CompiledEmail[]>([]);
  const [activePreview, setActivePreview] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (Object.keys(files).length > 0 && !activeFile) {
      setActiveFile(Object.keys(files)[0]);
    }
  }, [files, activeFile]);

  const addFile = useCallback(
    (filePath: string, content: string) => {
      setFiles((prev) => ({
        ...prev,
        [filePath]: content,
      }));
      setActiveFile(filePath);
      setActiveTab("code");
    },
    [setFiles]
  );

  const deleteFile = useCallback(
    (filePath: string) => {
      setFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[filePath];
        return newFiles;
      });

      if (activeFile === filePath) {
        const remainingFiles = Object.keys(files).filter((f) => f !== filePath);
        if (remainingFiles.length > 0) {
          setActiveFile(remainingFiles[0]);
        }
      }
    },
    [activeFile, files, setFiles]
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
      setActiveTab("preview");
    },
    [activePreview]
  );

  return (
    <EditorContext.Provider
      value={{
        mounted,
        activeTab,
        setActiveTab,
        files,
        setFiles,
        activeFile,
        setActiveFile,
        isCompiling,
        compiledEmails,
        activePreview,
        setActivePreview,
        compile,
        addFile,
        deleteFile,
        viewportMode,
        setViewportMode,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
