"use client";

import { Editor } from "@/components/editor";
import { SandboxProvider } from "@/components/ui/shadcn-io/sandbox";
import { EditorProvider, useEditor } from "@/contexts/editor-context";
import { useTheme } from "next-themes";

function HomeContent() {
  const { theme } = useTheme();
  const { files } = useEditor();

  return (
    <SandboxProvider
      theme={theme === "dark" ? "dark" : "light"}
      files={files}
      options={{
        activeFile: Object.keys(files)[0] || "",
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
