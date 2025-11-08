"use client";

import { Editor } from "@/components/editor";
import { SandboxProvider } from "@/components/ui/shadcn-io/sandbox";
import { EditorProvider } from "@/contexts/editor-context";
import { useTheme } from "next-themes";
import { DEFAULT_WELCOME_EMAIL } from "@/lib/default-email";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const sandpackTheme =
    theme === "dark" || resolvedTheme === "dark" ? "dark" : "light";

  return (
    <SandboxProvider
      theme={sandpackTheme}
      files={{
        "/welcome.tsx": DEFAULT_WELCOME_EMAIL,
      }}
      options={{
        activeFile: "/welcome.tsx",
        autorun: false,
        autoReload: false,
      }}
    >
      <EditorProvider>
        <Editor />
      </EditorProvider>
    </SandboxProvider>
  );
}
