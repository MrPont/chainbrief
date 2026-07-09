"use client";

type SourceFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  source?: {
    name?: string | null;
    slug?: string | null;
    website_url?: string | null;
    feed_url?: string | null;
    category?: string | null;
    is_active?: boolean | null;
  };
  submitLabel: string;
};

export default function SourceForm({ action, source, submitLabel }: SourceFormProps) {
  return (
    <form action={action} className="admin-form-panel">
      <div className="form-grid">
        <label>
          Name
          <input name="name" required type="text" defaultValue={source?.name || ""} />
        </label>
        <label>
          Slug
          <input name="slug" required type="text" defaultValue={source?.slug || ""} />
        </label>
        <label>
          Website URL
          <input name="website_url" type="url" defaultValue={source?.website_url || ""} />
        </label>
        <label>
          Feed URL
          <input name="feed_url" required type="url" defaultValue={source?.feed_url || ""} />
        </label>
        <label>
          Category
          <input name="category" type="text" defaultValue={source?.category || ""} />
        </label>
      </div>
      <label className="admin-checkbox">
        <input name="is_active" type="checkbox" defaultChecked={source?.is_active ?? true} />
        Active source
      </label>
      <button className="button button-primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
