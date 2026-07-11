"use client";

import { useState } from "react";
import ImageUploadField from "./ImageUploadField";

type ProjectFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  project?: {
    name?: string | null;
    slug?: string | null;
    symbol?: string | null;
    category?: string | null;
    short_description?: string | null;
    full_description?: string | null;
    chain?: string | null;
    website_url?: string | null;
    twitter_url?: string | null;
    telegram_url?: string | null;
    logo_url?: string | null;
    rank?: number | null;
    score?: number | null;
    tags?: string[] | null;
    highlights?: string[] | null;
    risks?: string[] | null;
    is_sponsored?: boolean | null;
    sponsor_label?: string | null;
    status?: string | null;
    review_status?: string | null;
    source_name?: string | null;
    source_url?: string | null;
    imported_at?: string | null;
  };
  submitLabel: string;
};

function arrayValue(value?: string[] | null) {
  return value?.join(", ") || "";
}

export default function ProjectForm({ action, project, submitLabel }: ProjectFormProps) {
  const [logoUrl, setLogoUrl] = useState(project?.logo_url || "");

  return (
    <form action={action} className="admin-form-panel">
      <div className="form-grid">
        <label>
          Name
          <input name="name" required type="text" defaultValue={project?.name || ""} />
        </label>
        <label>
          Slug
          <input name="slug" required type="text" defaultValue={project?.slug || ""} />
        </label>
        <label>
          Symbol
          <input name="symbol" type="text" defaultValue={project?.symbol || ""} />
        </label>
        <label>
          Category
          <input name="category" type="text" defaultValue={project?.category || ""} />
        </label>
        <label>
          Chain
          <input name="chain" type="text" defaultValue={project?.chain || ""} />
        </label>
        <label>
          Website URL
          <input name="website_url" type="url" defaultValue={project?.website_url || ""} />
        </label>
        <label>
          Twitter/X URL
          <input name="twitter_url" type="url" defaultValue={project?.twitter_url || ""} />
        </label>
        <label>
          Telegram URL
          <input name="telegram_url" type="url" defaultValue={project?.telegram_url || ""} />
        </label>
        <div className="form-wide">
          <ImageUploadField
            label="Logo URL"
            name="logo_url"
            value={logoUrl}
            onChange={setLogoUrl}
            folder="projects/logos"
            recommendedSize="Square image, at least 512x512"
            helpText="Used on project directory, rankings, and project profile pages."
          />
        </div>
        <label>
          Rank
          <input name="rank" type="number" min="1" defaultValue={project?.rank ?? ""} />
        </label>
        <label>
          Score
          <input
            name="score"
            type="number"
            min="0"
            max="100"
            defaultValue={project?.score ?? ""}
          />
        </label>
        <label>
          Sponsor label
          <input
            name="sponsor_label"
            type="text"
            defaultValue={project?.sponsor_label || ""}
          />
        </label>
        <label>
          Status
          <select name="status" defaultValue={project?.status || "draft"}>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label>
          Review status
          <select name="review_status" defaultValue={project?.review_status || "needs_review"}>
            <option value="needs_review">Needs review</option>
            <option value="in_review">In review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label className="form-wide">
          Short description
          <textarea
            name="short_description"
            defaultValue={project?.short_description || ""}
          />
        </label>
        <label className="form-wide">
          Full description
          <textarea name="full_description" defaultValue={project?.full_description || ""} />
        </label>
        <label className="form-wide">
          Tags
          <textarea name="tags" defaultValue={arrayValue(project?.tags)} />
        </label>
        <label className="form-wide">
          Highlights
          <textarea name="highlights" defaultValue={arrayValue(project?.highlights)} />
        </label>
        <label className="form-wide">
          Risks
          <textarea name="risks" defaultValue={arrayValue(project?.risks)} />
        </label>
      </div>
      <label className="admin-checkbox">
        <input
          name="is_sponsored"
          type="checkbox"
          defaultChecked={Boolean(project?.is_sponsored)}
        />
        Sponsored project
      </label>
      {project?.source_name || project?.source_url || project?.imported_at ? (
        <section className="admin-review-warning">
          <p className="eyebrow">Imported project</p>
          <h2>Source Attribution</h2>
          <p>
            Imported from {project.source_name || "external source"}
            {project.imported_at ? ` on ${new Date(project.imported_at).toLocaleString()}` : ""}.
          </p>
          {project.source_url ? (
            <p>
              Source URL: <a href={project.source_url}>{project.source_url}</a>
            </p>
          ) : null}
          <p>
            Review factual metadata, write an original ChainBrief description, and
            publish only after editorial approval.
          </p>
        </section>
      ) : null}
      <button className="button button-primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
