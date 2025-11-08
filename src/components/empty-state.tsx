"use client";

import { FilePlusIcon } from "lucide-react";
import { NewFileDialog } from "@/components/new-file-dialog";

export function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center max-w-md space-y-4">
        <div className="flex justify-center mb-4">
          <div className="bg-muted rounded-full p-6">
            <FilePlusIcon size={48} className="text-muted-foreground" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold">No email templates yet</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Get started by creating your first email template. Click the button below to create a new file.
        </p>
        <div className="pt-4">
          <NewFileDialog variant="button" />
        </div>
      </div>
    </div>
  );
}
