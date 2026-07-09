import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "./AdminLogin";
import AdminNav from "./AdminNav";
import {
  fetchArticles,
  fetchActiveSources,
  fetchBannerAds,
  fetchContactRequests,
  fetchCryptoProjects,
  fetchProjectSubmissions,
  isAdminAuthenticated,
} from "./actions";

export const metadata: Metadata = {
  title: "Admin",
};

type AdminPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { error } = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error={error} />;
  }

  const [
    articles,
    banners,
    projects,
    activeSources,
    contactRequests,
    projectSubmissions,
  ] =
    await Promise.all([
      fetchArticles(),
      fetchBannerAds(),
      fetchCryptoProjects(),
      fetchActiveSources(),
      fetchContactRequests(),
      fetchProjectSubmissions(),
    ]);
  const total = articles.length;
  const published = articles.filter((article) => article.status === "published").length;
  const drafts = articles.filter((article) => article.status === "draft").length;
  const sponsored = articles.filter((article) => article.is_sponsored).length;
  const pendingImported = articles.filter(
    (article) => article.status === "pending" && article.is_imported,
  ).length;
  const aiAssisted = articles.filter((article) => article.ai_rewritten_at).length;
  const activeBanners = banners.filter((banner) => banner.is_active).length;
  const sponsoredProjects = projects.filter((project) => project.is_sponsored).length;
  const stats = [
    { label: "Total articles", value: total },
    { label: "Published articles", value: published },
    { label: "Draft articles", value: drafts },
    { label: "Sponsored articles", value: sponsored },
    { label: "Pending imported news", value: pendingImported },
    { label: "AI-assisted articles", value: aiAssisted },
    { label: "Active banners", value: activeBanners },
    { label: "Total banners", value: banners.length },
    { label: "Total projects", value: projects.length },
    { label: "Sponsored projects", value: sponsoredProjects },
    { label: "Active sources", value: activeSources.length },
    { label: "Total contact requests", value: contactRequests.length },
    { label: "Total project submissions", value: projectSubmissions.length },
  ];

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Dashboard</p>
        <h1>Article Operations</h1>
        <p>
          Manage ChainBrief articles and banner inventory through Supabase using
          server-side admin access.
        </p>
      </section>
      <section className="admin-stat-grid">
        {stats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>
      <section className="cta-panel compact-cta-panel">
        <p className="eyebrow">Next action</p>
        <h2>Create or review content and placements</h2>
        <p>
          Public news pages now read published Supabase articles, and banner
          placements can be scheduled from the admin panel.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/admin/articles/new">
            New Article
          </Link>
          <Link className="button button-secondary" href="/admin/articles">
            View Articles
          </Link>
          <Link className="button button-secondary" href="/admin/banners">
            View Banners
          </Link>
          <Link className="button button-secondary" href="/admin/projects">
            View Projects
          </Link>
          <Link className="button button-secondary" href="/admin/requests">
            View Requests
          </Link>
          <Link className="button button-secondary" href="/admin/import">
            Import News
          </Link>
        </div>
      </section>
    </>
  );
}
