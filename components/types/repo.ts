export interface Repo {
  id: number;
  name: string;
  fullName: string;
  ownerLogin: string;
  htmlUrl: string;
  description: string;
  language: string | null;
  isFork: boolean;
  lastUpdated: string;
  lastPush: string;
  stars: number;
}

export interface KeyModule {
  name: string;
  description: string;
}

export interface RepoMetadata {
  owner: string;
  repo: string;
  languageBreakdown: Record<string, number>;
  totalFileCount: number;
  lastPush: string;
  repoSizeKb: number;
  hasReadme: boolean;
}

export interface AIAnalysis {
  owner: string;
  repo: string;
  summary: string;
  keySkillsDemonstrated: string[];
  keyModules: KeyModule[];
  notableDecisions: string[];
}

export type SortOption = "updated" | "name" | "language";