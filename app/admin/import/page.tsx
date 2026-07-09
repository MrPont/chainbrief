import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminLogin from "../AdminLogin";
import AdminNav from "../AdminNav";
import { fetchActiveSources, importLatestNews, isAdminAuthenticated } from "../actions";

export const metadata: Metadata = {
  title: "Import News",
};

type ImportNewsPageProps = {
  searchParams: Promise<{
    imported?: string;
    skipped?: string;
    errors?: string;
  }>;
};

function decodeErrors(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function runImport() {
  "use server";

  const result = await importLatestNews();
  const errors = encodeURIComponent(result.errors.join("|"));

  redirect(
    `/admin/import?imported=${result.imported}&skipped=${result.skipped}&errors=${errors}`,
  );
}

export default async function ImportNewsPage({ searchParams }: ImportNewsPageProps) {
  const params = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const sources = await fetchActiveSources();
  const errors = decodeErrors(params.errors);

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Review Queue</p>
        <h1>Import Latest News</h1>
        <p>
          Pull recent RSS items from active sources into pending articles. Imported
          stories are never published automatically.
        </p>
      </section>

      <section className="text-panel">
        <p className="eyebrow">Automation Ready</p>
        <h2>Cron Endpoint</h2>
        <p>
          <code>/api/cron/import-news</code>
        </p>
        <p>
          Automatic import is configured to run every 6 hours on Vercel.
          Imported articles remain pending until reviewed and published.
        </p>
      </section>

      <section className="admin-stat-grid">
        <article className="admin-stat-card">
          <span>Active sources</span>
          <strong>{sources.length}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Last imported</span>
          <strong>{params.imported || "0"}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Last skipped</span>
          <strong>{params.skipped || "0"}</strong>
        </article>
      </section>

      {params.imported || params.skipped ? (
        <section className="text-panel">
          <p className="eyebrow">Result</p>
          <h2>Import Summary</h2>
          <p>
            Imported {params.imported || "0"} pending articles and skipped{" "}
            {params.skipped || "0"} duplicate or incomplete items.
          </p>
          {errors.length > 0 ? (
            <div className="form-error">
              <strong>Errors</strong>
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="admin-table-card">
        <div className="admin-table-header">
          <div>
            <p className="eyebrow">Sources</p>
            <h2>Active RSS Feeds</h2>
          </div>
          <form action={runImport}>
            <button className="button button-primary" disabled={sources.length === 0} type="submit">
              Manual Import
            </button>
          </form>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Feed URL</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.id}>
                <td>
                  <strong>{source.name}</strong>
                </td>
                <td>{source.feed_url ? <a href={source.feed_url}>{source.feed_url}</a> : "No feed"}</td>
                <td>{source.category || "Uncategorized"}</td>
              </tr>
            ))}
            {sources.length === 0 ? (
              <tr>
                <td colSpan={3}>No active RSS sources yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
