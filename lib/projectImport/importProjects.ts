import "server-only";

import { randomUUID } from "crypto";
import { supabaseAdmin } from "../supabaseAdmin";
import { coinGeckoProjectSource } from "./sources/coingecko";
import type {
  ImportedProjectCandidate,
  ProjectImportResult,
  ProjectImportSource,
  ProjectImportSourceId,
} from "./types";

export const projectImportSources: ProjectImportSource[] = [coinGeckoProjectSource];

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

async function projectExists(candidate: ImportedProjectCandidate, slug: string) {
  const websiteUrl = normalizeUrl(candidate.websiteUrl);

  if (websiteUrl) {
    const { data, error } = await supabaseAdmin
      .from("crypto_projects")
      .select("id")
      .eq("website_url", websiteUrl)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      return true;
    }
  }

  const bySlug = await supabaseAdmin
    .from("crypto_projects")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (bySlug.error) {
    throw new Error(bySlug.error.message);
  }

  if (bySlug.data) {
    return true;
  }

  if (!candidate.ticker) {
    return false;
  }

  const byNameAndTicker = await supabaseAdmin
    .from("crypto_projects")
    .select("id")
    .ilike("name", candidate.name)
    .ilike("symbol", candidate.ticker)
    .maybeSingle();

  if (byNameAndTicker.error) {
    throw new Error(byNameAndTicker.error.message);
  }

  return Boolean(byNameAndTicker.data);
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
): Promise<ProjectImportResult> {
  const source = sourceById(sourceId);

  if (!source) {
    return {
      sourceName: "Unknown source",
      imported: 0,
      skipped: 0,
      errors: [`Unsupported project import source: ${sourceId}`],
      results: [],
    };
  }

  const result: ProjectImportResult = {
    sourceName: source.name,
    imported: 0,
    skipped: 0,
    errors: [],
    results: [],
  };

  let candidates: ImportedProjectCandidate[] = [];

  try {
    candidates = await source.fetchProjects();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown source error";

    return {
      ...result,
      errors: [`${source.name}: ${message}`],
    };
  }

  for (const candidate of candidates) {
    const slug = await makeUniqueProjectSlug(candidate.name);

    try {
      if (await projectExists(candidate, slugify(candidate.name))) {
        result.skipped += 1;
        result.results.push({
          name: candidate.name,
          ticker: candidate.ticker,
          slug: slugify(candidate.name),
          sourceName: candidate.sourceName,
          sourceUrl: candidate.sourceUrl,
          status: "skipped",
          reason: "Already exists",
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
        chain: null,
        website_url: normalizeUrl(candidate.websiteUrl),
        twitter_url: null,
        telegram_url: null,
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
