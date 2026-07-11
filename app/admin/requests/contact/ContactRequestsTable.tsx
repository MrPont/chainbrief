"use client";

import { useMemo, useState, useTransition } from "react";

type ContactRequest = {
  id: string;
  name: string | null;
  email: string | null;
  company_project: string | null;
  project_website: string | null;
  messenger_contact: string | null;
  inquiry_type: string | null;
  message: string | null;
  created_at: string | null;
  isLikelySpam: boolean;
};

type ContactRequestsTableProps = {
  requests: ContactRequest[];
  returnTo: string;
  deleteAction: (formData: FormData) => void | Promise<void>;
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

export default function ContactRequestsTable({
  requests,
  returnTo,
  deleteAction,
}: ContactRequestsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const visibleIds = useMemo(() => requests.map((request) => request.id), [requests]);
  const allSelected = visibleIds.length > 0 && selectedIds.length === visibleIds.length;

  function toggleAll() {
    setSelectedIds(allSelected ? [] : visibleIds);
  }

  function toggleSelected(id: string) {
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  }

  function submitDelete(ids: string[], confirmationMessage: string) {
    if (ids.length === 0) {
      return;
    }

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    const formData = new FormData();
    ids.forEach((id) => formData.append("ids", id));
    formData.set("return_to", returnTo);

    startTransition(() => {
      void deleteAction(formData);
    });
  }

  return (
    <section className="admin-table-card">
      <div className="admin-table-header">
        <div>
          <p className="eyebrow">Results</p>
          <h2>{requests.length} Contact Requests</h2>
        </div>
        <button
          className="button button-secondary"
          disabled={selectedIds.length === 0 || isPending}
          onClick={() =>
            submitDelete(
              selectedIds,
              "Delete selected contact requests? This cannot be undone.",
            )
          }
          type="button"
        >
          {isPending ? "Deleting..." : `Delete selected (${selectedIds.length})`}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <input
                aria-label="Select all contact requests"
                checked={allSelected}
                onChange={toggleAll}
                type="checkbox"
              />
            </th>
            <th>Submitted</th>
            <th>Name</th>
            <th>Email</th>
            <th>Company/project</th>
            <th>Project website</th>
            <th>Telegram / WhatsApp</th>
            <th>Inquiry type</th>
            <th>Message preview</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const websiteHref = getWebsiteHref(request.project_website);

            return (
              <tr key={request.id}>
                <td>
                  <input
                    aria-label={`Select ${request.name || request.email || "request"}`}
                    checked={selectedIds.includes(request.id)}
                    onChange={() => toggleSelected(request.id)}
                    type="checkbox"
                  />
                </td>
                <td>{formatDate(request.created_at)}</td>
                <td>
                  <strong>{request.name || "Unknown sender"}</strong>
                  {request.isLikelySpam ? (
                    <span className="admin-status-badge status-rejected">Likely spam</span>
                  ) : null}
                </td>
                <td>{request.email || "Not provided"}</td>
                <td>{request.company_project || "Not provided"}</td>
                <td>
                  {websiteHref ? (
                    <a href={websiteHref}>{request.project_website}</a>
                  ) : (
                    "Not provided"
                  )}
                </td>
                <td>{request.messenger_contact || "Not provided"}</td>
                <td>{request.inquiry_type || "General"}</td>
                <td>
                  <details>
                    <summary>{preview(request.message)}</summary>
                    <p>{request.message || "No message"}</p>
                  </details>
                </td>
                <td>
                  <button
                    className="admin-status-action"
                    disabled={isPending}
                    onClick={() =>
                      submitDelete(
                        [request.id],
                        "Delete this contact request? This cannot be undone.",
                      )
                    }
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
          {requests.length === 0 ? (
            <tr>
              <td colSpan={10}>No contact requests match these filters.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}
