"use client";
import { Badge } from "@/components/ui/Badge";
import { LanguageChart } from "@/components/repo/LanguageChart";
import { Skeleton } from "@/components/ui/Skeleton";
import { RepoMetadata, AIAnalysis } from "../types/repo";
import { getProjectScale, getRelativeTime, formatRepoSize } from "../lib/utils";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/Button";
interface AnalyzeModalProps {
  owner: string;
  repo: string;
  metadata: RepoMetadata | null;
  metadataError: string | null;
  aiAnalysis: AIAnalysis | null;
  aiError: string | null;
  isGeneratingAI: boolean;
  onGenerateAI: () => void;
  onClose: () => void;
}

export function AnalyzeModal({
  owner,
  repo,
  metadata,
  metadataError,
  aiAnalysis,
  aiError,
  isGeneratingAI,
  onGenerateAI,
  onClose,
}: AnalyzeModalProps) {
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
            {owner}/{repo}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* AI summary + skills — skeleton until aiAnalysis resolves */}
        <div className="mt-4">
          {aiError ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-[var(--danger)]">{aiError}</p>
              <Button
                variant="secondary"
                onClick={onGenerateAI}
                isLoading={isGeneratingAI}
              >
                Retry
              </Button>
            </div>
          ) : aiAnalysis ? (
            <>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {aiAnalysis.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {aiAnalysis.keySkillsDemonstrated.map((skill) => (
                  <Badge key={skill} tone="teal">
                    {skill}
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-[var(--border)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Generate an AI-written summary, key skills, and notable
                engineering decisions for this project.
              </p>
              <Button onClick={onGenerateAI} isLoading={isGeneratingAI}>
                {isGeneratingAI ? "Generating..." : "Generate AI Summary"}
              </Button>
            </div>
          )}
        </div>

        {/* metrics row — unchanged, still auto-loads via metadata */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-y border-[var(--border)] py-4 sm:grid-cols-4">
          {metadataError ? (
            <p className="col-span-full text-sm text-[var(--danger)]">
              {metadataError}
            </p>
          ) : metadata ? (
            <>
              <Metric
                label="Scale"
                value={getProjectScale(metadata.totalFileCount)}
              />
              <Metric
                label="Last active"
                value={getRelativeTime(metadata.lastPush)}
              />
              <Metric
                label="Size"
                value={formatRepoSize(metadata.repoSizeKb)}
              />
              <Metric
                label="Docs"
                value={metadata.hasReadme ? "README present" : "No README"}
              />
            </>
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))
          )}
        </div>

        {metadata && (
          <div className="mt-6">
            <h3 className="font-display text-sm font-medium text-[var(--text-primary)]">
              Languages
            </h3>
            <div className="mt-3">
              <LanguageChart languageBreakdown={metadata.languageBreakdown} />
            </div>
          </div>
        )}

        {(aiAnalysis?.keyModules?.length ?? 0) > 0 && (
          <div className="mt-6">
            <h3 className="font-display text-sm font-medium text-[var(--text-primary)]">
              Key modules
            </h3>
            <ul className="mt-3 space-y-2.5">
              {aiAnalysis!.keyModules.map((mod) => (
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

        {(aiAnalysis?.notableDecisions?.length ?? 0) > 0 && (
          <div className="mt-6">
            <h3 className="font-display text-sm font-medium text-[var(--text-primary)]">
              Notable decisions
            </h3>
            <ul className="mt-3 space-y-2">
              {aiAnalysis!.notableDecisions.map((point, i) => (
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
