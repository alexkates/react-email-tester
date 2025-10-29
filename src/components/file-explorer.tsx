"use client";

import { useState } from "react";
import { useFileManager } from "@/contexts/file-manager-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function FileExplorer() {
  const {
    activeFile,
    setActiveFile,
    createFile,
    deleteFile,
    renameFile,
    getEmailFiles,
  } = useFileManager();

  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editFileName, setEditFileName] = useState("");

  const files = getEmailFiles();

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      createFile(newFileName.trim());
      setNewFileName("");
      setIsCreating(false);
    }
  };

  const handleRenameFile = (oldPath: string) => {
    if (editFileName.trim() && editFileName !== oldPath.replace("/", "")) {
      const newPath = editFileName.startsWith("/")
        ? editFileName
        : `/${editFileName}`;
      renameFile(oldPath, newPath);
    }
    setEditingFile(null);
    setEditFileName("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    action: () => void,
    cancel: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  return (
    <div className="flex h-full flex-col border-r bg-secondary/30">
      <div className="flex items-center justify-between border-b bg-secondary p-2">
        <h3 className="font-semibold text-sm">Files</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsCreating(true)}
          className="h-7 w-7 p-0"
          title="New file"
        >
          <PlusIcon size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {isCreating && (
            <div className="flex items-center gap-1">
              <Input
                autoFocus
                placeholder="filename.jsx"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyDown(e, handleCreateFile, () => {
                    setIsCreating(false);
                    setNewFileName("");
                  })
                }
                className="h-7 text-xs"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCreateFile}
                className="h-7 w-7 shrink-0 p-0"
              >
                <CheckIcon size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsCreating(false);
                  setNewFileName("");
                }}
                className="h-7 w-7 shrink-0 p-0"
              >
                <XIcon size={14} />
              </Button>
            </div>
          )}

          {files.map((file) => (
            <div key={file} className="group relative">
              {editingFile === file ? (
                <div className="flex items-center gap-1">
                  <Input
                    autoFocus
                    value={editFileName}
                    onChange={(e) => setEditFileName(e.target.value)}
                    onKeyDown={(e) =>
                      handleKeyDown(
                        e,
                        () => handleRenameFile(file),
                        () => {
                          setEditingFile(null);
                          setEditFileName("");
                        }
                      )
                    }
                    className="h-7 text-xs"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRenameFile(file)}
                    className="h-7 w-7 shrink-0 p-0"
                  >
                    <CheckIcon size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingFile(null);
                      setEditFileName("");
                    }}
                    className="h-7 w-7 shrink-0 p-0"
                  >
                    <XIcon size={14} />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveFile(file)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm transition-colors hover:bg-accent",
                    activeFile === file &&
                      "bg-accent font-medium text-accent-foreground"
                  )}
                >
                  <FileIcon size={14} className="shrink-0" />
                  <span className="truncate flex-1">
                    {file.replace("/", "")}
                  </span>
                  <div className="hidden shrink-0 gap-0.5 group-hover:flex">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFile(file);
                        setEditFileName(file.replace("/", ""));
                      }}
                      className="h-6 w-6 p-0"
                      title="Rename"
                    >
                      <EditIcon size={12} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(`Are you sure you want to delete ${file}?`)
                        ) {
                          deleteFile(file);
                        }
                      }}
                      className="h-6 w-6 p-0 hover:text-destructive"
                      title="Delete"
                    >
                      <TrashIcon size={12} />
                    </Button>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
