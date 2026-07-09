"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchUserRepos,
  analyzeRepo,
  ApiError,
} from "../../components/lib/api";
import { extractUsername } from "../../components/lib/utils";
import { Repo, AnalyzeResult, SortOption } from "../../components/types/repo";
import { RepoCard } from "../../components/repo/RepoCard";
import { RepoFilters } from "../../components/repo/RepoFilters";
import { AnalyzeModal } from "../../components/repo/AnalyzeModal";
import { ProfileOverview } from "../../components/repo/ProfileOverview";
import { RepoCardSkeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorBanner } from "../../components/ui/ErrorBanner";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawInput = searchParams.get("user") ?? "";
  const username = extractUsername(rawInput) ?? rawInput;

  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [hideForks, setHideForks] = useState(true);

  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(
    null,
  );
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    let cancelled = false; // prevents state updates from a stale request (race condition guard)

    async function load() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await fetchUserRepos(username);
        if (!cancelled) setRepos(data);
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof ApiError
              ? err.message
              : "Couldn't load repositories.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const languages = useMemo(() => {
    const set = new Set(
      repos.map((r) => r.language).filter(Boolean) as string[],
    );
    return Array.from(set).sort();
  }, [repos]);

  const filteredRepos = useMemo(() => {
    let result = [...repos];
    if (hideForks) result = result.filter((r) => !r.isFork);
    if (selectedLanguage)
      result = result.filter((r) => r.language === selectedLanguage);

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "language")
        return (a.language ?? "").localeCompare(b.language ?? "");
      return new Date(b.lastPush).getTime() - new Date(a.lastPush).getTime();
    });

    return result;
  }, [repos, hideForks, selectedLanguage, sortBy]);

  async function handleAnalyze(repo: Repo) {
    setAnalyzingId(repo.id);
    setAnalyzeError(null);
    try {
      const result = await analyzeRepo(repo.ownerLogin, repo.name);
      setAnalyzeResult(result);
    } catch (err) {
      setAnalyzeError(
        err instanceof ApiError
          ? err.message
          : "Couldn't analyze this project.",
      );
    } finally {
      setAnalyzingId(null);
    }
  }

  if (!username) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <EmptyState
          title="No profile to explore"
          description="Head back and paste a GitHub username or profile link to get started."
        />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              {username}'s repositories
            </h1>
          </div>
        </header>

        {analyzeError && (
          <div className="mb-6">
            <ErrorBanner
              message={analyzeError}
              onRetry={() => setAnalyzeError(null)}
            />
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RepoCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && loadError && (
          <ErrorBanner
            message={loadError}
            onRetry={() => window.location.reload()}
          />
        )}

        {!isLoading && !loadError && repos.length === 0 && (
          <EmptyState
            title="No public repositories found"
            description={`${username} doesn't have any public repos yet.`}
          />
        )}

        {!isLoading && !loadError && repos.length > 0 && (
          <>
            {!isLoading && !loadError && repos.length > 0 && (
              <ProfileOverview repos={repos} />
            )}
            <div className="mb-6">
              <RepoFilters
                languages={languages}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                sortBy={sortBy}
                onSortChange={setSortBy}
                hideForks={hideForks}
                onHideForksChange={setHideForks}
              />
            </div>

            {filteredRepos.length === 0 ? (
              <EmptyState
                title="No matches"
                description="Try clearing a filter to see more repositories."
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRepos.map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={analyzingId === repo.id}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {analyzeResult && (
          <AnalyzeModal
            result={analyzeResult}
            onClose={() => setAnalyzeResult(null)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
