// src/components/ui/Badge.tsx
import clsx from "clsx";

export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "teal" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono",
        tone === "default" && "bg-[var(--border)] text-[var(--text-secondary)]",
        tone === "teal" && "bg-[var(--teal)]/15 text-[var(--teal)]",
      )}
    >
      {children}
    </span>
  );
}