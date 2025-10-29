"use client";

import "web-streams-polyfill/polyfill";
import { useSandpack } from "@codesandbox/sandpack-react";
import { createContext, useContext, useState, useCallback } from "react";
import { compileEmail } from "@/app/actions/compile-email";
import * as React from "react";

type EmailPreviewContextValue = {
  isCompiling: boolean;
  compiledHtml: string;
  compile: () => Promise<void>;
};

const EmailPreviewContext = createContext<EmailPreviewContextValue | undefined>(
  undefined
);

export const useEmailPreview = () => {
  const context = useContext(EmailPreviewContext);
  if (!context) {
    throw new Error(
      "useEmailPreview must be used within an EmailPreviewProvider"
    );
  }
  return context;
};

export function EmailPreviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sandpack } = useSandpack();
  const [compiledHtml, setCompiledHtml] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);

  const compile = useCallback(async () => {
    const emailContent = sandpack.files["/index.jsx"]?.code || "";
    setIsCompiling(true);
    const html = await compileEmail(emailContent);
    setCompiledHtml(html);
    setIsCompiling(false);
  }, [sandpack.files]);

  return (
    <EmailPreviewContext.Provider
      value={{ isCompiling, compiledHtml, compile }}
    >
      {children}
    </EmailPreviewContext.Provider>
  );
}
