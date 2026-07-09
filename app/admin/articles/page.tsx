import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "../AdminLogin";
import AdminNav from "../AdminNav";
import {
  deleteArticle,
  fetchArticles,
  isAdminAuthenticated,
  updateArticleStatus,
} from "../actions";

export const metadata: Metadata = {
  title: "Admin Articles",
};

type ArticlesPageProps = {
  searchParams: Promise<{
    created?: string;
    deleted?: string;
    error?: string;
    filter?: string;
    page?: string;
    q?: string;
    sort?: string;
    statusUpdated?: string;
  }>;
};

const pageSize = 25;

const filters = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Imported", value: "imported" },
  { label: "Sponsored", value: "sponsored" },
  { label: "Rejected", value: "rejected" },
];

const sortOptions = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Status", value: "status" },
  { label: "Source name", value: "source" },
];

function formatDate(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function timestamp(value?: string | null) {
  if (!value) {
    return 0;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function getArticleTime(article: Awaited<ReturnType<typeof fetchArticles>>[number]) {
  return Math.max(
    timestamp(article.created_at),
    timestamp(article.imported_at),
    timestamp(article.published_at),
  );
}

function normalizeParam(value: string | undefined, fallback: string) {
  return value && value.trim() ? value.trim() : fallback;
}

function buildArticlesHref({
  filter,
  page,
  q,
  sort,
}: {
  filter: string;
  page?: number;
  q: string;
  sort: string;
}) {
  const params = new URLSearchParams();

  if (filter !== "all") {
    params.set("filter", filter);
  }

  if (q) {
    params.set("q", q);
  }

  if (sort !== "newest") {
    params.set("sort", sort);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/admin/articles?${query}` : "/admin/articles";
}

export default async function AdminArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const articles = await fetchArticles();
  const currentFilter = normalizeParam(params.filter, "all");
  const currentSort = normalizeParam(params.sort, "newest");
  const searchQuery = normalizeParam(params.q, "").toLowerCase();
  const currentPage = Math.max(1, Number(params.page) || 1);
  const pendingImportedArticles = articles.filter(
    (article) => article.status === "pending" && article.is_imported,
  );
  const filteredArticles = articles
    .filter((article) => {
      if (currentFilter === "pending-imported") {
        return article.status === "pending" && article.is_imported;
      }

      if (currentFilter === "imported") {
        return article.is_imported;
      }

      if (currentFilter === "sponsored") {
        return article.is_sponsored;
      }

      if (["published", "draft", "pending", "rejected"].includes(currentFilter)) {
        return article.status === currentFilter;
      }

      return true;
    })
    .filter((article) => {
      if (!searchQuery) {
        return true;
      }

      return [article.title, article.slug, article.source_name]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(searchQuery));
    })
    .sort((firstArticle, secondArticle) => {
      if (currentSort === "oldest") {
        return getArticleTime(firstArticle) - getArticleTime(secondArticle);
      }

      if (currentSort === "status") {
        return firstArticle.status.localeCompare(secondArticle.status);
      }

      if (currentSort === "source") {
        return (firstArticle.source_name || "ChainBrief").localeCompare(
          secondArticle.source_name || "ChainBrief",
        );
      }

      return getArticleTime(secondArticle) - getArticleTime(firstArticle);
    });
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleArticles = filteredArticles.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );
  const returnTo = buildArticlesHref({
    filter: currentFilter,
    page: safePage,
    q: searchQuery,
    sort: currentSort,
  });

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
      {params.statusUpdated ? <p className="form-success">Article status updated.</p> : null}
      {params.error ? <p className="form-error">Error: {params.error}</p> : null}

      <section className="admin-queue-card">
        <div>
          <p className="eyebrow">Review Queue</p>
          <h2>Pending Imported News</h2>
          <p>
            {pendingImportedArticles.length} imported article
            {pendingImportedArticles.length === 1 ? "" : "s"} waiting for review.
          </p>
        </div>
        <Link
          className="button button-primary"
          href={buildArticlesHref({
            filter: "pending-imported",
            q: "",
            sort: "newest",
          })}
        >
          View Queue
        </Link>
      </section>

      <section className="admin-filter-panel">
        <div className="admin-filter-chips" aria-label="Article filters">
          {filters.map((filter) => (
            <Link
              className={
                currentFilter === filter.value ? "admin-filter-chip active" : "admin-filter-chip"
              }
              href={buildArticlesHref({
                filter: filter.value,
                q: searchQuery,
                sort: currentSort,
              })}
              key={filter.value}
            >
              {filter.label}
            </Link>
          ))}
        </div>

        <form className="admin-search-form" method="get">
          <input name="filter" type="hidden" value={currentFilter} />
          <label>
            Search articles
            <input
              defaultValue={params.q || ""}
              name="q"
              placeholder="Title, slug, or source name"
              type="search"
            />
          </label>
          <label>
            Sort
            <select defaultValue={currentSort} name="sort">
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="button button-secondary" type="submit">
            Apply
          </button>
          <Link className="button button-secondary" href="/admin/articles">
            Reset
          </Link>
        </form>
      </section>

      <section className="admin-table-card">
        <div className="admin-table-header">
          <div>
            <p className="eyebrow">Results</p>
            <h2>{filteredArticles.length} Articles</h2>
          </div>
          <span className="admin-muted-line">
            Showing {visibleArticles.length} of {filteredArticles.length}, 25 per page
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Category</th>
              <th>Source</th>
              <th>Dates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleArticles.map((article) => (
              <tr key={article.id}>
                <td>
                  <strong>{article.title}</strong>
                  <span className="admin-muted-line">{article.slug}</span>
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
                    {article.is_sponsored ? (
                      <span className="admin-status-badge status-sponsored">Sponsored</span>
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
                  <span className="admin-muted-line">
                    Published: {formatDate(article.published_at)}
                  </span>
                  {article.imported_at ? (
                    <span className="admin-muted-line">
                      Imported: {formatDate(article.imported_at)}
                    </span>
                  ) : null}
                </td>
                <td>
                  <div className="admin-table-actions article-actions">
                    <Link href={`/admin/articles/${article.id}`}>Edit</Link>
                    {(["draft", "published", "rejected"] as const).map((status) => (
                      <form action={updateArticleStatus} key={status}>
                        <input name="id" type="hidden" value={article.id} />
                        <input name="status" type="hidden" value={status} />
                        <input name="return_to" type="hidden" value={returnTo} />
                        <button
                          className="admin-status-action"
                          disabled={article.status === status}
                          type="submit"
                        >
                          Mark {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      </form>
                    ))}
                    <form action={deleteArticle}>
                      <input name="id" type="hidden" value={article.id} />
                      <input name="return_to" type="hidden" value={returnTo} />
                      <button type="submit">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {visibleArticles.length === 0 ? (
              <tr>
                <td colSpan={8}>No articles yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      {totalPages > 1 ? (
        <nav className="admin-pagination" aria-label="Article pagination">
          {safePage > 1 ? (
            <Link
              className="button button-secondary"
              href={buildArticlesHref({
                filter: currentFilter,
                page: safePage - 1,
                q: searchQuery,
                sort: currentSort,
              })}
            >
              Previous
            </Link>
          ) : (
            <span className="button button-secondary disabled">Previous</span>
          )}
          <span>
            Page {safePage} of {totalPages}
          </span>
          {safePage < totalPages ? (
            <Link
              className="button button-secondary"
              href={buildArticlesHref({
                filter: currentFilter,
                page: safePage + 1,
                q: searchQuery,
                sort: currentSort,
              })}
            >
              Next
            </Link>
          ) : (
            <span className="button button-secondary disabled">Next</span>
          )}
        </nav>
      ) : null}
    </>
  );
}
