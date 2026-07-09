import "server-only";

import { randomUUID } from "crypto";
import Parser from "rss-parser";
import { supabaseAdmin } from "./supabaseAdmin";

export type RssImportResult = {
  imported: number;
  skipped: number;
  skippedDuplicates: number;
  skippedInvalid: number;
  sourceCount: number;
  errors: string[];
};

const rssParser = new Parser();

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function cleanExcerpt(value?: string) {
  if (!value) {
    return null;
  }

  const text = value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    return null;
  }

  return text.length > 320 ? `${text.slice(0, 317)}...` : text;
}

function normalizeDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

async function articleExistsByImportKeys(originalSourceUrl: string, externalId: string | null) {
  const byUrl = await supabaseAdmin
    .from("articles")
    .select("id")
    .eq("original_source_url", originalSourceUrl)
    .maybeSingle();

  if (byUrl.error) {
    throw new Error(byUrl.error.message);
  }

  if (byUrl.data) {
    return true;
  }

  if (!externalId) {
    return false;
  }

  const byExternalId = await supabaseAdmin
    .from("articles")
    .select("id")
    .eq("external_id", externalId)
    .maybeSingle();

  if (byExternalId.error) {
    throw new Error(byExternalId.error.message);
  }

  return Boolean(byExternalId.data);
}

async function makeUniqueArticleSlug(title: string) {
  const base = slugify(title) || "imported-news";
  let candidate = base;

  for (let index = 0; index < 8; index += 1) {
    const { data, error } = await supabaseAdmin
      .from("articles")
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

export async function runRssImport(): Promise<RssImportResult> {
  const { data: sources, error } = await supabaseAdmin
    .from("sources")
    .select("id,name,website_url,feed_url,category,is_active")
    .eq("is_active", true)
    .not("feed_url", "is", null)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const result: RssImportResult = {
    imported: 0,
    skipped: 0,
    skippedDuplicates: 0,
    skippedInvalid: 0,
    sourceCount: sources?.length || 0,
    errors: [],
  };

  for (const source of sources || []) {
    if (!source.feed_url) {
      result.skipped += 1;
      result.skippedInvalid += 1;
      continue;
    }

    try {
      const feed = await rssParser.parseURL(source.feed_url);
      const items = feed.items.slice(0, 20);

      for (const item of items) {
        const title = item.title?.trim();
        const originalSourceUrl = item.link?.trim();

        if (!title || !originalSourceUrl) {
          result.skipped += 1;
          result.skippedInvalid += 1;
          continue;
        }

        const externalId = item.guid || item.id || originalSourceUrl;
        const exists = await articleExistsByImportKeys(originalSourceUrl, externalId);

        if (exists) {
          result.skipped += 1;
          result.skippedDuplicates += 1;
          continue;
        }

        const now = new Date().toISOString();
        const { error: insertError } = await supabaseAdmin.from("articles").insert({
          title,
          slug: await makeUniqueArticleSlug(title),
          excerpt: cleanExcerpt(item.contentSnippet || item.description || item.content),
          content: null,
          category: source.category,
          source_id: source.id,
          source_name: source.name,
          source_url: source.website_url,
          original_source_url: originalSourceUrl,
          status: "pending",
          is_imported: true,
          imported_at: now,
          external_id: externalId,
          published_at: normalizeDate(item.isoDate || item.pubDate),
          created_at: now,
          updated_at: now,
        });

        if (insertError) {
          result.errors.push(`${source.name}: ${insertError.message}`);
          continue;
        }

        result.imported += 1;
      }
    } catch (importError) {
      const message = importError instanceof Error ? importError.message : "Unknown import error";
      result.errors.push(`${source.name}: ${message}`);
    }
  }

  return result;
}
