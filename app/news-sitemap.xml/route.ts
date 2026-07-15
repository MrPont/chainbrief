import { SITE_URL } from "../../lib/siteData";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type NewsSitemapArticleRow = {
  title: string | null;
  slug: string | null;
  published_at: string | null;
  created_at: string | null;
};

const MAX_NEWS_URLS = 1000;
const RECENT_WINDOW_MS = 48 * 60 * 60 * 1000;
const xmlHeaders = {
  "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600",
  "Content-Type": "application/xml; charset=utf-8",
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeSlug(slug: string) {
  return slug.trim().replace(/^\/+|\/+$/g, "");
}

function isValidRecentDate(date: string, oldestAllowed: Date, newestAllowed: Date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  return parsedDate >= oldestAllowed && parsedDate <= newestAllowed;
}

function renderNewsSitemap(articles: NewsSitemapArticleRow[]) {
  const urls = articles
    .map((article) => {
      const title = article.title?.trim();
      const slug = article.slug ? normalizeSlug(article.slug) : "";
      const publicationDate = article.published_at || article.created_at;

      if (!title || !slug || !publicationDate) {
        return null;
      }

      return `  <url>
    <loc>${escapeXml(`${SITE_URL}/news/${encodeURIComponent(slug)}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>ChainBrief</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(new Date(publicationDate).toISOString())}</news:publication_date>
      <news:title>${escapeXml(title)}</news:title>
    </news:news>
  </url>`;
    })
    .filter(Boolean)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;
}

export async function GET() {
  const now = new Date();
  const oldestAllowed = new Date(now.getTime() - RECENT_WINDOW_MS);

  try {
    const nowIso = now.toISOString();
    const oldestAllowedIso = oldestAllowed.toISOString();
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("title,slug,published_at,created_at")
      .eq("status", "published")
      .not("slug", "is", null)
      .or(`published_at.is.null,published_at.lte.${nowIso}`)
      .or(`published_at.gte.${oldestAllowedIso},created_at.gte.${oldestAllowedIso}`)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(MAX_NEWS_URLS);

    if (error) {
      console.error("Failed to fetch Google News sitemap articles:", error);

      return new Response(renderNewsSitemap([]), {
        headers: xmlHeaders,
      });
    }

    const articles = ((data ?? []) as NewsSitemapArticleRow[]).filter((article) => {
      const publicationDate = article.published_at || article.created_at;

      return Boolean(
        article.title?.trim() &&
          article.slug?.trim() &&
          publicationDate &&
          isValidRecentDate(publicationDate, oldestAllowed, now),
      );
    });

    return new Response(renderNewsSitemap(articles), {
      headers: xmlHeaders,
    });
  } catch (error) {
    console.error("Failed to build Google News sitemap:", error);

    return new Response(renderNewsSitemap([]), {
      headers: xmlHeaders,
    });
  }
}
