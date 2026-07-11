import { cache } from "react";
import { supabaseAdmin } from "./supabaseAdmin";
import {
  cryptoProjects,
  getProjectBySlug,
  type CryptoProject,
} from "./siteData";

type SupabaseProjectRow = {
  id: string;
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
  tags: string[] | null;
  highlights: string[] | null;
  risks: string[] | null;
  is_sponsored: boolean | null;
  sponsor_label: string | null;
  status: string | null;
};

export type PublicProject = {
  source: "supabase" | "static";
  id?: string;
  name: string;
  slug: string;
  symbol: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  rank: number;
  score: number;
  chain: string;
  websiteUrl: string;
  twitterUrl: string;
  telegramUrl?: string;
  logoUrl?: string;
  tags: string[];
  highlights: string[];
  risks: string[];
  isSponsored: boolean;
  sponsorLabel?: string;
  keyMetrics?: CryptoProject["keyMetrics"];
};

const projectColumns = `
  id,
  name,
  slug,
  symbol,
  category,
  short_description,
  full_description,
  chain,
  website_url,
  twitter_url,
  telegram_url,
  logo_url,
  rank,
  score,
  tags,
  highlights,
  risks,
  is_sponsored,
  sponsor_label,
  status
`;

function mapStaticProject(project: CryptoProject): PublicProject {
  return {
    source: "static",
    name: project.name,
    slug: project.slug,
    symbol: project.symbol,
    category: project.category,
    shortDescription: project.shortDescription,
    fullDescription: project.fullDescription,
    rank: project.rank,
    score: project.score,
    chain: project.chain,
    websiteUrl: project.websiteUrl,
    twitterUrl: project.twitterUrl,
    tags: project.tags,
    highlights: project.highlights,
    risks: project.risks,
    isSponsored: project.isSponsored,
    sponsorLabel: project.sponsorLabel,
    keyMetrics: project.keyMetrics,
  };
}

function mapSupabaseProject(project: SupabaseProjectRow): PublicProject {
  return {
    source: "supabase",
    id: project.id,
    name: project.name,
    slug: project.slug,
    symbol: project.symbol?.trim() || "N/A",
    category: project.category?.trim() || "Crypto Project",
    shortDescription:
      project.short_description?.trim() || "ChainBrief project profile.",
    fullDescription:
      project.full_description?.trim() ||
      project.short_description?.trim() ||
      "No full project overview has been added yet.",
    rank: project.rank ?? 999,
    score: project.score ?? 0,
    chain: project.chain?.trim() || "Multi-chain",
    websiteUrl: project.website_url?.trim() || "#",
    twitterUrl: project.twitter_url?.trim() || "#",
    telegramUrl: project.telegram_url?.trim() || undefined,
    logoUrl: project.logo_url?.trim() || undefined,
    tags: project.tags ?? [],
    highlights: project.highlights ?? [],
    risks: project.risks ?? [],
    isSponsored: Boolean(project.is_sponsored),
    sponsorLabel: project.sponsor_label?.trim() || undefined,
  };
}

function isPublicProjectStatus(statusValue?: string | null) {
  const status = statusValue?.trim().toLowerCase();

  return !status || ["published", "active"].includes(status);
}

export const fetchSupabaseProjects = cache(async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("crypto_projects")
      .select(projectColumns)
      .order("rank", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch Supabase crypto projects:", error);
      return [];
    }

    return ((data ?? []) as SupabaseProjectRow[])
      .filter((project) => isPublicProjectStatus(project.status))
      .map(mapSupabaseProject);
  } catch (error) {
    console.error("Failed to fetch Supabase crypto projects:", error);
    return [];
  }
});

export async function getPublicProjects() {
  const supabaseProjects = await fetchSupabaseProjects();

  if (supabaseProjects.length > 0) {
    return supabaseProjects;
  }

  return cryptoProjects.map(mapStaticProject);
}

export async function getRankedPublicProjects() {
  const projects = await getPublicProjects();

  return [...projects].sort((first, second) => first.rank - second.rank);
}

export const getPublicProjectBySlug = cache(async (slug: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("crypto_projects")
      .select(projectColumns)
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      const project = data as SupabaseProjectRow;

      if (isPublicProjectStatus(project.status)) {
        return mapSupabaseProject(project);
      }
    }
  } catch (error) {
    console.error(`Failed to fetch Supabase project "${slug}":`, error);
  }

  const staticProject = getProjectBySlug(slug);

  return staticProject ? mapStaticProject(staticProject) : null;
});
