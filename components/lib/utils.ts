export function getProjectScale(fileCount: number): string {
  if (fileCount < 15) return "Small utility";
  if (fileCount < 75) return "Mid-size project";
  return "Large project";
}

export function getRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function formatRepoSize(sizeKb: number): string {
  if (sizeKb < 1024) return `${sizeKb} KB`;
  return `${(sizeKb / 1024).toFixed(1)} MB`;
}

// add to src/lib/utils.ts

export function extractUsername(input: string): string | null {
  const trimmed = input.trim();

  const urlMatch = trimmed.match(/https?:\/\/(?:www\.)?github\.com\/([^/?#]+)\/?$/);
  if (urlMatch) return urlMatch[1];

  const usernameMatch = trimmed.match(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/);
  if (usernameMatch) return trimmed;

  return null;
}