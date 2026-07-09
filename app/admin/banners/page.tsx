import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "../AdminLogin";
import AdminNav from "../AdminNav";
import { deleteBannerAd, fetchBannerAds, isAdminAuthenticated } from "../actions";

export const metadata: Metadata = {
  title: "Admin Banners",
};

type BannersPageProps = {
  searchParams: Promise<{
    created?: string;
    deleted?: string;
    error?: string;
  }>;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Open";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

function formatPlacement(placement?: string | null) {
  return (placement || "unknown")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function AdminBannersPage({ searchParams }: BannersPageProps) {
  const params = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const banners = await fetchBannerAds();

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Advertising</p>
        <h1>Banner Ads</h1>
        <p>Create, schedule, activate, and edit ChainBrief banner placements.</p>
        <Link className="button button-primary" href="/admin/banners/new">
          New Banner
        </Link>
      </section>

      {params.created ? <p className="form-success">Banner created.</p> : null}
      {params.deleted ? <p className="form-success">Banner deleted.</p> : null}
      {params.error ? <p className="form-error">Error: {params.error}</p> : null}

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Advertiser</th>
              <th>Placement</th>
              <th>Active</th>
              <th>Start</th>
              <th>End</th>
              <th>Target URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td>
                  <strong>{banner.title}</strong>
                </td>
                <td>{banner.advertiser_name || "Unassigned"}</td>
                <td>{formatPlacement(banner.placement)}</td>
                <td>{banner.is_active ? "Yes" : "No"}</td>
                <td>{formatDate(banner.start_date)}</td>
                <td>{formatDate(banner.end_date)}</td>
                <td>
                  {banner.target_url ? (
                    <a href={banner.target_url}>{banner.target_url}</a>
                  ) : (
                    "No target"
                  )}
                </td>
                <td>
                  <div className="admin-table-actions">
                    <Link href={`/admin/banners/${banner.id}`}>Edit</Link>
                    <form action={deleteBannerAd}>
                      <input name="id" type="hidden" value={banner.id} />
                      <button type="submit">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {banners.length === 0 ? (
              <tr>
                <td colSpan={8}>No banners yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
