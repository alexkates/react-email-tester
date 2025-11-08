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
import { CompiledEmail } from "@/types/compiled-email";
import { ViewportMode } from "@/types/viewport-mode";

type EditorContextValue = {
  activeFile: string | null;
  activePreview: string;
  activeTab: string;
  addFile: (filePath: string, content: string) => void;
  compile: (sandpackFiles: Record<string, { code: string }>) => Promise<void>;
  compiledEmails: CompiledEmail[];
  deleteFile: (filePath: string) => void;
  files: Record<string, string>;
  isCompiling: boolean;
  mounted: boolean;
  setActiveFile: (file: string | null) => void;
  setActivePreview: (fileName: string) => void;
  setActiveTab: (tab: string) => void;
  setViewportMode: (mode: ViewportMode) => void;
  viewportMode: ViewportMode;
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
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useLocalStorage<Record<string, string>>(
    "react-email-preview-files",
    {}
  );
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [compiledEmails, setCompiledEmails] = useState<CompiledEmail[]>([]);
  const [activePreview, setActivePreview] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const fileKeys = Object.keys(files);
    if (fileKeys.length === 0) {
      setActiveFile(null);
    } else if (!activeFile || !fileKeys.includes(activeFile)) {
      setActiveFile(fileKeys[0]);
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
        } else {
          setActiveFile(null);
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
        activeFile,
        activePreview,
        activeTab,
        addFile,
        compile,
        compiledEmails,
        deleteFile,
        files,
        isCompiling,
        mounted,
        setActiveFile,
        setActivePreview,
        setActiveTab,
        setViewportMode,
        viewportMode,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
