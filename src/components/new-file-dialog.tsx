"use client";

import { useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { FilePlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFileManager } from "@/contexts/file-manager-context";

const DEFAULT_TEMPLATE = `export default function EmailTemplate() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>New Email Template</h1>
      <p>Start editing to create your email!</p>
    </div>
  );
}
`;

export function NewFileDialog() {
  const { sandpack } = useSandpack();
  const { addFile } = useFileManager();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    // Validate filename
    if (!fileName.trim()) {
      setError("Filename is required");
      return;
    }

    // Ensure .tsx extension
    let finalFileName = fileName.trim();
    if (!finalFileName.endsWith(".tsx")) {
      finalFileName += ".tsx";
    }

    // Add leading slash for Sandpack
    const filePath = `/${finalFileName}`;

    // Check if file already exists
    if (sandpack.files[filePath]) {
      setError("File already exists");
      return;
    }

    // Update the file using the same method as initial templates
    sandpack.updateFile(filePath, DEFAULT_TEMPLATE);

    // Add to files and visible files list
    addFile(filePath, DEFAULT_TEMPLATE);

    // Set the newly created file as active
    setTimeout(() => {
      sandpack.setActiveFile(filePath);
    }, 50);

    // Reset and close
    setFileName("");
    setError("");
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setFileName("");
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FilePlusIcon size={14} />
          New File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Email Template</DialogTitle>
          <DialogDescription>
            Create a new TSX file for your email template. The .tsx extension
            will be added automatically if not provided.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              placeholder="my-template.tsx"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create File</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
