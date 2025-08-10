"use client";

import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ExampleButtonProps {
  text: string;
  promptText: string;
  onClick: (text: string) => void;
  className?: string;
}

export function ExampleButton({
  text,
  promptText,
  onClick,
  className,
}: ExampleButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "text-foreground-secondary border-border bg-transparent hover:text-foreground hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 rounded-xl text-sm px-4 py-2",
        className
      )}
      onClick={() => onClick(promptText)}
      type="button"
    >
      {text}
    </Button>
  );
}
