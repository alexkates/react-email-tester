"use client";

import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useEmailPreview } from "@/contexts/email-preview-context";
import { cn } from "@/lib/utils";

export function ViewportToggle() {
  const { viewportMode, setViewportMode } = useEmailPreview();

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setViewportMode("desktop")}
        className={cn(
          viewportMode === "desktop" && "bg-accent text-accent-foreground"
        )}
      >
        <Monitor size={16} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setViewportMode("mobile")}
        className={cn(
          viewportMode === "mobile" && "bg-accent text-accent-foreground"
        )}
      >
        <Smartphone size={16} />
      </Button>
    </ButtonGroup>
  );
}
