"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

const ADMIN_COOKIE = "chainbrief_admin";

type ArticleStatus = "draft" | "pending" | "published" | "rejected";

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
  published_at: string | null;
  updated_at: string;
};

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
    published_at:
      normalizedStatus === "published"
        ? getNullableString(formData, "published_at") || new Date().toISOString()
        : getNullableString(formData, "published_at"),
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
      "id,title,slug,status,category,is_sponsored,is_imported,published_at,created_at,updated_at",
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

export async function deleteArticle(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/admin/articles?error=missing-id");
  }

  const { error } = await supabaseAdmin.from("articles").delete().eq("id", id);

  if (error) {
    redirect(`/admin/articles?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/articles");
  redirect("/admin/articles?deleted=1");
}
