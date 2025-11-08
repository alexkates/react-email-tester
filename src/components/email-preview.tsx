"use client";

import { useEditor } from "@/contexts/editor-context";
import { Button } from "@/components/ui/button";
import { CompileButton } from "@/components/compile-button";
import { FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function EmailPreview() {
  const { compiledEmails, activePreview, setActivePreview, viewportMode } =
    useEditor();
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
                  color: black;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                body > * {
                  max-width: 100%;
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
      <div className="bg-muted/30 flex flex-1 items-center justify-center overflow-auto p-4">
        {currentEmail ? (
          <div
            className={cn(
              "h-full bg-white transition-all",
              viewportMode === "mobile" ? "w-[375px] shadow-xl" : "w-full"
            )}
          >
            <iframe
              ref={iframeRef}
              title="Email Preview"
              className="h-full w-full border-0 bg-white"
              sandbox="allow-same-origin"
            />
          </div>
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-sm">Compile your template to preview it</p>
              <CompileButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
