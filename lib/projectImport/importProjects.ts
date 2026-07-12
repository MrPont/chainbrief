import "server-only";

import { randomUUID } from "crypto";
import { supabaseAdmin } from "../supabaseAdmin";
import { coinGeckoManualProjectSource } from "./sources/coingeckoManual";
import { coinGeckoProjectSource } from "./sources/coingecko";
import { coinGeckoRecentlyAddedProjectSource } from "./sources/coingeckoRecentlyAdded";
import type {
  ImportedProjectCandidate,
  ProjectImportOptions,
  ProjectImportResult,
  ProjectImportSource,
  ProjectImportSourceId,
} from "./types";

export const projectImportSources: ProjectImportSource[] = [
  coinGeckoProjectSource,
  coinGeckoRecentlyAddedProjectSource,
  coinGeckoManualProjectSource,
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function normalizeUrl(value: string | null) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  try {
    const url = new URL(
      /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`,
    );

    return url.toString().replace(/\/$/, "");
  } catch {
    return trimmedValue;
  }
}

function sourceById(sourceId: string): ProjectImportSource | null {
  return projectImportSources.find((source) => source.id === sourceId) || null;
}

function hasNoStoredValue(value: unknown) {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
}

function isUniqueProjectSourceUrl(candidate: ImportedProjectCandidate) {
  return Boolean(
    candidate.sourceUrl &&
      (candidate.externalId ||
        !candidate.sourceUrl.includes("coingecko.com/en/new-cryptocurrencies")),
  );
}

async function findExistingProject(candidate: ImportedProjectCandidate, slug: string) {
  const websiteUrl = normalizeUrl(candidate.websiteUrl);
  const columns = `
    id,
    status,
    review_status,
    imported_at,
    website_url,
    twitter_url,
    telegram_url,
    discord_url,
    github_url,
    whitepaper_url,
    explorer_url,
    contract_address,
    chain,
    imported_description,
    imported_links_json
  `;

  if (isUniqueProjectSourceUrl(candidate)) {
    const { data, error } = await supabaseAdmin
      .from("crypto_projects")
      .select(columns)
      .eq("source_url", candidate.sourceUrl)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      return data;
    }
  }

  if (websiteUrl) {
    const { data, error } = await supabaseAdmin
      .from("crypto_projects")
      .select(columns)
      .eq("website_url", websiteUrl)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      return data;
    }
  }

  if (candidate.contractAddress) {
    const { data, error } = await supabaseAdmin
      .from("crypto_projects")
      .select(columns)
      .eq("contract_address", candidate.contractAddress)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      return data;
    }
  }

  const bySlug = await supabaseAdmin
    .from("crypto_projects")
    .select(columns)
    .eq("slug", slug)
    .maybeSingle();

  if (bySlug.error) {
    throw new Error(bySlug.error.message);
  }

  if (bySlug.data) {
    return bySlug.data;
  }

  if (!candidate.ticker) {
    return null;
  }

  const byNameAndTicker = await supabaseAdmin
    .from("crypto_projects")
    .select(columns)
    .ilike("name", candidate.name)
    .ilike("symbol", candidate.ticker)
    .maybeSingle();

  if (byNameAndTicker.error) {
    throw new Error(byNameAndTicker.error.message);
  }

  return byNameAndTicker.data || null;
}

async function updateMissingProjectMetadata(
  existingProject: Record<string, unknown>,
  candidate: ImportedProjectCandidate,
) {
  const isImportedDraft =
    existingProject.status === "draft" &&
    (existingProject.review_status === "needs_review" || !existingProject.review_status);

  if (!isImportedDraft || typeof existingProject.id !== "string") {
    return false;
  }

  const metadataUpdates: Record<string, unknown> = {};
  const candidateFields = {
    website_url: normalizeUrl(candidate.websiteUrl),
    twitter_url: normalizeUrl(candidate.twitterUrl || null),
    telegram_url: normalizeUrl(candidate.telegramUrl || null),
    discord_url: normalizeUrl(candidate.discordUrl || null),
    github_url: normalizeUrl(candidate.githubUrl || null),
    whitepaper_url: normalizeUrl(candidate.whitepaperUrl || null),
    explorer_url: normalizeUrl(candidate.explorerUrl || null),
    contract_address: candidate.contractAddress || null,
    chain: candidate.chain || null,
    imported_description: candidate.importedDescription || null,
    imported_links_json: candidate.importedLinksJson || null,
  };

  for (const [column, value] of Object.entries(candidateFields)) {
    if (value && hasNoStoredValue(existingProject[column])) {
      metadataUpdates[column] = value;
    }
  }

  if (Object.keys(metadataUpdates).length === 0) {
    return false;
  }

  metadataUpdates.updated_at = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from("crypto_projects")
    .update(metadataUpdates)
    .eq("id", existingProject.id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

async function makeUniqueProjectSlug(name: string) {
  const base = slugify(name) || "imported-project";
  let candidate = base;

  for (let index = 0; index < 8; index += 1) {
    const { data, error } = await supabaseAdmin
      .from("crypto_projects")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }

    candidate = `${base}-${index + 2}`;
  }

  return `${base}-${randomUUID().slice(0, 8)}`;
}

export async function runProjectImport(
  sourceId: ProjectImportSourceId,
  options?: ProjectImportOptions,
): Promise<ProjectImportResult> {
  const source = sourceById(sourceId);

  if (!source) {
    return {
      sourceName: "Unknown source",
      imported: 0,
      updated: 0,
      skipped: 0,
      failed: 1,
      errors: [`Unsupported project import source: ${sourceId}`],
      results: [],
    };
  }

  const result: ProjectImportResult = {
    sourceName: source.name,
    imported: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
    results: [],
  };

  let candidates: ImportedProjectCandidate[] = [];

  try {
    candidates = await source.fetchProjects(options);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown source error";

    return {
      ...result,
      failed: 1,
      errors: [`${source.name}: ${message}`],
    };
  }

  for (const candidate of candidates) {
    const slug = await makeUniqueProjectSlug(candidate.name);

    try {
      if (candidate.importError) {
        result.failed += 1;
        result.errors.push(`${candidate.name}: ${candidate.importError}`);
        result.results.push({
          name: candidate.name,
          ticker: candidate.ticker,
          slug: slugify(candidate.name),
          sourceName: candidate.sourceName,
          sourceUrl: candidate.sourceUrl,
          status: "error",
          reason: candidate.importError,
        });
        continue;
      }

      if (candidate.detailWarning) {
        result.errors.push(`${candidate.name}: ${candidate.detailWarning}`);
      }

      const existingProject = await findExistingProject(candidate, slugify(candidate.name));

      if (existingProject) {
        const updatedMetadata = await updateMissingProjectMetadata(
          existingProject as Record<string, unknown>,
          candidate,
        );

        if (updatedMetadata) {
          result.updated += 1;
        } else {
          result.skipped += 1;
        }

        result.results.push({
          name: candidate.name,
          ticker: candidate.ticker,
          slug: slugify(candidate.name),
          sourceName: candidate.sourceName,
          sourceUrl: candidate.sourceUrl,
          status: updatedMetadata ? "updated" : "skipped",
          reason: updatedMetadata
            ? "Already exists; missing review metadata updated"
            : "Already exists",
        });
        continue;
      }

      const now = new Date().toISOString();
      const payload = {
        name: candidate.name,
        slug,
        symbol: candidate.ticker,
        category: candidate.category,
        short_description: candidate.shortDescription,
        full_description: null,
        chain: candidate.chain || null,
        website_url: normalizeUrl(candidate.websiteUrl),
        twitter_url: normalizeUrl(candidate.twitterUrl || null),
        telegram_url: normalizeUrl(candidate.telegramUrl || null),
        discord_url: normalizeUrl(candidate.discordUrl || null),
        github_url: normalizeUrl(candidate.githubUrl || null),
        whitepaper_url: normalizeUrl(candidate.whitepaperUrl || null),
        explorer_url: normalizeUrl(candidate.explorerUrl || null),
        contract_address: candidate.contractAddress || null,
        imported_description: candidate.importedDescription || null,
        imported_links_json: candidate.importedLinksJson || null,
        logo_url: null,
        rank: null,
        score: null,
        tags: candidate.category ? [candidate.category] : [],
        highlights: [],
        risks: [],
        is_sponsored: false,
        sponsor_label: null,
        status: "draft",
        source_name: candidate.sourceName,
        source_url: candidate.sourceUrl,
        imported_at: now,
        review_status: "needs_review",
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await supabaseAdmin
        .from("crypto_projects")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      result.imported += 1;
      result.results.push({
        name: candidate.name,
        ticker: candidate.ticker,
        slug,
        sourceName: candidate.sourceName,
        sourceUrl: candidate.sourceUrl,
        status: "imported",
        projectId: data?.id,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown import error";
      result.failed += 1;
      result.errors.push(`${candidate.name}: ${message}`);
      result.results.push({
        name: candidate.name,
        ticker: candidate.ticker,
        slug,
        sourceName: candidate.sourceName,
        sourceUrl: candidate.sourceUrl,
        status: "error",
        reason: message,
      });
    }
  }

  return result;
}
