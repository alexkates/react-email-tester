"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { EmailInputPanel } from "@/components/email-input-panel";
import { EmailPreviewPanel } from "@/components/email-preview-panel";
import { EmailProvider } from "@/components/email-context";

export default function Home() {
  return (
    <EmailProvider>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 rounded-lg border"
      >
        <ResizablePanel defaultSize={50} minSize={30}>
          <EmailInputPanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <EmailPreviewPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </EmailProvider>
  );
}
