// src/components/ui/EmptyState.tsx
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h3 className="font-display text-lg text-[var(--text-primary)]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}