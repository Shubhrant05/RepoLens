"use client";
import { useState } from "react";
import { Repo } from "../types/repo";
import { ChevronDown } from "lucide-react";

const COLORS = ["var(--accent)", "var(--teal)", "#8D96A0", "#D1242F", "#59636E", "#4493F8"];

export function LanguageDistribution({ repos }: { repos: Repo[] }) {
  const [expanded, setExpanded] = useState(false);

  const counts: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const data = Object.entries(counts)
    .map(([name, count]) => ({ name, percent: Math.round((count / total) * 100), count }))
    .sort((a, b) => b.percent - a.percent);

  if (data.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-medium text-[var(--text-secondary)]">Language distribution</span>
        <ChevronDown
          size={16}
          className={`text-[var(--text-secondary)] transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* collapsed: segmented strip, colors sized by ratio, no labels */}
      {!expanded && (
        <div
          className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full"
          role="img"
          aria-label={data.map((d) => `${d.name} ${d.percent}%`).join(", ")}
        >
          {data.map((d, i) => (
            <div
              key={d.name}
              title={`${d.name} — ${d.percent}%`}
              style={{ width: `${d.percent}%`, background: COLORS[i % COLORS.length] }}
            />
          ))}
        </div>
      )}

      {/* expanded: full breakdown with labels */}
      {expanded && (
        <div className="mt-3 space-y-2.5">
          {data.map((d, i) => (
            <div key={d.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-[var(--text-primary)]">{d.name}</span>
                <span className="font-mono text-xs text-[var(--text-secondary)]">
                  {d.count} repo{d.count !== 1 ? "s" : ""} · {d.percent}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--border)]">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${d.percent}%`, background: COLORS[i % COLORS.length] }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}