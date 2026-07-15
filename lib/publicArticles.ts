import { cache } from "react";
import { supabaseAdmin } from "./supabaseAdmin";
import {
  getArticleBySlug,
  getRelatedArticles,
  latestNews,
  type NewsArticle,
} from "./siteData";

type SupabaseArticleRow = {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  author: string | null;
  source_name: string | null;
  source_url: string | null;
  featured_image: string | null;
  status: string;
  is_imported: boolean | null;
  is_sponsored: boolean | null;
  sponsor_name: string | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

export type PublicArticle = {
  source: "supabase" | "static";
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  contentSections: NewsArticle["contentSections"];
  category: string;
  author: string;
  sourceName: string;
  sourceUrl?: string;
  featuredImage?: string;
  isImported: boolean;
  isSponsored: boolean;
  sponsorName?: string;
  publishedDate: string;
  readingTime: string;
  tags: string[];
  relatedAsset?: string;
  impact?: string;
  seoTitle?: string;
  seoDescription?: string;
};

const articleColumns = `
  id,
  title,
  slug,
  excerpt,
  content,
  category,
  author,
  source_name,
  source_url,
  featured_image,
  status,
  is_imported,
  is_sponsored,
  sponsor_name,
  published_at,
  created_at,
  updated_at,
  seo_title,
  seo_description
`;

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));

  return `${minutes} min read`;
}

function normalizeDate(...dates: Array<string | null | undefined>) {
  return dates.find((date) => Boolean(date)) ?? "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function normalizeArticleSlug(slug: string | null | undefined, title: string) {
  const savedSlug = slug?.trim() || "";

  if (savedSlug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(savedSlug)) {
    return savedSlug;
  }

  return slugify(savedSlug || title) || "article";
}

function mapStaticArticle(article: NewsArticle): PublicArticle {
  return {
    source: "static",
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.contentSections.map((section) => section.body).join("\n\n"),
    contentSections: article.contentSections,
    category: article.category,
    author: article.author,
    sourceName: article.sourceLabel,
    sourceUrl: article.originalSourceUrl,
    isImported: false,
    isSponsored: article.isSponsored,
    sponsorName: article.sponsorName,
    publishedDate: article.publishedDate,
    readingTime: article.readingTime,
    tags: article.tags,
    relatedAsset: article.relatedAsset,
    impact: article.impact,
  };
}

function mapSupabaseArticle(article: SupabaseArticleRow): PublicArticle {
  const content = article.content?.trim() || article.excerpt?.trim() || "";
  const category = article.category?.trim() || "News";
  const sourceName = article.source_name?.trim() || "ChainBrief";
  const slug = normalizeArticleSlug(article.slug, article.title);

  return {
    source: "supabase",
    id: article.id,
    slug,
    title: article.title,
    excerpt: article.excerpt?.trim() || content.slice(0, 180),
    content,
    contentSections: [],
    category,
    author: article.author?.trim() || sourceName,
    sourceName,
    sourceUrl: article.source_url?.trim() || undefined,
    featuredImage: article.featured_image?.trim() || undefined,
    isImported: Boolean(article.is_imported),
    isSponsored: Boolean(article.is_sponsored),
    sponsorName: article.sponsor_name?.trim() || undefined,
    publishedDate: normalizeDate(
      article.published_at,
      article.created_at,
      article.updated_at,
    ),
    readingTime: estimateReadingTime(content),
    tags: [category],
    seoTitle: article.seo_title?.trim() || undefined,
    seoDescription: article.seo_description?.trim() || undefined,
  };
}

export const fetchPublishedSupabaseArticles = cache(async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select(articleColumns)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch published Supabase articles:", error);
      return [];
    }

    return ((data ?? []) as SupabaseArticleRow[]).map(mapSupabaseArticle);
  } catch (error) {
    console.error("Failed to fetch published Supabase articles:", error);
    return [];
  }
});

export const fetchPublishedSponsoredSupabaseArticles = cache(async (limit?: number) => {
  try {
    let query = supabaseAdmin
      .from("articles")
      .select(articleColumns)
      .eq("status", "published")
      .eq("is_sponsored", true)
      .not("slug", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch published sponsored Supabase articles:", error);
      return [];
    }

    return ((data ?? []) as SupabaseArticleRow[])
      .map(mapSupabaseArticle)
      .filter((article) => article.slug && article.slug !== "article");
  } catch (error) {
    console.error("Failed to fetch published sponsored Supabase articles:", error);
    return [];
  }
});

export async function getPublicNewsArticles() {
  const supabaseArticles = await fetchPublishedSupabaseArticles();

  if (supabaseArticles.length > 0) {
    return supabaseArticles;
  }

  return latestNews.map(mapStaticArticle);
}

export const getPublicArticleBySlug = cache(async (slug: string) => {
  const normalizedSlug = normalizeArticleSlug(slug, slug);

  try {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select(articleColumns)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!error && data) {
      return mapSupabaseArticle(data as SupabaseArticleRow);
    }
  } catch (error) {
    console.error(`Failed to fetch Supabase article "${slug}":`, error);
  }

  const supabaseArticle = (await fetchPublishedSupabaseArticles()).find(
    (article) => article.slug === normalizedSlug,
  );

  if (supabaseArticle) {
    return supabaseArticle;
  }

  const staticArticle = getArticleBySlug(normalizedSlug) || getArticleBySlug(slug);

  return staticArticle ? mapStaticArticle(staticArticle) : null;
});

export async function getRelatedPublicArticles(article: PublicArticle, limit = 3) {
  if (article.source === "static") {
    return getRelatedArticles(article.slug, limit).map(mapStaticArticle);
  }

  const supabaseArticles = await fetchPublishedSupabaseArticles();
  const supabaseRelated = supabaseArticles
    .filter((candidate) => candidate.slug !== article.slug)
    .sort((first, second) => {
      const firstScore = first.category === article.category ? 0 : 1;
      const secondScore = second.category === article.category ? 0 : 1;

      return firstScore - secondScore;
    });
  const staticFallback = latestNews
    .filter(
      (candidate) =>
        candidate.slug !== article.slug &&
        !supabaseRelated.some((related) => related.slug === candidate.slug),
    )
    .map(mapStaticArticle);

  return [...supabaseRelated, ...staticFallback].slice(0, limit);
}
