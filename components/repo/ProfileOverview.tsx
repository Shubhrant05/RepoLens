"use client";
import { Repo } from "../types/repo";
import { LanguageDistribution } from "@/components/repo/LanguageDistribution";

export function ProfileOverview({ repos }: { repos: Repo[] }) {
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const languageCount = new Set(repos.map((r) => r.language).filter(Boolean)).size;
  const mostRecent = repos.reduce((latest, r) =>
    new Date(r.lastPush) > new Date(latest.lastPush) ? r : latest,
  );

  return (
    <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Public repos" value={repos.length} />
        <Stat label="Total stars" value={totalStars} />
        <Stat label="Languages" value={languageCount} />
        <Stat label="Most recent" value={mostRecent.name} truncate />
      </div>

      <div className="mt-5 border-t border-[var(--border)] pt-5">
        <LanguageDistribution repos={repos} />
      </div>
    </div>
  );
}

function Stat({ label, value, truncate }: { label: string; value: string | number; truncate?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[var(--text-secondary)]">{label}</p>
      <p className={`mt-0.5 text-lg font-semibold text-[var(--text-primary)] ${truncate ? "truncate" : ""}`}>
        {value}
      </p>
    </div>
  );
}