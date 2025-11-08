"use server";

import { build, type BuildResult } from "esbuild";
import { render } from "@react-email/render";
import * as React from "react";
import * as ReactEmailComponents from "@react-email/components";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";

/**
 * Module cache for the custom require implementation.
 * Maps module names to their resolved exports.
 */
const MODULE_REGISTRY = {
  react: React,
  "react/jsx-runtime": { jsx, jsxs, Fragment },
  "@react-email/components": ReactEmailComponents,
} as const;

type ModuleName = keyof typeof MODULE_REGISTRY;

/**
 * Custom require function for the sandboxed execution environment.
 * Only allows importing pre-approved modules to prevent arbitrary code execution.
 */
function createSafeRequire(moduleName: string): unknown {
  if (moduleName in MODULE_REGISTRY) {
    return MODULE_REGISTRY[moduleName as ModuleName];
  }

  throw new Error(
    `Module "${moduleName}" is not available. Only React and @react-email/components are supported.`
  );
}

/**
 * Extracts the default export or the first valid React component from module exports.
 * Handles both ESM (with __esModule) and CJS module formats.
 */
function extractComponent(
  moduleExports: Record<string, unknown>
): React.ComponentType {
  if (typeof moduleExports.default === "function") {
    return moduleExports.default as React.ComponentType;
  }

  if (moduleExports.__esModule && typeof moduleExports.default === "function") {
    return moduleExports.default as React.ComponentType;
  }

  const componentCandidate = Object.values(moduleExports).find(
    (exp) => typeof exp === "function"
  );

  if (typeof componentCandidate === "function") {
    return componentCandidate as React.ComponentType;
  }

  throw new Error(
    "No valid React component found. Ensure your code exports a default function component."
  );
}

/**
 * Formats build errors from esbuild into user-friendly messages.
 */
function formatBuildErrors(result: BuildResult): string {
  if (!result.errors || result.errors.length === 0) {
    return "Unknown build error occurred";
  }

  return result.errors
    .map((error) => {
      const location = error.location
        ? `Line ${error.location.line}, Column ${error.location.column}: `
        : "";
      return `${location}${error.text}`;
    })
    .join("\n");
}

/**
 * Compiles and renders a React Email template from TypeScript/JavaScript source code.
 *
 * This function performs the following steps:
 * 1. Bundles the source code using esbuild with TypeScript/JSX support
 * 2. Executes the bundled code in a sandboxed environment with restricted module access
 * 3. Extracts the React component from the module exports
 * 4. Renders the component to static HTML using @react-email/render
 *
 * @param code - The source code of the email template (TypeScript/JSX)
 * @returns A promise that resolves to the rendered HTML string, or an error HTML if compilation fails
 *
 * @example
 * ```ts
 * const html = await compileEmail(`
 *   import { Html, Button } from '@react-email/components';
 *   export default function Email() {
 *     return <Html><Button href="https://example.com">Click me</Button></Html>;
 *   }
 * `);
 * ```
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
      target: "es2020",
      minify: false,
      external: [
        "react",
        "react/jsx-runtime",
        "@react-email/components",
        "@react-email/*",
      ],
    });

    if (buildResult.errors.length > 0) {
      throw new Error(`Build failed:\n${formatBuildErrors(buildResult)}`);
    }

    const compiledCode = buildResult.outputFiles[0]?.text;
    if (!compiledCode) {
      throw new Error(
        "esbuild produced no output. Check your source code for syntax errors."
      );
    }

    const module = { exports: {} as Record<string, unknown> };
    const moduleExports = module.exports;

    const executionFunction = new Function(
      "require",
      "module",
      "exports",
      compiledCode
    );

    executionFunction(createSafeRequire, module, moduleExports);

    const EmailComponent = extractComponent(module.exports);

    const html = await render(React.createElement(EmailComponent));

    return html;
  } catch (error) {
    console.error("Email compilation error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    return `<div style="background-color: #fee; border-left: 4px solid #c33; color: #333; padding: 24px; font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace; line-height: 1.6; max-width: 800px; margin: 20px auto; border-radius: 4px;">
      <div style="display: flex; align-items: center; margin-bottom: 16px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c33" stroke-width="2" style="margin-right: 12px;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #c33;">Compilation Error</h3>
      </div>
      <pre style="white-space: pre-wrap; word-wrap: break-word; background-color: #fafafa; padding: 16px; border-radius: 4px; overflow-x: auto; font-size: 14px; margin: 0;">${errorMessage}</pre>
      ${
        errorStack
          ? `<details style="margin-top: 16px; cursor: pointer;">
        <summary style="font-weight: 600; color: #666; user-select: none;">Stack Trace</summary>
        <pre style="white-space: pre-wrap; word-wrap: break-word; background-color: #fafafa; padding: 16px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin-top: 8px; color: #666;">${errorStack}</pre>
      </details>`
          : ""
      }
    </div>`;
  }
}
