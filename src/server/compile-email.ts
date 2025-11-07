"use server";

import { build } from "esbuild";
import { render } from "@react-email/render";
import * as React from "react";
import * as ReactEmailComponents from "@react-email/components";

/**
 * Compiles user's email template code into HTML using esbuild and React Email.
 * Simple approach: let esbuild bundle everything, then execute and render.
 */
export async function compileEmail(code: string): Promise<string> {
  try {
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
      external: [
        "react",
        "react/jsx-runtime",
        "@react-email/components",
        "@react-email/*",
      ],
    });

    const compiledCode = buildResult.outputFiles[0]?.text;
    if (!compiledCode) {
      throw new Error("esbuild produced no output");
    }

    const customRequire = (moduleName: string) => {
      if (moduleName === "react" || moduleName === "react/jsx-runtime") {
        return React;
      }
      if (moduleName === "@react-email/components") {
        return ReactEmailComponents;
      }
      throw new Error(`Module not available: ${moduleName}`);
    };

    const module = { exports: {} as any };
    const fn = new Function(
      "module",
      "exports",
      "require",
      "React",
      compiledCode
    );
    fn(module, module.exports, customRequire, React);

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
