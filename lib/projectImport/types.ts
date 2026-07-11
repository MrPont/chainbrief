export type ProjectImportSourceId = "coingecko";

export type ImportedProjectCandidate = {
  name: string;
  ticker: string | null;
  category: string | null;
  websiteUrl: string | null;
  shortDescription: string | null;
  sourceName: string;
  sourceUrl: string;
  externalId: string | null;
};

export type ProjectImportSource = {
  id: ProjectImportSourceId;
  name: string;
  description: string;
  fetchProjects: () => Promise<ImportedProjectCandidate[]>;
};

export type ProjectImportItemResult = {
  name: string;
  ticker: string | null;
  slug: string;
  sourceName: string;
  sourceUrl: string;
  status: "imported" | "skipped" | "error";
  reason?: string;
  projectId?: string;
};

export type ProjectImportResult = {
  sourceName: string;
  imported: number;
  skipped: number;
  errors: string[];
  results: ProjectImportItemResult[];
};
