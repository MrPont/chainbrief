import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "../AdminLogin";
import AdminNav from "../AdminNav";
import { fetchSources, isAdminAuthenticated } from "../actions";

export const metadata: Metadata = {
  title: "Admin Sources",
};

type AdminSourcesPageProps = {
  searchParams: Promise<{
    created?: string;
    error?: string;
  }>;
};

export default async function AdminSourcesPage({ searchParams }: AdminSourcesPageProps) {
  const params = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const sources = await fetchSources();

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Import Sources</p>
        <h1>RSS Sources</h1>
        <p>Add and maintain RSS feeds used for the pending news import queue.</p>
        <Link className="button button-primary" href="/admin/sources/new">
          New Source
        </Link>
      </section>

      {params.created ? <p className="form-success">Source created.</p> : null}
      {params.error ? <p className="form-error">Error: {params.error}</p> : null}

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Feed URL</th>
              <th>Category</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.id}>
                <td>
                  <strong>{source.name}</strong>
                  <span className="admin-muted-line">{source.slug || "No slug"}</span>
                </td>
                <td>
                  {source.feed_url ? <a href={source.feed_url}>{source.feed_url}</a> : "No feed"}
                </td>
                <td>{source.category || "Uncategorized"}</td>
                <td>{source.is_active ? "Yes" : "No"}</td>
                <td>
                  <div className="admin-table-actions">
                    <Link href={`/admin/sources/${source.id}`}>Edit</Link>
                  </div>
                </td>
              </tr>
            ))}
            {sources.length === 0 ? (
              <tr>
                <td colSpan={5}>No RSS sources yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
