"use client";

import {
  CheckCircle,
  Info,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import { Toaster as SonnerToaster } from "sonner";
import type { ToasterProps } from "sonner";
import { cn } from "@/app/components/ui/utils";

const Toaster = ({ theme, className, ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      theme={theme ?? "light"}
      richColors={false}
      visibleToasts={1}
      offset={{ bottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
      mobileOffset={{ bottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
      icons={{
        success: <CheckCircle weight="fill" className="size-4" />,
        error: <XCircle weight="fill" className="size-4" />,
        warning: <WarningCircle weight="fill" className="size-4" />,
        info: <Info weight="fill" className="size-4" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm",
          title: "text-sm font-medium",
          description: "text-sm text-muted-foreground",
          content: "gap-0.5",
          icon: "text-muted-foreground",
          success:
            "border-border/80 bg-card text-card-foreground",
          error:
            "border-border/80 bg-card text-card-foreground",
          warning:
            "border-border/80 bg-card text-card-foreground",
          info:
            "border-border/80 bg-card text-card-foreground",
        },
      }}
      className={cn("toaster group", className)}
      {...props}
    />
  );
};

export { Toaster };
