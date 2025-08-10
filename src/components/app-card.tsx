"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Trash, ExternalLink, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteApp } from "@/actions/delete-app";
import { toast } from "sonner";

type AppCardProps = {
  id: string;
  name: string;
  createdAt: Date;
  onDelete?: () => void;
};

export function AppCard({ id, name, createdAt, onDelete }: AppCardProps) {
  const router = useRouter();

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/app/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    await deleteApp(id);
    toast.success("App deleted successfully");
    if (onDelete) {
      onDelete();
    }

    console.log(`Delete app: ${id}`);
  };

  return (
    <Card className="bg-card border border-border p-6 sm:p-8 rounded-2xl h-48 sm:h-56 relative w-full transition-all duration-200 hover:border-accent/20 hover:bg-accent/2 group shadow-lg hover:shadow-xl">
      <Link href={`/app/${id}`} className="cursor-pointer block h-full">
        <CardHeader className="p-0 h-full flex flex-col justify-between text-center">
          <CardTitle className="text-base sm:text-lg text-foreground group-hover:text-foreground transition-colors leading-tight break-words overflow-hidden">
            {name}
          </CardTitle>
          <CardDescription className="text-sm text-foreground-tertiary">
            Created {createdAt.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
      </Link>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-xl bg-card border border-border hover:bg-accent/5 focus:outline-none transition-all duration-200 shadow-md">
              <MoreVertical className="h-4 w-4 text-foreground-secondary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border border-border rounded-xl shadow-xl">
            <DropdownMenuItem onClick={handleOpen} className="text-foreground-secondary hover:text-foreground hover:bg-accent/5">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
