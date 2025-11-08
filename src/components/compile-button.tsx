"use client";

import { SendIcon } from "lucide-react";
import { useEditor } from "@/contexts/editor-context";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
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
    <Button
      variant="outline"
      size="sm"
      onClick={handleCompile}
      disabled={isCompiling}
    >
      {isCompiling ? (
        <>
          <Spinner className="size-4" />
          Compiling
        </>
      ) : (
        <>
          <SendIcon size={14} />
          Compile
        </>
      )}
    </Button>
  );
}
