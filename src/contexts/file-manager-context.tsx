"use client";

import { createContext, useContext, useState, useCallback } from "react";
import * as React from "react";

type FileManagerContextValue = {
  visibleFiles: string[];
  files: Record<string, string>;
  addFile: (filePath: string, content: string) => void;
};

const FileManagerContext = createContext<FileManagerContextValue | undefined>(
  undefined
);

export const useFileManager = () => {
  const context = useContext(FileManagerContext);
  if (!context) {
    throw new Error("useFileManager must be used within a FileManagerProvider");
  }
  return context;
};

export function FileManagerProvider({
  children,
  initialFiles,
}: {
  children: React.ReactNode;
  initialFiles: Record<string, string>;
}) {
  const [files, setFiles] = useState<Record<string, string>>(initialFiles);
  const [visibleFiles, setVisibleFiles] = useState<string[]>(
    Object.keys(initialFiles)
  );

  const addFile = useCallback((filePath: string, content: string) => {
    setFiles((prev) => ({
      ...prev,
      [filePath]: content,
    }));
    setVisibleFiles((prev) => {
      if (prev.includes(filePath)) return prev;
      return [...prev, filePath];
    });
  }, []);

  return (
    <FileManagerContext.Provider value={{ visibleFiles, files, addFile }}>
      {children}
    </FileManagerContext.Provider>
  );
}
