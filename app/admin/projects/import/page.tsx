import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import {
  fetchImportedProjectDrafts,
  getProjectImportSources,
  importFreshProjects,
  isAdminAuthenticated,
} from "../../actions";

export const metadata: Metadata = {
  title: "Import Fresh Projects",
};

type ImportProjectsPageProps = {
  searchParams: Promise<{
    imported?: string;
    skipped?: string;
    source?: string;
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

function formatDate(value?: string | null) {
  if (!value) {
    return "Not imported";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

async function runImport(formData: FormData) {
  "use server";

  const result = await importFreshProjects(formData);
  const errors = encodeURIComponent(result.errors.join("|"));

  redirect(
    `/admin/projects/import?source=${encodeURIComponent(
      result.sourceName,
    )}&imported=${result.imported}&skipped=${result.skipped}&errors=${errors}`,
  );
}

export default async function ImportProjectsPage({
  searchParams,
}: ImportProjectsPageProps) {
  const params = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const [sources, importedDrafts] = await Promise.all([
    getProjectImportSources(),
    fetchImportedProjectDrafts(),
  ]);
  const errors = decodeErrors(params.errors);

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Project Review Queue</p>
        <h1>Import Fresh Projects</h1>
        <p>
          Import factual crypto and Web3 project metadata as draft profiles.
          Imported projects are never published automatically and must be
          reviewed before they appear publicly.
        </p>
        <Link className="button button-secondary" href="/admin/projects">
          Back to Projects
        </Link>
      </section>

      <section className="admin-review-warning">
        <p className="eyebrow">Safety Rules</p>
        <h2>Draft-only import</h2>
        <p>
          The importer only stores factual metadata, attribution, and a short
          internal review note. It does not copy long third-party descriptions,
          third-party rankings, scores, or external logos.
        </p>
      </section>

      {params.imported || params.skipped ? (
        <section className="text-panel">
          <p className="eyebrow">Result</p>
          <h2>Import Summary</h2>
          <p>
            Source: {params.source || "Unknown source"}. Imported{" "}
            {params.imported || "0"} draft projects and skipped{" "}
            {params.skipped || "0"} duplicate or incomplete projects.
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
            <h2>Available Project Sources</h2>
          </div>
          <form action={runImport} className="admin-inline-form">
            <label>
              Source
              <select name="source" defaultValue={sources[0]?.id || ""}>
                {sources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="button button-primary"
              disabled={sources.length === 0}
              type="submit"
            >
              Import Projects
            </button>
          </form>
        </div>
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.id}>
                <td>
                  <strong>{source.name}</strong>
                </td>
                <td>{source.description}</td>
              </tr>
            ))}
            {sources.length === 0 ? (
              <tr>
                <td colSpan={2}>No project import sources are configured.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="admin-table-card">
        <div className="admin-table-header">
          <div>
            <p className="eyebrow">Drafts</p>
            <h2>Recent Imported Projects</h2>
          </div>
          <Link className="button button-secondary" href="/admin/projects">
            Review All Projects
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Status</th>
              <th>Review</th>
              <th>Source</th>
              <th>Imported</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {importedDrafts.map((project) => (
              <tr key={project.id}>
                <td>
                  <strong>{project.name}</strong>
                  <span className="admin-muted-line">{project.slug}</span>
                </td>
                <td>{project.symbol || "N/A"}</td>
                <td>
                  <span className={`admin-status-badge status-${project.status || "draft"}`}>
                    {project.status || "draft"}
                  </span>
                </td>
                <td>{project.review_status || "needs_review"}</td>
                <td>
                  {project.source_name || "External source"}
                  {project.source_url ? (
                    <a className="admin-muted-line" href={project.source_url}>
                      Source URL
                    </a>
                  ) : null}
                </td>
                <td>{formatDate(project.imported_at)}</td>
                <td>
                  <Link href={`/admin/projects/${project.id}`}>Review</Link>
                </td>
              </tr>
            ))}
            {importedDrafts.length === 0 ? (
              <tr>
                <td colSpan={7}>No imported project drafts yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
