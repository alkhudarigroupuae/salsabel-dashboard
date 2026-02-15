import { ReactNode, HTMLAttributes, TdHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table(props: HTMLAttributes<HTMLTableElement>) {
  const { className, ...rest } = props;
  return (
    <table
      className={cn(
        "w-full border-collapse text-left text-xs text-foreground",
        className
      )}
      {...rest}
    />
  );
}

export function TableHeader(props: { children: ReactNode }) {
  return <thead className="bg-muted/40">{props.children}</thead>;
}

export function TableBody(props: { children: ReactNode }) {
  return <tbody>{props.children}</tbody>;
}

export function TableRow(props: { className?: string; children: ReactNode }) {
  return (
    <tr className={cn("border-b border-border hover:bg-accent/60", props.className)}>
      {props.children}
    </tr>
  );
}

export function TableHead(props: { className?: string; children: ReactNode }) {
  return (
    <th className={cn("px-3 py-2 text-[11px] font-medium uppercase", props.className)}>
      {props.children}
    </th>
  );
}

export function TableCell(
  props: { className?: string; children: ReactNode } & TdHTMLAttributes<HTMLTableCellElement>
) {
  return (
    <td className={cn("px-3 py-2 align-middle", props.className)}>
      {props.children}
    </td>
  );
}
