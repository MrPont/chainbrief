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
  };
  submitLabel: string;
};

function arrayValue(value?: string[] | null) {
  return value?.join(", ") || "";
}

export default function ProjectForm({ action, project, submitLabel }: ProjectFormProps) {
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
        <label>
          Logo URL
          <input name="logo_url" type="url" defaultValue={project?.logo_url || ""} />
        </label>
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
      <button className="button button-primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
