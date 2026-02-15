import * as SelectPrimitive from "@radix-ui/react-select";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SelectTrigger(props: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-9 w-full items-center justify-between border border-border bg-background px-3 text-xs text-foreground",
        props.className
      )}
    >
      {props.children}
    </SelectPrimitive.Trigger>
  );
}

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectContent(props: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "z-50 border border-border bg-background text-xs text-foreground",
          props.className
        )}
      >
        <SelectPrimitive.Viewport>{props.children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export const SelectItem = SelectPrimitive.Item;
