"use client";

import { Editor } from "@/components/editor";
import { SandboxProvider } from "@/components/ui/shadcn-io/sandbox";
import { EditorProvider } from "@/contexts/editor-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme } = useTheme();
  const [files] = useLocalStorage<Record<string, string>>(
    "react-email-preview-files",
    {}
  );

  return (
    <SandboxProvider
      theme={theme === "dark" ? "dark" : "light"}
      files={files}
      options={{
        activeFile: Object.keys(files)[0] || "",
        visibleFiles: Object.keys(files),
      }}
    >
      <EditorProvider>
        <Editor />
      </EditorProvider>
    </SandboxProvider>
  );
}
