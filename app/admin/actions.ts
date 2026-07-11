"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { runRssImport, type RssImportResult } from "../../lib/rssImport";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

const ADMIN_COOKIE = "chainbrief_admin";

type ArticleStatus = "draft" | "pending" | "published" | "rejected";
type BannerPlacement =
  | "header"
  | "homepage_top"
  | "homepage_mid"
  | "article_inline"
  | "article_sidebar"
  | "sidebar"
  | "footer"
  | "leaderboard";

type ArticlePayload = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  author: string | null;
  source_name: string | null;
  source_url: string | null;
  featured_image: string | null;
  status: ArticleStatus;
  is_sponsored: boolean;
  sponsor_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  needs_review: boolean;
  published_at: string | null;
  updated_at: string;
};

type BannerPayload = {
  title: string;
  advertiser_name: string | null;
  image_url: string | null;
  target_url: string | null;
  placement: BannerPlacement;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  updated_at: string;
};

type ProjectPayload = {
  name: string;
  slug: string;
  symbol: string | null;
  category: string | null;
  short_description: string | null;
  full_description: string | null;
  chain: string | null;
  website_url: string | null;
  twitter_url: string | null;
  telegram_url: string | null;
  logo_url: string | null;
  rank: number | null;
  score: number | null;
  tags: string[];
  highlights: string[];
  risks: string[];
  is_sponsored: boolean;
  sponsor_label: string | null;
  status: "published";
  updated_at: string;
};

type SourcePayload = {
  name: string;
  slug: string;
  website_url: string | null;
  feed_url: string | null;
  category: string | null;
  is_active: boolean;
  updated_at: string;
};

const bannerPlacements: BannerPlacement[] = [
  "header",
  "homepage_top",
  "homepage_mid",
  "article_inline",
  "article_sidebar",
  "sidebar",
  "footer",
  "leaderboard",
];

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getNullableString(formData: FormData, key: string) {
  const value = getString(formData, key);

  return value.length > 0 ? value : null;
}

function getNullableNumber(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function getTextArray(formData: FormData, key: string) {
  return getString(formData, key)
    .split(/,|\n/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function getArticlePayload(formData: FormData): ArticlePayload {
  const status = getString(formData, "status") as ArticleStatus;
  const normalizedStatus: ArticleStatus = ["draft", "pending", "published", "rejected"].includes(
    status,
  )
    ? status
    : "draft";
  const isSponsored = formData.get("is_sponsored") === "on";

  return {
    title: getString(formData, "title"),
    slug: getString(formData, "slug"),
    excerpt: getNullableString(formData, "excerpt"),
    content: getNullableString(formData, "content"),
    category: getNullableString(formData, "category"),
    author: getNullableString(formData, "author"),
    source_name: getNullableString(formData, "source_name"),
    source_url: getNullableString(formData, "source_url"),
    featured_image: getNullableString(formData, "featured_image"),
    status: normalizedStatus,
    is_sponsored: isSponsored,
    sponsor_name: isSponsored ? getNullableString(formData, "sponsor_name") : null,
    seo_title: getNullableString(formData, "seo_title"),
    seo_description: getNullableString(formData, "seo_description"),
    needs_review: formData.get("needs_review") === "on",
    published_at:
      normalizedStatus === "published"
        ? getNullableString(formData, "published_at") || new Date().toISOString()
        : getNullableString(formData, "published_at"),
    updated_at: new Date().toISOString(),
  };
}

function getBannerPayload(formData: FormData): BannerPayload {
  const placement = getString(formData, "placement") as BannerPlacement;

  return {
    title: getString(formData, "title"),
    advertiser_name: getNullableString(formData, "advertiser_name"),
    image_url: getNullableString(formData, "image_url"),
    target_url: getNullableString(formData, "target_url"),
    placement: bannerPlacements.includes(placement) ? placement : "homepage_top",
    is_active: formData.get("is_active") === "on",
    start_date: getNullableString(formData, "start_date"),
    end_date: getNullableString(formData, "end_date"),
    updated_at: new Date().toISOString(),
  };
}

function getProjectPayload(formData: FormData): ProjectPayload {
  const isSponsored = formData.get("is_sponsored") === "on";

  return {
    name: getString(formData, "name"),
    slug: getString(formData, "slug"),
    symbol: getNullableString(formData, "symbol"),
    category: getNullableString(formData, "category"),
    short_description: getNullableString(formData, "short_description"),
    full_description: getNullableString(formData, "full_description"),
    chain: getNullableString(formData, "chain"),
    website_url: getNullableString(formData, "website_url"),
    twitter_url: getNullableString(formData, "twitter_url"),
    telegram_url: getNullableString(formData, "telegram_url"),
    logo_url: getNullableString(formData, "logo_url"),
    rank: getNullableNumber(formData, "rank"),
    score: getNullableNumber(formData, "score"),
    tags: getTextArray(formData, "tags"),
    highlights: getTextArray(formData, "highlights"),
    risks: getTextArray(formData, "risks"),
    is_sponsored: isSponsored,
    sponsor_label: isSponsored ? getNullableString(formData, "sponsor_label") : null,
    status: "published",
    updated_at: new Date().toISOString(),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function getSourcePayload(formData: FormData): SourcePayload {
  const name = getString(formData, "name");
  const slug = getString(formData, "slug") || slugify(name);

  return {
    name,
    slug,
    website_url: getNullableString(formData, "website_url"),
    feed_url: getNullableString(formData, "feed_url"),
    category: getNullableString(formData, "category"),
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  };
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  return cookieStore.get(ADMIN_COOKIE)?.value === "true";
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=session");
  }
}

export async function loginAdmin(formData: FormData) {
  const password = getString(formData, "password");
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword || password !== expectedPassword) {
    redirect("/admin?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function fetchArticles() {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("articles")
    .select(
      "id,title,slug,status,category,is_sponsored,is_imported,source_name,original_source_url,published_at,imported_at,ai_rewritten_at,ai_status,needs_review,created_at,updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function updateArticleStatus(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  const status = getString(formData, "status") as ArticleStatus;
  const returnTo = getString(formData, "return_to");
  const safeReturnTo = returnTo.startsWith("/admin/articles") ? returnTo : "/admin/articles";

  if (!id || !["draft", "pending", "published", "rejected"].includes(status)) {
    redirect(`${safeReturnTo}${safeReturnTo.includes("?") ? "&" : "?"}error=invalid-status`);
  }

  const payload: {
    status: ArticleStatus;
    updated_at: string;
    published_at?: string;
  } = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "published") {
    payload.published_at = new Date().toISOString();
  }

  const { error } = await supabaseAdmin.from("articles").update(payload).eq("id", id);

  if (error) {
    redirect(
      `${safeReturnTo}${safeReturnTo.includes("?") ? "&" : "?"}error=${encodeURIComponent(
        error.message,
      )}`,
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/news");
  redirect(`${safeReturnTo}${safeReturnTo.includes("?") ? "&" : "?"}statusUpdated=1`);
}

export async function fetchBannerAds() {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("banner_ads")
    .select(
      "id,title,advertiser_name,image_url,target_url,placement,is_active,start_date,end_date,created_at,updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function fetchCryptoProjects() {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("crypto_projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function fetchSources() {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("sources")
    .select("id,name,slug,website_url,feed_url,category,is_active,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function fetchActiveSources() {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("sources")
    .select("id,name,slug,website_url,feed_url,category,is_active")
    .eq("is_active", true)
    .not("feed_url", "is", null)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function fetchSourceById(id: string) {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("sources")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchCryptoProjectById(id: string) {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("crypto_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchBannerAdById(id: string) {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("banner_ads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchContactRequests() {
  await requireAdmin();

  const columns =
    "id,name,email,company_project,inquiry_type,messenger_contact,message,status,created_at,updated_at";
  const fallbackColumns =
    "id,name,email,company_project,inquiry_type,message,status,created_at,updated_at";
  let { data, error } = await supabaseAdmin
    .from("contact_requests")
    .select(columns)
    .order("created_at", { ascending: false });

  if (error && error.message.toLowerCase().includes("messenger_contact")) {
    const fallbackResult = await supabaseAdmin
      .from("contact_requests")
      .select(fallbackColumns)
      .order("created_at", { ascending: false });

    data =
      fallbackResult.data?.map((request) => ({
        ...request,
        messenger_contact: null,
      })) || null;
    error = fallbackResult.error;
  }

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function fetchProjectSubmissions() {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("project_submissions")
    .select(
      "id,project_name,website,category,chain,token_symbol,contact_email,telegram,twitter,short_description,campaign_interests,status,created_at,updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function fetchArticleById(id: string) {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createArticle(formData: FormData) {
  await requireAdmin();

  const payload = {
    ...getArticlePayload(formData),
    created_at: new Date().toISOString(),
  };

  if (!payload.title || !payload.slug) {
    redirect("/admin/articles/new?error=missing");
  }

  const { error } = await supabaseAdmin.from("articles").insert(payload);

  if (error) {
    redirect(`/admin/articles/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/articles");
  redirect("/admin/articles?created=1");
}

export async function createBannerAd(formData: FormData) {
  await requireAdmin();

  const payload = {
    ...getBannerPayload(formData),
    created_at: new Date().toISOString(),
  };

  if (!payload.title || !payload.placement) {
    redirect("/admin/banners/new?error=missing");
  }

  const { error } = await supabaseAdmin.from("banner_ads").insert(payload);

  if (error) {
    redirect(`/admin/banners/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/banners");
  revalidatePath("/");
  revalidatePath("/news");
  redirect("/admin/banners?created=1");
}

export async function createCryptoProject(formData: FormData) {
  await requireAdmin();

  const payload = {
    ...getProjectPayload(formData),
    created_at: new Date().toISOString(),
  };

  if (!payload.name || !payload.slug) {
    redirect("/admin/projects/new?error=missing");
  }

  const { error } = await supabaseAdmin.from("crypto_projects").insert(payload);

  if (error) {
    redirect(`/admin/projects/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/rankings");
  redirect("/admin/projects?created=1");
}

export async function createSource(formData: FormData) {
  await requireAdmin();

  const payload = {
    ...getSourcePayload(formData),
    created_at: new Date().toISOString(),
  };

  if (!payload.name || !payload.slug || !payload.feed_url) {
    redirect("/admin/sources/new?error=missing");
  }

  const { error } = await supabaseAdmin.from("sources").insert(payload);

  if (error) {
    redirect(`/admin/sources/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/sources");
  redirect("/admin/sources?created=1");
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();

  const payload = getArticlePayload(formData);

  if (!payload.title || !payload.slug) {
    redirect(`/admin/articles/${id}?error=missing`);
  }

  const { error } = await supabaseAdmin.from("articles").update(payload).eq("id", id);

  if (error) {
    redirect(`/admin/articles/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}`);
  redirect(`/admin/articles/${id}?saved=1`);
}

export async function updateBannerAd(id: string, formData: FormData) {
  await requireAdmin();

  const payload = getBannerPayload(formData);

  if (!payload.title || !payload.placement) {
    redirect(`/admin/banners/${id}?error=missing`);
  }

  const { error } = await supabaseAdmin.from("banner_ads").update(payload).eq("id", id);

  if (error) {
    redirect(`/admin/banners/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/banners");
  revalidatePath(`/admin/banners/${id}`);
  revalidatePath("/");
  revalidatePath("/news");
  redirect(`/admin/banners/${id}?saved=1`);
}

export async function updateCryptoProject(id: string, formData: FormData) {
  await requireAdmin();

  const payload = getProjectPayload(formData);

  if (!payload.name || !payload.slug) {
    redirect(`/admin/projects/${id}?error=missing`);
  }

  const { error } = await supabaseAdmin
    .from("crypto_projects")
    .update(payload)
    .eq("id", id);

  if (error) {
    redirect(`/admin/projects/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/projects");
  revalidatePath(`/projects/${payload.slug}`);
  revalidatePath("/rankings");
  redirect(`/admin/projects/${id}?saved=1`);
}

export async function updateSource(id: string, formData: FormData) {
  await requireAdmin();

  const payload = getSourcePayload(formData);

  if (!payload.name || !payload.slug || !payload.feed_url) {
    redirect(`/admin/sources/${id}?error=missing`);
  }

  const { error } = await supabaseAdmin.from("sources").update(payload).eq("id", id);

  if (error) {
    redirect(`/admin/sources/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/sources");
  revalidatePath(`/admin/sources/${id}`);
  redirect(`/admin/sources/${id}?saved=1`);
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  const returnTo = getString(formData, "return_to");
  const safeReturnTo = returnTo.startsWith("/admin/articles") ? returnTo : "/admin/articles";

  if (!id) {
    redirect(`${safeReturnTo}${safeReturnTo.includes("?") ? "&" : "?"}error=missing-id`);
  }

  const { error } = await supabaseAdmin.from("articles").delete().eq("id", id);

  if (error) {
    redirect(
      `${safeReturnTo}${safeReturnTo.includes("?") ? "&" : "?"}error=${encodeURIComponent(
        error.message,
      )}`,
    );
  }

  revalidatePath("/admin/articles");
  redirect(`${safeReturnTo}${safeReturnTo.includes("?") ? "&" : "?"}deleted=1`);
}

export async function deleteBannerAd(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/admin/banners?error=missing-id");
  }

  const { error } = await supabaseAdmin.from("banner_ads").delete().eq("id", id);

  if (error) {
    redirect(`/admin/banners?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/banners");
  revalidatePath("/");
  revalidatePath("/news");
  redirect("/admin/banners?deleted=1");
}

export async function deleteCryptoProject(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/admin/projects?error=missing-id");
  }

  const { error } = await supabaseAdmin.from("crypto_projects").delete().eq("id", id);

  if (error) {
    redirect(`/admin/projects?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/rankings");
  redirect("/admin/projects?deleted=1");
}

export async function importLatestNews(): Promise<RssImportResult> {
  await requireAdmin();

  const result = await runRssImport();

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/import");

  return result;
}
