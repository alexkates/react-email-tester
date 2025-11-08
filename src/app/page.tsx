"use client";

import { Editor } from "@/components/editor";
import { SandboxProvider } from "@/components/ui/shadcn-io/sandbox";
import { EditorProvider, useEditor } from "@/contexts/editor-context";
import { useTheme } from "next-themes";

function HomeContent() {
  const { theme, resolvedTheme } = useTheme();
  const { files, mounted } = useEditor();

  if (!mounted) return null;

  const hasFiles = Object.keys(files).length > 0;
  const sandpackTheme =
    theme === "dark" || resolvedTheme === "dark" ? "dark" : "light";

  if (!hasFiles) {
    return <Editor />;
  }

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

export default function Home() {
  return (
    <EditorProvider>
      <HomeContent />
    </EditorProvider>
  );
}
