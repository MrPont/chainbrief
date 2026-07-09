"use client";

import { useState } from "react";
import ImageUploadField from "./ImageUploadField";

const placements = [
  "header",
  "homepage_top",
  "homepage_mid",
  "article_inline",
  "article_sidebar",
  "sidebar",
  "footer",
  "leaderboard",
];

type BannerFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  banner?: {
    title?: string | null;
    advertiser_name?: string | null;
    image_url?: string | null;
    target_url?: string | null;
    placement?: string | null;
    is_active?: boolean | null;
    start_date?: string | null;
    end_date?: string | null;
  };
  submitLabel: string;
};

function dateValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function formatPlacementLabel(placement: string) {
  return placement
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function BannerForm({ action, banner, submitLabel }: BannerFormProps) {
  const [imageUrl, setImageUrl] = useState(banner?.image_url || "");

  return (
    <form action={action} className="admin-form-panel">
      <div className="form-grid">
        <label>
          Title
          <input name="title" required type="text" defaultValue={banner?.title || ""} />
        </label>
        <label>
          Advertiser name
          <input
            name="advertiser_name"
            type="text"
            defaultValue={banner?.advertiser_name || ""}
          />
        </label>
        <div className="form-wide">
          <ImageUploadField
            label="Image URL"
            name="image_url"
            value={imageUrl}
            onChange={setImageUrl}
            folder="banners"
            recommendedSize="1200x180 for header/leaderboard, 300x250 for sidebar, 970x250 or 728x90 for article inline"
            helpText="This image displays through the public BannerAd component."
          />
        </div>
        <label>
          Target URL
          <input name="target_url" type="url" defaultValue={banner?.target_url || ""} />
        </label>
        <label>
          Placement
          <select name="placement" defaultValue={banner?.placement || "homepage_top"}>
            {placements.map((placement) => (
              <option key={placement} value={placement}>
                {formatPlacementLabel(placement)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Start date
          <input name="start_date" type="date" defaultValue={dateValue(banner?.start_date)} />
        </label>
        <label>
          End date
          <input name="end_date" type="date" defaultValue={dateValue(banner?.end_date)} />
        </label>
      </div>
      <label className="admin-checkbox">
        <input name="is_active" type="checkbox" defaultChecked={Boolean(banner?.is_active)} />
        Active banner
      </label>
      <button className="button button-primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
