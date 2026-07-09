import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "../AdminLogin";
import AdminNav from "../AdminNav";
import {
  deleteCryptoProject,
  fetchCryptoProjects,
  isAdminAuthenticated,
} from "../actions";

export const metadata: Metadata = {
  title: "Admin Projects",
};

type AdminProjectsPageProps = {
  searchParams: Promise<{
    created?: string;
    deleted?: string;
    error?: string;
  }>;
};

export default async function AdminProjectsPage({
  searchParams,
}: AdminProjectsPageProps) {
  const params = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const projects = await fetchCryptoProjects();

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Directory</p>
        <h1>Crypto Projects</h1>
        <p>Review, create, edit, and delete Supabase-backed project profiles.</p>
        <Link className="button button-primary" href="/admin/projects/new">
          New Project
        </Link>
      </section>

      {params.created ? <p className="form-success">Project created.</p> : null}
      {params.deleted ? <p className="form-success">Project deleted.</p> : null}
      {params.error ? <p className="form-error">Error: {params.error}</p> : null}

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Symbol</th>
              <th>Category</th>
              <th>Chain</th>
              <th>Rank</th>
              <th>Score</th>
              <th>Sponsored</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <strong>{project.name}</strong>
                </td>
                <td>{project.slug}</td>
                <td>{project.symbol || "N/A"}</td>
                <td>{project.category || "Uncategorized"}</td>
                <td>{project.chain || "Not set"}</td>
                <td>{project.rank ?? "Unranked"}</td>
                <td>{project.score ?? "No score"}</td>
                <td>{project.is_sponsored ? "Yes" : "No"}</td>
                <td>
                  <div className="admin-table-actions">
                    <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                    <form action={deleteCryptoProject}>
                      <input name="id" type="hidden" value={project.id} />
                      <button type="submit">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 ? (
              <tr>
                <td colSpan={9}>No projects yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
