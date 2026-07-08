"use client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Repo } from "../../components/types/repo";
import { ExternalLink } from "lucide-react";

interface RepoCardProps {
  repo: Repo;
  onAnalyze: (repo: Repo) => void;
  isAnalyzing: boolean;
}

export function RepoCard({ repo, onAnalyze, isAnalyzing }: RepoCardProps) {
  const lastPushDate = new Date(repo.lastPush).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-medium text-[var(--text-primary)]">
          {repo.name}
        </h3>
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${repo.name} on GitHub`}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <ExternalLink size={16} />
        </a>
      </div>

      <p className="mt-2 flex-1 text-sm text-[var(--text-secondary)]">
        {repo.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {repo.language && <Badge tone="teal">{repo.language}</Badge>}
        {repo.isFork && <Badge>Forked</Badge>}
        <span className="ml-auto font-mono text-xs text-[var(--text-secondary)]">
          Updated {lastPushDate}
        </span>
      </div>

      <Button
        variant="secondary"
        onClick={() => onAnalyze(repo)}
        disabled={isAnalyzing}
        className="relative mt-4 w-full overflow-hidden"
      >
        {isAnalyzing && (
          <span
            className="absolute inset-y-0 left-0 w-1/3 bg-[var(--accent)]/30"
            style={{ animation: "loading-sweep 1.2s ease-in-out infinite" }}
          />
        )}
        <span className="relative z-10">
          {isAnalyzing ? "Analyzing..." : "Analyze project"}
        </span>
      </Button>
    </Card>
  );
}
