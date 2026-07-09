import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import { fetchProjectSubmissions, isAdminAuthenticated } from "../../actions";

export const metadata: Metadata = {
  title: "Project Submissions",
};

function formatDate(value?: string | null) {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatInterests(value?: string[] | null) {
  if (!value || value.length === 0) {
    return "None selected";
  }

  return value.join(", ");
}

export default async function AdminProjectSubmissionsPage() {
  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const projectSubmissions = await fetchProjectSubmissions();

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Inbox</p>
        <h1>Project Submissions</h1>
        <p>Crypto project submissions from the public project form.</p>
        <Link className="button button-secondary" href="/admin/requests">
          Requests Overview
        </Link>
      </section>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Project name</th>
              <th>Website</th>
              <th>Category</th>
              <th>Chain</th>
              <th>Token symbol</th>
              <th>Contact email</th>
              <th>Campaign interests</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {projectSubmissions.map((submission) => (
              <tr key={submission.id}>
                <td>
                  <strong>{submission.project_name}</strong>
                </td>
                <td>
                  {submission.website ? (
                    <a href={submission.website}>{submission.website}</a>
                  ) : (
                    "Not provided"
                  )}
                </td>
                <td>{submission.category || "Uncategorized"}</td>
                <td>{submission.chain || "Not provided"}</td>
                <td>{submission.token_symbol || "Not provided"}</td>
                <td>{submission.contact_email}</td>
                <td>{formatInterests(submission.campaign_interests)}</td>
                <td>{formatDate(submission.created_at)}</td>
              </tr>
            ))}
            {projectSubmissions.length === 0 ? (
              <tr>
                <td colSpan={8}>No project submissions yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
