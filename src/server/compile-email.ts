"use server";

import { build } from "esbuild";
import { render } from "@react-email/render";
import * as React from "react";

/**
 * Compiles user's email template code into HTML using esbuild and React Email.
 * Simple approach: let esbuild bundle everything, then execute and render.
 */
export async function compileEmail(code: string): Promise<string> {
  try {
    // Build with esbuild - bundles all imports and transforms JSX
    const buildResult = await build({
      stdin: {
        contents: code,
        sourcefile: "email-template.tsx",
        loader: "tsx",
        resolveDir: process.cwd(),
      },
      bundle: true,
      write: false,
      platform: "node",
      format: "cjs",
      jsx: "automatic",
      logLevel: "silent",
      // Let esbuild bundle everything - no externals needed
    });

    const compiledCode = buildResult.outputFiles[0]?.text;
    if (!compiledCode) {
      throw new Error("esbuild produced no output");
    }

    // Execute the compiled code to get the component
    const module = { exports: {} as any };
    const fn = new Function("module", "exports", compiledCode);
    fn(module, module.exports);

    // Extract the component (try default export first, then any function)
    const EmailComponent =
      module.exports.default ||
      Object.values(module.exports).find((exp) => typeof exp === "function");

    if (!EmailComponent || typeof EmailComponent !== "function") {
      throw new Error(
        "No valid React component found. Ensure your code exports a component."
      );
    }

    // Render to HTML
    const html = await render(
      React.createElement(EmailComponent as React.ComponentType)
    );
    return html;
  } catch (error) {
    console.error("Error compiling email:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return `<div style="color: red; padding: 20px; font-family: monospace;">
      <h3 style="margin-top: 0;">Compilation Error</h3>
      <pre style="white-space: pre-wrap; word-wrap: break-word;">${errorMessage}</pre>
    </div>`;
  }
}
