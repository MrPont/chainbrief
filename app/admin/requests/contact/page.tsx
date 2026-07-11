import type { Metadata } from "next";
import Link from "next/link";
import AdminLogin from "../../AdminLogin";
import AdminNav from "../../AdminNav";
import {
  deleteContactRequests,
  fetchContactRequests,
  isAdminAuthenticated,
} from "../../actions";
import ContactRequestsTable from "./ContactRequestsTable";

export const metadata: Metadata = {
  title: "Contact Requests",
};

type ContactRequestsPageProps = {
  searchParams: Promise<{
    deleted?: string;
    error?: string;
    inquiry?: string;
    quality?: string;
    q?: string;
    sort?: string;
  }>;
};

const inquiryFilters = [
  { label: "All", value: "all" },
  { label: "Editorial", value: "Editorial" },
  { label: "Advertising", value: "Advertising" },
  { label: "Media kit", value: "Media kit" },
  { label: "Pricing request", value: "Pricing request" },
  { label: "Sponsored article", value: "Sponsored article" },
  { label: "Banner advertising", value: "Banner advertising" },
  { label: "Featured project", value: "Featured project" },
  { label: "Campaign plan", value: "Campaign plan" },
  { label: "Project submission", value: "Project submission" },
  { label: "Partnership", value: "Partnership" },
  { label: "General", value: "General" },
  { label: "Other", value: "Other" },
];

const qualityFilters = [
  { label: "All requests", value: "all" },
  { label: "Likely spam", value: "spam" },
  { label: "Missing project website", value: "missing-website" },
  { label: "Has project website", value: "has-website" },
];

const sortOptions = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
];

function normalizeParam(value: string | undefined, fallback: string) {
  return value && value.trim() ? value.trim() : fallback;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isOnlyNumbers(value?: string | null) {
  return Boolean(value && /^\d+$/.test(value.replace(/\s+/g, "")));
}

function isVeryShortMessage(value?: string | null) {
  return !value || value.trim().length < 30 || value.trim().split(/\s+/).length <= 2;
}

function isGenericMessengerContact(value?: string | null) {
  if (!value) {
    return false;
  }

  return ["people", "person", "test", "testing", "none", "no", "n/a", "na"].includes(
    value.toLowerCase(),
  );
}

function isLikelySpam(request: Awaited<ReturnType<typeof fetchContactRequests>>[number]) {
  const hasMissingWebsite = !request.project_website;
  const hasWeakMessage = isVeryShortMessage(request.message);

  return (
    isOnlyNumbers(request.message) ||
    !request.company_project ||
    isGenericMessengerContact(request.messenger_contact) ||
    Boolean(request.company_project && isValidEmail(request.company_project)) ||
    (hasMissingWebsite && hasWeakMessage)
  );
}

function timestamp(value?: string | null) {
  if (!value) {
    return 0;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function buildContactRequestsHref({
  inquiry,
  quality,
  q,
  sort,
}: {
  inquiry: string;
  quality: string;
  q: string;
  sort: string;
}) {
  const params = new URLSearchParams();

  if (q) {
    params.set("q", q);
  }

  if (inquiry !== "all") {
    params.set("inquiry", inquiry);
  }

  if (quality !== "all") {
    params.set("quality", quality);
  }

  if (sort !== "newest") {
    params.set("sort", sort);
  }

  const query = params.toString();

  return query ? `/admin/requests/contact?${query}` : "/admin/requests/contact";
}

export default async function AdminContactRequestsPage({
  searchParams,
}: ContactRequestsPageProps) {
  const params = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error="session" />;
  }

  const requests = await fetchContactRequests();
  const searchQuery = normalizeParam(params.q, "").toLowerCase();
  const currentInquiry = normalizeParam(params.inquiry, "all");
  const currentQuality = normalizeParam(params.quality, "all");
  const currentSort = normalizeParam(params.sort, "newest");
  const enrichedRequests = requests.map((request) => ({
    ...request,
    isLikelySpam: isLikelySpam(request),
  }));
  const filteredRequests = enrichedRequests
    .filter((request) => {
      if (currentInquiry === "all") {
        return true;
      }

      if (currentInquiry === "General") {
        return !request.inquiry_type || request.inquiry_type === "General";
      }

      if (currentInquiry === "Other") {
        return Boolean(
          request.inquiry_type &&
            !inquiryFilters.some((filter) => filter.value === request.inquiry_type),
        );
      }

      return request.inquiry_type === currentInquiry;
    })
    .filter((request) => {
      if (currentQuality === "spam") {
        return request.isLikelySpam;
      }

      if (currentQuality === "missing-website") {
        return !request.project_website;
      }

      if (currentQuality === "has-website") {
        return Boolean(request.project_website);
      }

      return true;
    })
    .filter((request) => {
      if (!searchQuery) {
        return true;
      }

      return [
        request.name,
        request.email,
        request.company_project,
        request.project_website,
        request.messenger_contact,
        request.inquiry_type,
        request.message,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(searchQuery));
    })
    .sort((firstRequest, secondRequest) => {
      if (currentSort === "oldest") {
        return timestamp(firstRequest.created_at) - timestamp(secondRequest.created_at);
      }

      return timestamp(secondRequest.created_at) - timestamp(firstRequest.created_at);
    });
  const returnTo = buildContactRequestsHref({
    inquiry: currentInquiry,
    quality: currentQuality,
    q: searchQuery,
    sort: currentSort,
  });
  const likelySpamCount = enrichedRequests.filter((request) => request.isLikelySpam).length;
  const missingWebsiteCount = enrichedRequests.filter(
    (request) => !request.project_website,
  ).length;

  return (
    <>
      <AdminNav />
      <section className="admin-page-heading">
        <p className="eyebrow">Inbox</p>
        <h1>Contact Requests</h1>
        <p>Search, filter, review, and delete messages submitted from the public contact form.</p>
        <Link className="button button-secondary" href="/admin/requests">
          Requests Overview
        </Link>
      </section>

      {params.deleted ? (
        <p className="form-success">
          Deleted {params.deleted} contact request{params.deleted === "1" ? "" : "s"}.
        </p>
      ) : null}
      {params.error === "missing-id" ? (
        <p className="form-error">Select at least one request to delete.</p>
      ) : null}
      {params.error && params.error !== "missing-id" ? (
        <p className="form-error">Error: {params.error}</p>
      ) : null}

      <section className="admin-stat-grid">
        <article className="admin-stat-card">
          <span>Total requests</span>
          <strong>{requests.length}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Likely spam</span>
          <strong>{likelySpamCount}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Missing website</span>
          <strong>{missingWebsiteCount}</strong>
        </article>
      </section>

      <section className="admin-filter-panel">
        <form className="admin-search-form" method="get">
          <label>
            Search contact requests
            <input
              defaultValue={params.q || ""}
              name="q"
              placeholder="Name, email, company, website, messenger, message..."
              type="search"
            />
          </label>
          <label>
            Inquiry type
            <select defaultValue={currentInquiry} name="inquiry">
              {inquiryFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Lead quality
            <select defaultValue={currentQuality} name="quality">
              {qualityFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sort
            <select defaultValue={currentSort} name="sort">
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="button button-secondary" type="submit">
            Apply
          </button>
          <Link className="button button-secondary" href="/admin/requests/contact">
            Reset
          </Link>
        </form>
      </section>

      <ContactRequestsTable
        deleteAction={deleteContactRequests}
        requests={filteredRequests}
        returnTo={returnTo}
      />
    </>
  );
}
