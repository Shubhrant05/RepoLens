import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "group rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5",
        "transition-all duration-200 hover:-translate-y-1",
        "hover:shadow-[0_10px_26px_-2px_rgba(31,136,61,0.35)]",
        "hover:border-[var(--accent)]/40",
        className,
      )}
      {...props}
    />
  );
}