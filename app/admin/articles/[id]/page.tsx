import type { Metadata } from "next";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import ArticleForm from "../../ArticleForm";
import { fetchArticleById, isAdminAuthenticated, updateArticle } from "../../actions";

export const metadata: Metadata = {
  title: "Edit Article",
};

type EditArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export default async function EditArticlePage({
  params,
  searchParams,
}: EditArticlePageProps) {
  const { id } = await params;
  const query = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const article = await fetchArticleById(id);
  const updateAction = updateArticle.bind(null, id);

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Edit</p>
        <h1>{article.title}</h1>
        <p>Update the article record in Supabase.</p>
      </section>
      {query.saved ? <p className="form-success">Article saved.</p> : null}
      {query.error === "missing" ? (
        <p className="form-error">Title and slug are required.</p>
      ) : null}
      {query.error && query.error !== "missing" ? (
        <p className="form-error">Error: {query.error}</p>
      ) : null}
      <ArticleForm action={updateAction} article={article} submitLabel="Save Article" />
    </>
  );
}
