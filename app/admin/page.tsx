import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "./AdminLogin";
import AdminNav from "./AdminNav";
import { fetchArticles, isAdminAuthenticated } from "./actions";

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

  const articles = await fetchArticles();
  const total = articles.length;
  const published = articles.filter((article) => article.status === "published").length;
  const drafts = articles.filter((article) => article.status === "draft").length;
  const sponsored = articles.filter((article) => article.is_sponsored).length;
  const pendingImported = articles.filter(
    (article) => article.status === "pending" && article.is_imported,
  ).length;
  const stats = [
    { label: "Total articles", value: total },
    { label: "Published articles", value: published },
    { label: "Draft articles", value: drafts },
    { label: "Sponsored articles", value: sponsored },
    { label: "Pending imported news", value: pendingImported },
  ];

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Dashboard</p>
        <h1>Article Operations</h1>
        <p>Manage ChainBrief articles through Supabase using server-side admin access.</p>
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
        <h2>Create or review articles</h2>
        <p>Public news pages still use static MVP data. This admin panel prepares the CMS layer.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/admin/articles/new">
            New Article
          </Link>
          <Link className="button button-secondary" href="/admin/articles">
            View Articles
          </Link>
        </div>
      </section>
    </>
  );
}
