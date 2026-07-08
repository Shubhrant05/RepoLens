"use client";
import { SortOption } from "../../components/types/repo";
import clsx from "clsx";

interface RepoFiltersProps {
  languages: string[];
  selectedLanguage: string | null;
  onLanguageChange: (lang: string | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  hideForks: boolean;
  onHideForksChange: (hide: boolean) => void;
}

export function RepoFilters({
  languages,
  selectedLanguage,
  onLanguageChange,
  sortBy,
  onSortChange,
  hideForks,
  onHideForksChange,
}: RepoFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by language">
        <button
          onClick={() => onLanguageChange(null)}
          className={clsx(
            "rounded-full border px-3 py-1.5 text-sm transition-colors",
            !selectedLanguage
              ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
              : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
          )}
        >
          All
        </button>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              selectedLanguage === lang
                ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            )}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={hideForks}
            onChange={(e) => onHideForksChange(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
          />
          Hide forks
        </label>

        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          Sort
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <option value="updated">Last updated</option>
            <option value="name">Name</option>
            <option value="language">Language</option>
          </select>
        </label>
      </div>
    </div>
  );
}