import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "../AdminLogin";
import AdminNav from "../AdminNav";
import { deleteArticle, fetchArticles, isAdminAuthenticated } from "../actions";

export const metadata: Metadata = {
  title: "Admin Articles",
};

type ArticlesPageProps = {
  searchParams: Promise<{
    created?: string;
    deleted?: string;
    error?: string;
  }>;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const articles = await fetchArticles();

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Content</p>
        <h1>Articles</h1>
        <p>Review, create, edit, and delete articles stored in Supabase.</p>
        <Link className="button button-primary" href="/admin/articles/new">
          New Article
        </Link>
      </section>

      {params.created ? <p className="form-success">Article created.</p> : null}
      {params.deleted ? <p className="form-success">Article deleted.</p> : null}
      {params.error ? <p className="form-error">Error: {params.error}</p> : null}

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Category</th>
              <th>Source</th>
              <th>Sponsored</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>
                  <strong>{article.title}</strong>
                </td>
                <td>{article.slug}</td>
                <td>
                  <div className="admin-badge-row">
                    <span className={`admin-status-badge status-${article.status}`}>
                      {article.status}
                    </span>
                    {article.is_imported ? (
                      <span className="admin-status-badge status-imported">Imported</span>
                    ) : null}
                  </div>
                </td>
                <td>{article.category || "Uncategorized"}</td>
                <td>
                  {article.source_name || "ChainBrief"}
                  {article.original_source_url ? (
                    <a className="admin-muted-line" href={article.original_source_url}>
                      Original URL
                    </a>
                  ) : null}
                </td>
                <td>
                  {article.is_sponsored ? (
                    <span className="admin-status-badge status-sponsored">Sponsored</span>
                  ) : (
                    "No"
                  )}
                </td>
                <td>{formatDate(article.published_at)}</td>
                <td>
                  <div className="admin-table-actions">
                    <Link href={`/admin/articles/${article.id}`}>Edit</Link>
                    <form action={deleteArticle}>
                      <input name="id" type="hidden" value={article.id} />
                      <button type="submit">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 ? (
              <tr>
                <td colSpan={8}>No articles yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
