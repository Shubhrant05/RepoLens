"use client";

const COLORS = ["var(--accent)", "var(--teal)", "#8D96A0", "#D1242F", "#59636E", "#4493F8"];

export function LanguageChart({ languageBreakdown }: { languageBreakdown: Record<string, number> }) {
  const total = Object.values(languageBreakdown).reduce((a, b) => a + b, 0);
  const data = Object.entries(languageBreakdown)
    .map(([name, bytes]) => ({ name, percent: Math.round((bytes / total) * 100) }))
    .sort((a, b) => b.percent - a.percent)
    .filter((d) => d.percent > 0);

  if (data.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {data.map((d, i) => (
        <div key={d.name}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-[var(--text-primary)]">{d.name}</span>
            <span className="font-mono text-xs text-[var(--text-secondary)]">{d.percent}%</span>
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
  );
}