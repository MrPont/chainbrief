import type { Metadata } from "next";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import SourceForm from "../../SourceForm";
import { createSource, isAdminAuthenticated } from "../../actions";

export const metadata: Metadata = {
  title: "New RSS Source",
};

type NewSourcePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewSourcePage({ searchParams }: NewSourcePageProps) {
  const { error } = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Create</p>
        <h1>New RSS Source</h1>
        <p>Add a feed that can be imported into the pending article review queue.</p>
      </section>
      {error === "missing" ? (
        <p className="form-error">Name, slug, and feed URL are required.</p>
      ) : null}
      {error && error !== "missing" ? <p className="form-error">Error: {error}</p> : null}
      <SourceForm action={createSource} submitLabel="Create Source" />
    </>
  );
}
