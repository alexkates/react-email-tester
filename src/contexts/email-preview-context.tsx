"use client";

import "web-streams-polyfill/polyfill";
import { useSandpack } from "@codesandbox/sandpack-react";
import { createContext, useContext, useState, useCallback } from "react";
import { render } from "@react-email/render";
import * as ReactEmailComponents from "@react-email/components";
import * as React from "react";

async function compileEmail(code: string): Promise<string> {
  try {
    // Remove import and export statements since we're providing the modules directly
    const codeWithoutImportsExports = code
      .split("\n")
      .filter((line) => {
        const trimmed = line.trim();
        return !trimmed.startsWith("import ") && !trimmed.startsWith("export ");
      })
      .join("\n");

    // Create a function from the code string that returns the email component
    // We need to make React and react-email components available in the scope
    const createComponent = new Function(
      "React",
      ...Object.keys(ReactEmailComponents),
      `
      ${codeWithoutImportsExports}
      return MyTemplate;
      `
    );

    // Execute the function to get the component
    const EmailComponent = createComponent(
      React,
      ...Object.values(ReactEmailComponents)
    );

    // Render the React component to HTML using react-email
    const html = await render(<EmailComponent />);
    return html;
  } catch (error) {
    console.error("Error compiling email:", error);
    return `<div style="color: red; padding: 20px;">
      <h3>Error compiling email template:</h3>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
    </div>`;
  }
}

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
