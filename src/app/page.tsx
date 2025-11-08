"use client";

import { Editor } from "@/components/editor";
import { SandboxProvider } from "@/components/ui/shadcn-io/sandbox";
import { EditorProvider } from "@/contexts/editor-context";
import { useTheme } from "next-themes";
import { DEFAULT_WELCOME_EMAIL } from "@/lib/default-email";
import { useEffect, useState, useMemo } from "react";

export default function Home() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const sandpackTheme =
    theme === "dark" || resolvedTheme === "dark" ? "dark" : "light";

  const initialFiles = useMemo(
    () => ({
      "/welcome.tsx": DEFAULT_WELCOME_EMAIL,
    }),
    []
  );

  if (!mounted) return null;

  return (
    <SandboxProvider
      key="sandpack-instance"
      theme={sandpackTheme}
      files={initialFiles}
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
