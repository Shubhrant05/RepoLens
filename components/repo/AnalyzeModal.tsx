"use client";
import { Badge } from "@/components/ui/Badge";
import { LanguageChart } from "../../components/repo/LanguageChart";
import { AnalyzeResult } from "../types/repo";
import { getProjectScale, getRelativeTime, formatRepoSize } from "../lib/utils";
import { X } from "lucide-react";
import { useEffect } from "react";

interface AnalyzeModalProps {
  result: AnalyzeResult;
  onClose: () => void;
}

export function AnalyzeModal({ result, onClose }: AnalyzeModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="analyze-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel-modal max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--glass-border)] bg-[var(--modal-glass-bg)] p-6"
      >
        <div className="flex items-start justify-between">
          <h2
            id="analyze-title"
            className="font-display text-xl font-semibold text-[var(--text-primary)]"
          >
            {result.owner}/{result.repo}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
          {result.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {result.keySkillsDemonstrated.map((skill) => (
            <Badge key={skill} tone="teal">
              {skill}
            </Badge>
          ))}
        </div>

        {/* metrics row */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-y border-[var(--border)] py-4 sm:grid-cols-4">
          <Metric
            label="Scale"
            value={getProjectScale(result.totalFileCount)}
          />
          <Metric
            label="Last active"
            value={getRelativeTime(result.lastPush)}
          />
          <Metric label="Size" value={formatRepoSize(result.repoSizeKb)} />
          <Metric
            label="Docs"
            value={result.hasReadme ? "README present" : "No README"}
          />
        </div>

        {/* language breakdown */}
        <div className="mt-6">
          <h3 className="font-display text-sm font-medium text-[var(--text-primary)]">
            Languages
          </h3>
          <div className="mt-3">
            <LanguageChart languageBreakdown={result.languageBreakdown} />
          </div>
        </div>

        {/* key modules */}
        {result.keyModules?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-display text-sm font-medium text-[var(--text-primary)]">
              Key modules
            </h3>
            <ul className="mt-3 space-y-2.5">
              {result.keyModules.map((mod) => (
                <li
                  key={mod.name}
                  className="rounded-lg border border-[var(--border)] p-3"
                >
                  <p className="font-mono text-sm font-medium text-[var(--accent)]">
                    {mod.name}
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                    {mod.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* notable decisions */}
        {result.notableDecisions?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-display text-sm font-medium text-[var(--text-primary)]">
              Notable decisions
            </h3>
            <ul className="mt-3 space-y-2">
              {result.notableDecisions.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-[var(--text-secondary)]"
                >
                  <span className="text-[var(--accent)]">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--text-secondary)]">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}
