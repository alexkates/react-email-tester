"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { TabsContent } from "@/components/ui/tabs";
import { SandboxProvider } from "@/components/ui/shadcn-io/sandbox";
import { CodeEditor } from "@/components/code-editor";
import { useEmail } from "@/components/email-context";

export function CodeTab() {
  const { emailContent } = useEmail();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <TabsContent value="code" className="mt-4 flex-1 overflow-hidden">
      {mounted && (
        <SandboxProvider
          template="static"
          theme={theme === "dark" ? "dark" : "light"}
          files={{
            "/code.jsx":
              emailContent || "<!-- Paste your email HTML here... -->",
          }}
          options={{
            activeFile: "/code.jsx",
          }}
        >
          <CodeEditor />
        </SandboxProvider>
      )}
    </TabsContent>
  );
}
