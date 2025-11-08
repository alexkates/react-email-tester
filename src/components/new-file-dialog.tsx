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
import { useEditor } from "@/contexts/editor-context";

export function NewFileDialog({
  variant = "icon",
}: {
  variant?: "icon" | "button";
}) {
  const { sandpack } = useSandpack();
  const { addFile } = useEditor();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!fileName.trim()) {
      setError("Filename is required");
      return;
    }

    let finalFileName = fileName.trim();
    if (!finalFileName.endsWith(".tsx")) {
      finalFileName += ".tsx";
    }

    const filePath = `/${finalFileName}`;

    if (sandpack.files[filePath]) {
      setError("File already exists");
      return;
    }

    addFile(filePath, blankTemplate);
    sandpack.addFile(filePath, blankTemplate);

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
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <FilePlusIcon size={14} />
          </Button>
        ) : (
          <Button>
            <FilePlusIcon size={16} />
            Create New Template
          </Button>
        )}
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

const blankTemplate = `import * as React from 'react';
import {
  Html,
  Head,
  Body,
} from '@react-email/components';

export default function Email() {
  return (
    <Html>
      <Head />
      <Body>
        
      </Body>
    </Html>
  );
}
`;
