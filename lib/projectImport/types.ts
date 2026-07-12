export type ProjectImportSourceId =
  | "coingecko"
  | "coingecko_recently_added"
  | "coingecko_manual_ids";

export type ProjectImportOptions = {
  manualCoinGeckoIds?: string;
};

export type ImportedProjectCandidate = {
  name: string;
  ticker: string | null;
  category: string | null;
  websiteUrl: string | null;
  twitterUrl?: string | null;
  telegramUrl?: string | null;
  discordUrl?: string | null;
  githubUrl?: string | null;
  whitepaperUrl?: string | null;
  explorerUrl?: string | null;
  contractAddress?: string | null;
  chain?: string | null;
  importedDescription?: string | null;
  importedLinksJson?: Record<string, unknown> | null;
  detailWarning?: string | null;
  importError?: string | null;
  shortDescription: string | null;
  sourceName: string;
  sourceUrl: string;
  externalId: string | null;
};

export type ProjectImportSource = {
  id: ProjectImportSourceId;
  name: string;
  description: string;
  fetchProjects: (options?: ProjectImportOptions) => Promise<ImportedProjectCandidate[]>;
};

export type ProjectImportItemResult = {
  name: string;
  ticker: string | null;
  slug: string;
  sourceName: string;
  sourceUrl: string;
  status: "imported" | "updated" | "skipped" | "error";
  reason?: string;
  projectId?: string;
};

export type ProjectImportResult = {
  sourceName: string;
  imported: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: string[];
  results: ProjectImportItemResult[];
};
