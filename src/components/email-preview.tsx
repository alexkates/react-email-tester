"use client";

import { useEmailPreview } from "@/contexts/email-preview-context";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmailPreview() {
  const { compiledEmails, activePreview, setActivePreview } = useEmailPreview();

  const currentEmail = compiledEmails.find(
    (email) => email.fileName === activePreview
  );

  return (
    <div className="flex h-full flex-col">
      {/* Preview file tabs */}
      {compiledEmails.length > 0 && (
        <div className="flex gap-1 border-b bg-secondary/30 p-2">
          {compiledEmails.map((email) => (
            <Button
              key={email.fileName}
              variant="ghost"
              size="sm"
              onClick={() => setActivePreview(email.fileName)}
              className={cn(
                "gap-1.5 text-xs",
                activePreview === email.fileName &&
                  "bg-accent font-medium text-accent-foreground"
              )}
            >
              <FileIcon size={12} />
              {email.fileName}
            </Button>
          ))}
        </div>
      )}

      {/* Preview content */}
      <div className="flex-1 overflow-auto bg-muted/30 p-4">
        {currentEmail ? (
          <div
            className="wrap-break-word"
            dangerouslySetInnerHTML={{ __html: currentEmail.html }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="mb-2 text-sm">No preview available</p>
              <p className="text-xs">
                Click "Compile" to generate email preview
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
