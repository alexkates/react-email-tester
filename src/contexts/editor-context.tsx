"use client";

import { useSandpack } from "@codesandbox/sandpack-react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { compileEmail } from "@/server/compile-email";
import { useLocalStorage } from "@/hooks/use-local-storage";
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
  compile: () => Promise<void>;
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
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useLocalStorage<Record<string, string>>(
    "react-email-preview-files",
    {}
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

  useEffect(() => {
    if (activeFile && sandpack.activeFile !== activeFile) {
      sandpack.openFile(activeFile);
    }
  }, [activeFile, sandpack]);

  const addFile = useCallback(
    (filePath: string, content: string) => {
      setFiles((prev) => ({
        ...prev,
        [filePath]: content,
      }));
      sandpack.addFile(filePath, content);
      setActiveFile(filePath);
      setActiveTab("code");
    },
    [sandpack, setFiles]
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
    setActiveTab("preview");
  }, [sandpack.files, activePreview]);

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
