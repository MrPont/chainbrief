import type { Metadata } from "next";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import BannerForm from "../../BannerForm";
import { fetchBannerAdById, isAdminAuthenticated, updateBannerAd } from "../../actions";

export const metadata: Metadata = {
  title: "Edit Banner",
};

type EditBannerPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export default async function EditBannerPage({
  params,
  searchParams,
}: EditBannerPageProps) {
  const { id } = await params;
  const query = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const banner = await fetchBannerAdById(id);
  const updateAction = updateBannerAd.bind(null, id);

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Edit</p>
        <h1>{banner.title}</h1>
        <p>Update the banner record in Supabase.</p>
      </section>
      {query.saved ? <p className="form-success">Banner saved.</p> : null}
      {query.error === "missing" ? (
        <p className="form-error">Title and placement are required.</p>
      ) : null}
      {query.error && query.error !== "missing" ? (
        <p className="form-error">Error: {query.error}</p>
      ) : null}
      <BannerForm action={updateAction} banner={banner} submitLabel="Save Banner" />
    </>
  );
}
