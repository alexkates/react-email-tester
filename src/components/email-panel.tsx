"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  SandboxProvider,
  SandboxLayout,
  SandboxCodeEditor,
  SandboxTabs,
  SandboxTabsList,
  SandboxTabsTrigger,
  SandboxTabsContent,
} from "@/components/ui/shadcn-io/sandbox";
import { CodeIcon, AppWindowIcon } from "lucide-react";
import { EmailPreview } from "@/components/email-preview";
import { EmailPreviewProvider } from "@/contexts/email-preview-context";
import { CompileButton } from "@/components/compile-button";
import { ModeToggle } from "@/components/mode-toggle";
import { defaultEmailContent } from "@/lib/default-email";

export function EmailPanel() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("code");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <SandboxProvider
      theme={theme === "dark" ? "dark" : "light"}
      files={{
        "/index.jsx": defaultEmailContent,
      }}
      options={{
        activeFile: "/index.jsx",
      }}
    >
      <EmailPreviewProvider onCompileComplete={() => setActiveTab("preview")}>
        <SandboxLayout>
          <SandboxTabs value={activeTab} onValueChange={setActiveTab}>
            <SandboxTabsList>
              <SandboxTabsTrigger value="code">
                <CodeIcon size={14} />
                Code
              </SandboxTabsTrigger>
              <SandboxTabsTrigger value="preview">
                <AppWindowIcon size={14} />
                Preview
              </SandboxTabsTrigger>
              <div className="ml-auto flex gap-2">
                <CompileButton />
                <ModeToggle />
              </div>
            </SandboxTabsList>
            <SandboxTabsContent className="overflow-hidden" value="code">
              <SandboxCodeEditor showLineNumbers style={{ height: "100%" }} />
            </SandboxTabsContent>
            <SandboxTabsContent className="overflow-hidden" value="preview">
              <EmailPreview />
            </SandboxTabsContent>
          </SandboxTabs>
        </SandboxLayout>
      </EmailPreviewProvider>
    </SandboxProvider>
  );
}
