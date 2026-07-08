// src/components/ui/ErrorBanner.tsx
import { Button } from "./Button";

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-[var(--danger)]">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="shrink-0">
          Try again
        </Button>
      )}
    </div>
  );
}