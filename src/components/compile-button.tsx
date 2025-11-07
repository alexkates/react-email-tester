"use client";

import { SendIcon } from "lucide-react";
import { useEditor } from "@/contexts/editor-context";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function CompileButton() {
  const { isCompiling, compile } = useEditor();

  return (
    <button
      onClick={compile}
      disabled={isCompiling}
      className={cn(
        "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      )}
    >
      {isCompiling ? <Spinner className="size-4" /> : <SendIcon size={14} />}
    </button>
  );
}
