import type { Metadata } from "next";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import ProjectForm from "../../ProjectForm";
import { createCryptoProject, isAdminAuthenticated } from "../../actions";

export const metadata: Metadata = {
  title: "New Project",
};

type NewProjectPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewProjectPage({ searchParams }: NewProjectPageProps) {
  const { error } = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Create</p>
        <h1>New Project</h1>
        <p>Create a Supabase-backed crypto project profile.</p>
      </section>
      {error === "missing" ? (
        <p className="form-error">Name and slug are required.</p>
      ) : null}
      {error && error !== "missing" ? <p className="form-error">Error: {error}</p> : null}
      <ProjectForm action={createCryptoProject} submitLabel="Create Project" />
    </>
  );
}
