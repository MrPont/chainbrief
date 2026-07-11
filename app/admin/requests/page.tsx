import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "../AdminLogin";
import AdminNav from "../AdminNav";
import {
  fetchContactRequests,
  fetchProjectSubmissions,
  isAdminAuthenticated,
} from "../actions";

export const metadata: Metadata = {
  title: "Admin Requests",
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

function preview(value?: string | null, limit = 120) {
  if (!value) {
    return "No message";
  }

  return value.length > limit ? `${value.slice(0, limit)}...` : value;
}

export default async function AdminRequestsPage() {
  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const [contactRequests, projectSubmissions] = await Promise.all([
    fetchContactRequests(),
    fetchProjectSubmissions(),
  ]);
  const stats = [
    { label: "Total contact requests", value: contactRequests.length },
    { label: "Total project submissions", value: projectSubmissions.length },
    { label: "Recent contact requests", value: contactRequests.slice(0, 5).length },
    { label: "Recent project submissions", value: projectSubmissions.slice(0, 5).length },
  ];

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Inbox</p>
        <h1>Requests</h1>
        <p>Review contact messages and project submissions from public forms.</p>
      </section>

      <section className="admin-stat-grid">
        {stats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="request-overview-grid">
        <article className="text-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recent</p>
              <h2>Contact Requests</h2>
            </div>
            <Link href="/admin/requests/contact">View all</Link>
          </div>
          <div className="request-list">
            {contactRequests.slice(0, 5).map((request) => (
              <div key={request.id}>
                <strong>{request.name || "Unknown sender"}</strong>
                <span>{request.email}</span>
                {request.messenger_contact ? (
                  <span>Telegram / WhatsApp: {request.messenger_contact}</span>
                ) : null}
                <p>{preview(request.message)}</p>
                <small>{formatDate(request.created_at)}</small>
              </div>
            ))}
            {contactRequests.length === 0 ? <p>No contact requests yet.</p> : null}
          </div>
        </article>

        <article className="text-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recent</p>
              <h2>Project Submissions</h2>
            </div>
            <Link href="/admin/requests/projects">View all</Link>
          </div>
          <div className="request-list">
            {projectSubmissions.slice(0, 5).map((submission) => (
              <div key={submission.id}>
                <strong>{submission.project_name}</strong>
                <span>{submission.contact_email}</span>
                <p>{preview(submission.short_description)}</p>
                <small>{formatDate(submission.created_at)}</small>
              </div>
            ))}
            {projectSubmissions.length === 0 ? <p>No project submissions yet.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}
