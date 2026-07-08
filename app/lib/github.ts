// src/lib/github.ts

const GITHUB_HEADERS = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};

export async function getRepoDetails(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: GITHUB_HEADERS,
  });

  console.log("Rate limit remaining:", res.headers.get("x-ratelimit-remaining"));

  if (!res.ok) {
    throw new Error(`Repo not found or inaccessible (status ${res.status})`);
  }

  return res.json();
}

export async function getRepoTree(owner: string, repo: string, branch: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: GITHUB_HEADERS },
  );

  if (res.status === 409) {
    // repo exists but has no commits/content yet
    return [];
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch repo tree (status ${res.status})`);
  }

  const data = await res.json();
  return data.tree as { path: string; type: string; size?: number }[];
}

export async function getFileContent(owner: string, repo: string, filePath: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    { headers: GITHUB_HEADERS },
  );

  if (!res.ok) {
    // don't throw here — a single missing file shouldn't kill the whole analysis
    return null;
  }

  const data = await res.json();
  if (!data.content) return null;

  const decoded = Buffer.from(data.content, "base64").toString("utf-8");

  // truncate large files so we don't blow Gemini's token limit / cost
  const MAX_CHARS = 3000;
  return decoded.length > MAX_CHARS ? decoded.slice(0, MAX_CHARS) + "\n...[truncated]" : decoded;
}

export async function getLanguages(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
    headers: GITHUB_HEADERS,
  });

  if (!res.ok) return {};
  return res.json(); // { "TypeScript": 45032, "CSS": 1200, ... }
}

// picks the files worth sending to the AI, skips noise
export function pickImportantFiles(tree: { path: string; type: string; size?: number }[]) {
  const IGNORE_PATTERNS = [
    "node_modules/",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".git/",
    "dist/",
    "build/",
    ".next/",
  ];

  const PRIORITY_NAMES = ["readme.md", "package.json", "main.py", "index.js", "index.ts", "app.py"];

  return tree
    .filter((f) => f.type === "blob")
    .filter((f) => !IGNORE_PATTERNS.some((pattern) => f.path.toLowerCase().includes(pattern)))
    .sort((a, b) => {
      const aPriority = PRIORITY_NAMES.some((name) => a.path.toLowerCase().endsWith(name)) ? 0 : 1;
      const bPriority = PRIORITY_NAMES.some((name) => b.path.toLowerCase().endsWith(name)) ? 0 : 1;
      return aPriority - bPriority;
    })
    .slice(0, 15); // cap file count — keeps Gemini prompt size + GitHub calls sane
}