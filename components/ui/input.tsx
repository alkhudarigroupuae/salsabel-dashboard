import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function InputComponent(props, ref) {
    const { className, ...rest } = props;
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full border border-border bg-background px-3 text-sm text-foreground outline-none ring-0 placeholder:text-muted focus:border-primary",
          className
        )}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";
