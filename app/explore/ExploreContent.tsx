"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchUserRepos,
  fetchRepoMetadata,
  analyzeRepo,
  ApiError,
} from "../../components/lib/api";
import { extractUsername } from "../../components/lib/utils";
import {
  Repo,
  RepoMetadata,
  AIAnalysis,
  SortOption,
} from "../../components/types/repo";
import { RepoCard } from "../../components/repo/RepoCard";
import { RepoFilters } from "../../components/repo/RepoFilters";
import { AnalyzeModal } from "../../components/repo/AnalyzeModal";
import { ProfileOverview } from "../../components/repo/ProfileOverview";
import { RepoCardSkeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorBanner } from "../../components/ui/ErrorBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function ExploreContent() {
  const searchParams = useSearchParams();
  const rawInput = searchParams.get("user") ?? "";
  const username = extractUsername(rawInput) ?? rawInput;

  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [hideForks, setHideForks] = useState(true);

  // modal state — split into two independent pieces, one per data source
  const [modalRepo, setModalRepo] = useState<{
    owner: string;
    repo: string;
  } | null>(null);

  const [metadata, setMetadata] = useState<RepoMetadata | null>(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

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

  function handleAnalyze(repo: Repo) {
    setModalRepo({ owner: repo.ownerLogin, repo: repo.name });

    setMetadata(null);
    setMetadataError(null);
    setAiAnalysis(null);
    setAiError(null);
    setIsLoadingMetadata(true);

    fetchRepoMetadata(repo.ownerLogin, repo.name)
      .then(setMetadata)
      .catch((err) =>
        setMetadataError(
          err instanceof ApiError ? err.message : "Couldn't load repo details.",
        ),
      )
      .finally(() => setIsLoadingMetadata(false));

    // no more automatic analyzeRepo call here — that now only fires on demand
  }

  function handleGenerateAI() {
    if (!modalRepo) return;

    setIsGeneratingAI(true);
    setAiError(null);

    analyzeRepo(modalRepo.owner, modalRepo.repo)
      .then(setAiAnalysis)
      .catch((err) =>
        setAiError(
          err instanceof ApiError
            ? err.message
            : "Couldn't generate AI summary.",
        ),
      )
      .finally(() => setIsGeneratingAI(false));
  }

  function handleCloseModal() {
    setModalRepo(null);
    setMetadata(null);
    setMetadataError(null);
    setAiAnalysis(null);
    setAiError(null);
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
            <ProfileOverview repos={repos} />

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
                    isAnalyzing={false}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {modalRepo && (
          <AnalyzeModal
            owner={modalRepo.owner}
            repo={modalRepo.repo}
            metadata={metadata}
            metadataError={metadataError}
            aiAnalysis={aiAnalysis}
            aiError={aiError}
            isGeneratingAI={isGeneratingAI}
            onGenerateAI={handleGenerateAI}
            onClose={handleCloseModal}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
