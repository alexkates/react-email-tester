"use client";

import { Editor } from "@/components/editor";
import { SandboxProvider } from "@/components/ui/shadcn-io/sandbox";
import { EditorProvider, useEditor } from "@/contexts/editor-context";
import { useTheme } from "next-themes";

function HomeContent() {
  const { theme, resolvedTheme } = useTheme();
  const { files, mounted, activeFile } = useEditor();

  if (!mounted) return null;

  const sandpackTheme =
    theme === "dark" || resolvedTheme === "dark" ? "dark" : "light";

  return (
    <SandboxProvider
      theme={sandpackTheme}
      files={Object.keys(files).length > 0 ? files : { "placeholder.tsx": "" }}
      options={{
        activeFile: activeFile || "placeholder.tsx",
        visibleFiles: Object.keys(files),
      }}
    >
      <Editor />
    </SandboxProvider>
  );
}

export default function Home() {
  return (
    <EditorProvider>
      <HomeContent />
    </EditorProvider>
  );
}
