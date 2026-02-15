import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card(props: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "border border-border bg-accent p-4 text-foreground",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export function CardHeader(props: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("mb-2 flex items-center justify-between", props.className)}>
      {props.children}
    </div>
  );
}

export function CardTitle(props: { className?: string; children: ReactNode }) {
  return (
    <h3 className={cn("text-sm font-semibold", props.className)}>
      {props.children}
    </h3>
  );
}

export function CardContent(props: { className?: string; children: ReactNode }) {
  return <div className={cn("text-xs", props.className)}>{props.children}</div>;
}
