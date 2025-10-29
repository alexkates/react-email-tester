"use client";

import { SendIcon } from "lucide-react";
import { useEmailPreview } from "@/contexts/email-preview-context";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function CompileButton() {
  const { isCompiling, compile } = useEmailPreview();

  return (
    <Button size="sm" onClick={compile} disabled={isCompiling}>
      {isCompiling ? <Spinner className="size-4" /> : <SendIcon size={14} />}
    </Button>
  );
}
