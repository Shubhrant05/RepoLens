class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
  } catch {
    // network failure — user is offline, DNS issue, server unreachable, etc.
    throw new ApiError("Couldn't reach the server. Check your connection and try again.", 0);
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // response wasn't valid JSON at all
    throw new ApiError("Received an unexpected response from the server.", res.status);
  }

  if (!res.ok) {
    throw new ApiError(data?.error ?? "Something went wrong. Please try again.", res.status);
  }

  return data as T;
}

export function fetchUserRepos(userLink: string) {
  return apiFetch<import("../../components/types/repo").Repo[]>("/api/user-repos", {
    method: "POST",
    body: JSON.stringify({ userLink }),
  });
}

export function fetchRepoMetadata(owner: string, repo: string) {
  return apiFetch<import("../types/repo").RepoMetadata>("/api/repo-metadata", {
    method: "POST",
    body: JSON.stringify({ owner, repo }),
  });
}

export function analyzeRepo(owner: string, repo: string) {
  return apiFetch<import("../types/repo").AIAnalysis>("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ owner, repo }),
  });
}

export { ApiError };