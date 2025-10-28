"use client";

import { useSandpack } from "@codesandbox/sandpack-react";

function compileEmail(code: string): string {
  // TODO: Add custom compilation logic here
  return code;
}

export function EmailPreview() {
  const { sandpack } = useSandpack();
  const emailContent = sandpack.files["/index.jsx"]?.code || "";
  const compiledHtml = compileEmail(emailContent);

  return (
    <div className="h-full overflow-auto bg-muted/30 p-4">
      <div
        className="wrap-break-word"
        dangerouslySetInnerHTML={{ __html: compiledHtml }}
      />
    </div>
  );
}
