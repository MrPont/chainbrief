type ArticleFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  article?: {
    title?: string | null;
    slug?: string | null;
    excerpt?: string | null;
    content?: string | null;
    category?: string | null;
    author?: string | null;
    source_name?: string | null;
    source_url?: string | null;
    featured_image?: string | null;
    status?: string | null;
    is_sponsored?: boolean | null;
    sponsor_name?: string | null;
    published_at?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
  };
  submitLabel: string;
};

function dateTimeLocalValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
}

export default function ArticleForm({ action, article, submitLabel }: ArticleFormProps) {
  const status = article?.status || "draft";

  return (
    <form action={action} className="admin-form-panel">
      <div className="form-grid">
        <label>
          Title
          <input name="title" required type="text" defaultValue={article?.title || ""} />
        </label>
        <label>
          Slug
          <input name="slug" required type="text" defaultValue={article?.slug || ""} />
        </label>
        <label>
          Category
          <input name="category" type="text" defaultValue={article?.category || ""} />
        </label>
        <label>
          Author
          <input name="author" type="text" defaultValue={article?.author || ""} />
        </label>
        <label>
          Source name
          <input name="source_name" type="text" defaultValue={article?.source_name || ""} />
        </label>
        <label>
          Source URL
          <input name="source_url" type="url" defaultValue={article?.source_url || ""} />
        </label>
        <label>
          Featured image URL
          <input
            name="featured_image"
            type="url"
            defaultValue={article?.featured_image || ""}
          />
        </label>
        <label>
          Status
          <select name="status" defaultValue={status}>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label>
          Published date
          <input
            name="published_at"
            type="datetime-local"
            defaultValue={dateTimeLocalValue(article?.published_at)}
          />
        </label>
        <label>
          Sponsor name
          <input name="sponsor_name" type="text" defaultValue={article?.sponsor_name || ""} />
        </label>
        <label className="form-wide">
          Excerpt
          <textarea name="excerpt" defaultValue={article?.excerpt || ""} />
        </label>
        <label className="form-wide">
          Content
          <textarea name="content" defaultValue={article?.content || ""} />
        </label>
        <label>
          SEO title
          <input name="seo_title" type="text" defaultValue={article?.seo_title || ""} />
        </label>
        <label>
          SEO description
          <input
            name="seo_description"
            type="text"
            defaultValue={article?.seo_description || ""}
          />
        </label>
      </div>
      <label className="admin-checkbox">
        <input
          name="is_sponsored"
          type="checkbox"
          defaultChecked={Boolean(article?.is_sponsored)}
        />
        Sponsored article
      </label>
      <button className="button button-primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
