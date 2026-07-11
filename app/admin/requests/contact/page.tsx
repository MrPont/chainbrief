import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import { fetchContactRequests, isAdminAuthenticated } from "../../actions";

export const metadata: Metadata = {
  title: "Contact Requests",
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

function preview(value?: string | null) {
  if (!value) {
    return "No message";
  }

  return value.length > 140 ? `${value.slice(0, 140)}...` : value;
}

function getWebsiteHref(value?: string | null) {
  if (!value) {
    return null;
  }

  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export default async function AdminContactRequestsPage() {
  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const contactRequests = await fetchContactRequests();

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Inbox</p>
        <h1>Contact Requests</h1>
        <p>Messages submitted from the public contact form.</p>
        <Link className="button button-secondary" href="/admin/requests">
          Requests Overview
        </Link>
      </section>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Project website</th>
              <th>Telegram / WhatsApp</th>
              <th>Company/project</th>
              <th>Inquiry type</th>
              <th>Message preview</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {contactRequests.map((request) => (
              <tr key={request.id}>
                <td>
                  <strong>{request.name || "Unknown sender"}</strong>
                </td>
                <td>{request.email}</td>
                <td>
                  {getWebsiteHref(request.project_website) ? (
                    <a href={getWebsiteHref(request.project_website) || ""}>
                      {request.project_website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </td>
                <td>{request.messenger_contact || "Not provided"}</td>
                <td>{request.company_project || "Not provided"}</td>
                <td>{request.inquiry_type || "General"}</td>
                <td>{preview(request.message)}</td>
                <td>{formatDate(request.created_at)}</td>
              </tr>
            ))}
            {contactRequests.length === 0 ? (
              <tr>
                <td colSpan={8}>No contact requests yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
