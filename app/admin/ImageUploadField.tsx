"use client";

import { useRef, useState } from "react";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  helpText?: string;
  recommendedSize?: string;
  name?: string;
};

function getLimitLabel(folder: string) {
  if (folder === "articles/featured") {
    return "5 MB";
  }

  if (folder === "projects/logos") {
    return "2 MB";
  }

  if (folder === "brand/logos") {
    return "1 MB";
  }

  return "3 MB";
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  helpText,
  recommendedSize,
  name,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function uploadSelectedFile() {
    const file = fileInputRef.current?.files?.[0];

    setMessage("");
    setError("");

    if (!file) {
      setError("Please choose an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    setIsUploading(true);

    try {
      const response = await fetch("/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        success: boolean;
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.success || !result.url) {
        setError(result.error || "Upload failed. Please try again.");
        return;
      }

      onChange(result.url);
      setMessage("Image uploaded and URL filled.");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="image-upload-field">
      <label>
        {label}
        <input
          name={name}
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://..."
        />
      </label>

      <div className="image-upload-controls">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        />
        <button
          className="button button-secondary"
          disabled={isUploading}
          onClick={uploadSelectedFile}
          type="button"
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      <p className="image-upload-help">
        {recommendedSize ? `Recommended: ${recommendedSize}. ` : ""}
        Max file size: {getLimitLabel(folder)}. JPEG, PNG, WebP, GIF, or SVG.
        {helpText ? ` ${helpText}` : ""}
      </p>

      {message ? <p className="form-success">{message}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      {value ? (
        <div className="image-upload-preview">
          {/* eslint-disable-next-line @next/next/no-img-element -- Admin previews can use arbitrary Supabase or external URLs. */}
          <img src={value} alt={`${label} preview`} />
        </div>
      ) : null}
    </div>
  );
}
