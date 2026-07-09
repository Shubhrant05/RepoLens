import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "glass-panel group rounded-xl border p-5",
        "bg-[var(--glass-bg)] border-[var(--glass-border)]",
        "transition-all duration-200 hover:-translate-y-1",
        "hover:shadow-[0_8px_24px_-4px_rgba(31,136,61,0.35)]",
        className,
      )}
      {...props}
    />
  );
}
