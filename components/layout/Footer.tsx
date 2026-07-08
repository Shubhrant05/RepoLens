export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 py-6 text-center text-xs text-[var(--text-secondary)]">
      © {new Date().getFullYear()} RepoLens. Built by Shubhrant.
    </footer>
  );
}