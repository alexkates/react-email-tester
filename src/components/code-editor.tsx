"use client";

import { useEffect } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import {
  SandboxLayout,
  SandboxCodeEditor,
} from "@/components/ui/shadcn-io/sandbox";
import { useEmail } from "@/components/email-context";

export function CodeEditor() {
  const { setEmailContent } = useEmail();
  const { sandpack } = useSandpack();

  useEffect(() => {
    const code = sandpack.files["/code.jsx"]?.code;
    if (code !== undefined) {
      setEmailContent(code);
    }
  }, [sandpack.files["/code.jsx"]?.code, setEmailContent]);

  return (
    <SandboxLayout>
      <SandboxCodeEditor
        showTabs={false}
        showLineNumbers
        readOnly={false}
        style={{ height: "100%" }}
      />
    </SandboxLayout>
  );
}
