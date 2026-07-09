import type { Metadata } from "next";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import SourceForm from "../../SourceForm";
import { fetchSourceById, isAdminAuthenticated, updateSource } from "../../actions";

export const metadata: Metadata = {
  title: "Edit RSS Source",
};

type EditSourcePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export default async function EditSourcePage({
  params,
  searchParams,
}: EditSourcePageProps) {
  const { id } = await params;
  const query = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const source = await fetchSourceById(id);
  const updateAction = updateSource.bind(null, id);

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Edit</p>
        <h1>{source.name}</h1>
        <p>Update the RSS source used by the import queue.</p>
      </section>
      {query.saved ? <p className="form-success">Source saved.</p> : null}
      {query.error === "missing" ? (
        <p className="form-error">Name, slug, and feed URL are required.</p>
      ) : null}
      {query.error && query.error !== "missing" ? (
        <p className="form-error">Error: {query.error}</p>
      ) : null}
      <SourceForm action={updateAction} source={source} submitLabel="Save Source" />
    </>
  );
}
