import type { Metadata } from "next";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import ProjectForm from "../../ProjectForm";
import {
  fetchCryptoProjectById,
  isAdminAuthenticated,
  updateCryptoProject,
} from "../../actions";

export const metadata: Metadata = {
  title: "Edit Project",
};

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export default async function EditProjectPage({
  params,
  searchParams,
}: EditProjectPageProps) {
  const { id } = await params;
  const query = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const project = await fetchCryptoProjectById(id);
  const updateAction = updateCryptoProject.bind(null, id);

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Edit</p>
        <h1>{project.name}</h1>
        <p>Update the project profile in Supabase.</p>
      </section>
      {query.saved ? <p className="form-success">Project saved.</p> : null}
      {query.error === "missing" ? (
        <p className="form-error">Name and slug are required.</p>
      ) : null}
      {query.error && query.error !== "missing" ? (
        <p className="form-error">Error: {query.error}</p>
      ) : null}
      <ProjectForm action={updateAction} project={project} submitLabel="Save Project" />
    </>
  );
}
