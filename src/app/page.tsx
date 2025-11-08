"use client";

import { Editor } from "@/components/editor";
import { SandboxProvider } from "@/components/ui/shadcn-io/sandbox";
import { EditorProvider, useEditor } from "@/contexts/editor-context";
import { useTheme } from "next-themes";

export default function Home() {
  return (
    <EditorProvider>
      <HomeContent />
    </EditorProvider>
  );
}

function HomeContent() {
  const { theme, resolvedTheme } = useTheme();
  const { files, mounted } = useEditor();

  if (!mounted) return null;

  const sandpackTheme =
    theme === "dark" || resolvedTheme === "dark" ? "dark" : "light";

  return (
    <SandboxProvider
      theme={sandpackTheme}
      files={files}
      options={{
        activeFile: Object.keys(files)[0],
        visibleFiles: Object.keys(files),
      }}
    >
      <Editor />
    </SandboxProvider>
  );
}
