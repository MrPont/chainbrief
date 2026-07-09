import type { Metadata } from "next";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import ArticleForm from "../../ArticleForm";
import { createArticle, isAdminAuthenticated } from "../../actions";

export const metadata: Metadata = {
  title: "New Article",
};

type NewArticlePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewArticlePage({ searchParams }: NewArticlePageProps) {
  const { error } = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Create</p>
        <h1>New Article</h1>
        <p>Create a Supabase-backed article. Public news pages are not connected yet.</p>
      </section>
      {error === "missing" ? (
        <p className="form-error">Title and slug are required.</p>
      ) : null}
      {error && error !== "missing" ? <p className="form-error">Error: {error}</p> : null}
      <ArticleForm action={createArticle} submitLabel="Create Article" />
    </>
  );
}
