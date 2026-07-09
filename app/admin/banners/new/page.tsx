import type { Metadata } from "next";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import BannerForm from "../../BannerForm";
import { createBannerAd, isAdminAuthenticated } from "../../actions";

export const metadata: Metadata = {
  title: "New Banner",
};

type NewBannerPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewBannerPage({ searchParams }: NewBannerPageProps) {
  const { error } = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Create</p>
        <h1>New Banner</h1>
        <p>Create a Supabase-backed banner ad for public ChainBrief placements.</p>
      </section>
      {error === "missing" ? (
        <p className="form-error">Title and placement are required.</p>
      ) : null}
      {error && error !== "missing" ? <p className="form-error">Error: {error}</p> : null}
      <BannerForm action={createBannerAd} submitLabel="Create Banner" />
    </>
  );
}
