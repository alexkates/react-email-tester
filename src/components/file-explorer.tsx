"use client";

import { useSandpack } from "@codesandbox/sandpack-react";
import { FileIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmailPreview } from "@/contexts/email-preview-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function FileExplorer() {
  const { sandpack } = useSandpack();
  const { deleteFile } = useEmailPreview();
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const visibleFiles = Object.keys(sandpack.files).filter(
    (filePath) =>
      (filePath.endsWith(".jsx") || filePath.endsWith(".tsx")) &&
      !filePath.includes("node_modules")
  );

  const handleDeleteClick = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFileToDelete(filePath);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      deleteFile(fileToDelete);
      sandpack.deleteFile(fileToDelete);
      setFileToDelete(null);
    }
  };

  const cancelDelete = () => {
    setFileToDelete(null);
  };

  const getFileName = (filePath: string) => {
    return filePath.replace("/", "");
  };

  return (
    <>
      <div className="bg-background flex h-full flex-col border-r">
        <div className="text-muted-foreground border-b p-2 text-xs font-semibold">
          FILES
        </div>
        <div className="flex-1 overflow-auto">
          {visibleFiles.map((filePath) => {
            const isActive = sandpack.activeFile === filePath;
            const isLastFile = visibleFiles.length === 1;
            return (
              <div
                key={filePath}
                className={cn(
                  "group/item hover:bg-accent flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-sm transition-colors",
                  isActive && "bg-accent text-accent-foreground font-medium"
                )}
                onClick={() => sandpack.openFile(filePath)}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <FileIcon size={14} className="shrink-0" />
                  <span className="truncate">{getFileName(filePath)}</span>
                </div>
                {!isLastFile && (
                  <button
                    onClick={(e) => handleDeleteClick(filePath, e)}
                    className={cn(
                      "shrink-0 rounded p-1 opacity-0 transition-all group-hover/item:opacity-100",
                      "hover:bg-destructive/10 hover:text-destructive",
                      "focus:ring-ring focus:opacity-100 focus:ring-2 focus:outline-none"
                    )}
                    aria-label={`Delete ${getFileName(filePath)}`}
                  >
                    <Trash2Icon size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AlertDialog open={fileToDelete !== null} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {fileToDelete && getFileName(fileToDelete)}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
