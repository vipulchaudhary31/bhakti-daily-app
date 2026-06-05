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
      offset={{ top: "calc(env(safe-area-inset-top) + 12px)" }}
      mobileOffset={{ top: "calc(env(safe-area-inset-top) + 12px)" }}
      icons={{
        success: (
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle weight="fill" className="size-4" />
          </span>
        ),
        error: (
          <span className="flex size-7 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <XCircle weight="fill" className="size-4" />
          </span>
        ),
        warning: (
          <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <WarningCircle weight="fill" className="size-4" />
          </span>
        ),
        info: (
          <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Info weight="fill" className="size-4" />
          </span>
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border-transparent",
          title: "text-sm font-medium leading-5 tracking-tight",
          description: "text-sm text-muted-foreground",
          content: "flex min-w-0 flex-1 flex-col gap-0.5",
          icon: "!mt-0 !mr-2 !ml-0 !h-7 !w-7 flex shrink-0 items-center justify-center",
        },
      }}
      className={cn("toaster group", className)}
      {...props}
    />
  );
};

export { Toaster };
