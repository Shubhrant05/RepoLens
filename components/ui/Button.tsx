import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", isLoading, disabled, className, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-lg px-4 h-11 text-sm font-medium",
          "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" &&
            "bg-[var(--accent)] text-[var(--accent-contrast)] hover:brightness-95 focus-visible:ring-[var(--accent)]",
          variant === "secondary" &&
            "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--border)]",
          variant === "ghost" &&
            "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
          className,
        )}
        {...props}
      >
        {isLoading && <ApertureSpinnerSmall />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

function ApertureSpinnerSmall() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
