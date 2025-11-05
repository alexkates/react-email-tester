"use client";

import { useEmailPreview } from "@/contexts/email-preview-context";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function EmailPreview() {
  const { compiledEmails, activePreview, setActivePreview } = useEmailPreview();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentEmail = compiledEmails.find(
    (email) => email.fileName === activePreview
  );

  useEffect(() => {
    if (iframeRef.current && currentEmail) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (doc) {
        // Create a complete isolated HTML document
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                /* Reset all inherited styles */
                * {
                  all: revert;
                }
                html, body {
                  margin: 0;
                  padding: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                  background: white;
                  color: black;
                }
              </style>
            </head>
            <body>
              ${currentEmail.html}
            </body>
          </html>
        `;

        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
  }, [currentEmail]);

  return (
    <div className="flex h-full flex-col">
      {/* Preview file tabs */}
      {compiledEmails.length > 0 && (
        <div className="bg-secondary/30 flex gap-1 border-b p-2">
          {compiledEmails.map((email) => (
            <Button
              key={email.fileName}
              variant="ghost"
              size="sm"
              onClick={() => setActivePreview(email.fileName)}
              className={cn(
                "gap-1.5 text-xs",
                activePreview === email.fileName &&
                  "bg-accent text-accent-foreground font-medium"
              )}
            >
              <FileIcon size={12} />
              {email.fileName}
            </Button>
          ))}
        </div>
      )}

      {/* Preview content */}
      <div className="bg-muted/30 flex-1 overflow-auto p-4">
        {currentEmail ? (
          <iframe
            ref={iframeRef}
            title="Email Preview"
            className="h-full w-full border-0 bg-white"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
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
