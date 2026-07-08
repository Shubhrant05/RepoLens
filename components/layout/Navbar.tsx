import Link from "next/link";
import { Mail, Coffee } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <header className="flex items-center justify-between p-6">
      <Link href="/" className="flex items-center gap-2">
        <Logo size={20} />
        <span className="font-display text-lg font-semibold text-[var(--text-primary)]">
          RepoLens
        </span>
      </Link>

      <nav className="flex items-center gap-4">
        <Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          About
        </Link>

        <a
          href="mailto:devshubh1803@gmail.com?subject=RepoLens%20feedback"
          aria-label="Share feedback via email"
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <Mail size={18} />
        </a>

        <a
          href="https://buymeachai.ezee.li/devshubh"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buy me a chai"
          className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
        >
          <Coffee size={18} />
        </a>

        <ThemeToggle />
      </nav>
    </header>
  );
}