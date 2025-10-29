"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { SandpackFiles } from "@codesandbox/sandpack-react";
import { useSandpack } from "@codesandbox/sandpack-react";
import * as React from "react";

type FileManagerContextValue = {
  activeFile: string;
  setActiveFile: (path: string) => void;
  createFile: (fileName: string, content?: string) => void;
  deleteFile: (path: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
  getEmailFiles: () => string[];
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

const defaultEmailTemplate = `import * as React from 'react';
import { Html, Button, Hr, Text } from "@react-email/components";

export function MyTemplate(props) {
  return (
    <Html lang="en">
      <Text>New Email Template</Text>
      <Hr />
      <Button href="https://example.com">Click me</Button>
    </Html>
  );
}

export default MyTemplate;`;

export function FileManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sandpack } = useSandpack();
  const [activeFile, setActiveFileState] = useState("/index.jsx");

  const setActiveFile = useCallback(
    (path: string) => {
      setActiveFileState(path);
      sandpack.setActiveFile(path);
    },
    [sandpack]
  );

  const createFile = useCallback(
    (fileName: string, content?: string) => {
      // Ensure fileName has a valid extension
      let finalFileName = fileName;
      if (!fileName.endsWith(".jsx") && !fileName.endsWith(".tsx")) {
        finalFileName = `${fileName}.jsx`;
      }

      // Ensure it starts with /
      const path = finalFileName.startsWith("/")
        ? finalFileName
        : `/${finalFileName}`;

      // Don't create if already exists
      if (sandpack.files[path]) {
        console.warn(`File ${path} already exists`);
        return;
      }

      sandpack.addFile(path, content || defaultEmailTemplate);
      setActiveFile(path);
    },
    [sandpack, setActiveFile]
  );

  const deleteFile = useCallback(
    (path: string) => {
      // Don't allow deleting the last file
      const emailFiles = getEmailFiles();
      if (emailFiles.length <= 1) {
        console.warn("Cannot delete the last file");
        return;
      }

      sandpack.deleteFile(path);

      // If we deleted the active file, switch to another one
      if (activeFile === path) {
        const remainingFiles = emailFiles.filter((f) => f !== path);
        if (remainingFiles.length > 0) {
          setActiveFile(remainingFiles[0]);
        }
      }
    },
    [sandpack, activeFile, setActiveFile]
  );

  const renameFile = useCallback(
    (oldPath: string, newPath: string) => {
      // Ensure newPath starts with /
      const finalNewPath = newPath.startsWith("/") ? newPath : `/${newPath}`;

      // Don't rename if target already exists
      if (sandpack.files[finalNewPath]) {
        console.warn(`File ${finalNewPath} already exists`);
        return;
      }

      const content = sandpack.files[oldPath]?.code || "";
      sandpack.addFile(finalNewPath, content);
      sandpack.deleteFile(oldPath);

      // Update active file if we renamed it
      if (activeFile === oldPath) {
        setActiveFile(finalNewPath);
      }
    },
    [sandpack, activeFile, setActiveFile]
  );

  const getEmailFiles = useCallback(() => {
    return Object.keys(sandpack.files).filter(
      (path) =>
        (path.endsWith(".jsx") || path.endsWith(".tsx")) &&
        !path.includes("node_modules")
    );
  }, [sandpack.files]);

  return (
    <FileManagerContext.Provider
      value={{
        activeFile,
        setActiveFile,
        createFile,
        deleteFile,
        renameFile,
        getEmailFiles,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  );
}
