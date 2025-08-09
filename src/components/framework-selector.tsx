"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { templates } from "@/lib/templates";

type FrameworkSelectorProps = {
  value?: keyof typeof templates;
  onChange: (value: keyof typeof templates) => void;
  className?: string;
};

export function FrameworkSelector({
  value = "nextjs",
  onChange,
  className,
}: FrameworkSelectorProps) {
  return (
    <div className={cn("relative", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 px-2 text-sm bg-transparent hover:bg-transparent text-foreground-secondary hover:text-foreground transition-colors border-none shadow-none"
          >
            <Image
              src={templates[value].logo}
              alt={templates[value].name}
              width={16}
              height={16}
              className="opacity-90"
            />
            {templates[value].name}
            <ChevronDownIcon className="h-3 w-3 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-[8rem] bg-background border border-border shadow-lg rounded-lg"
        >
          {Object.entries(templates).map(([key, template]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onChange(key)}
              className="gap-2 text-sm text-foreground-secondary hover:text-foreground hover:bg-accent/3 transition-colors"
            >
              <Image
                src={template.logo}
                alt={template.name}
                width={16}
                height={16}
                className="opacity-90"
              />
              {templates[key].name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
