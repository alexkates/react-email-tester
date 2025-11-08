"use client";

import { SendIcon } from "lucide-react";
import { useEditor } from "@/contexts/editor-context";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useSandpack } from "@codesandbox/sandpack-react";

export function CompileButton({
  onCompileComplete,
}: {
  onCompileComplete?: () => void;
}) {
  const { isCompiling, compile } = useEditor();
  const { sandpack } = useSandpack();

  const handleCompile = async () => {
    await compile(sandpack.files);
    onCompileComplete?.();
  };

  return (
    <button
      onClick={handleCompile}
      disabled={isCompiling}
      className={cn(
        "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      )}
    >
      {isCompiling ? <Spinner className="size-4" /> : <SendIcon size={14} />}
    </button>
  );
}
