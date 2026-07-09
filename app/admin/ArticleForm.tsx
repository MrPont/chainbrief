"use client";

import { useState, useTransition } from "react";
import ImageUploadField from "./ImageUploadField";
import { generateArticleAiRewrite } from "./ai/actions";

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
    is_imported?: boolean | null;
    original_source_url?: string | null;
    ai_rewritten_at?: string | null;
    ai_model?: string | null;
    ai_status?: string | null;
    ai_notes?: string | null;
    needs_review?: boolean | null;
  };
  submitLabel: string;
  articleId?: string;
  showAiAssistant?: boolean;
  highlightAiAssistant?: boolean;
  aiRewriteEnabled?: boolean;
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

export default function ArticleForm({
  action,
  article,
  submitLabel,
  articleId,
  showAiAssistant = false,
  highlightAiAssistant = false,
  aiRewriteEnabled = false,
}: ArticleFormProps) {
  const status = article?.status || "draft";
  const [isAiPending, startAiTransition] = useTransition();
  const [featuredImage, setFeaturedImage] = useState(article?.featured_image || "");
  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [content, setContent] = useState(article?.content || "");
  const [seoTitle, setSeoTitle] = useState(article?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(article?.seo_description || "");
  const [needsReview, setNeedsReview] = useState(Boolean(article?.needs_review));
  const [aiMessage, setAiMessage] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiNotes, setAiNotes] = useState(article?.ai_notes || "");
  const [aiModel, setAiModel] = useState(article?.ai_model || "");
  const [aiStatus, setAiStatus] = useState(article?.ai_status || "");

  function generateRewrite() {
    if (!aiRewriteEnabled) {
      setAiError("AI rewrite is currently disabled. Manual editorial review is active.");
      return;
    }

    if (!articleId) {
      setAiError("Article must be saved before AI rewrite can run.");
      return;
    }

    setAiMessage("");
    setAiError("");

    startAiTransition(async () => {
      const result = await generateArticleAiRewrite(articleId);

      if (!result.ok) {
        setAiError(result.error);
        return;
      }

      setTitle(result.data.title);
      setSlug(result.data.slug);
      setExcerpt(result.data.excerpt);
      setContent(result.data.content);
      setSeoTitle(result.data.seo_title);
      setSeoDescription(result.data.seo_description);
      setAiNotes(result.data.ai_notes);
      setAiModel(result.model);
      setAiStatus("generated");
      setNeedsReview(true);
      setAiMessage("AI rewrite generated. Review the fields, edit as needed, then save.");
    });
  }

  return (
    <>
      {showAiAssistant ? (
        <section
          className={
            highlightAiAssistant ? "admin-ai-card admin-ai-card-highlight" : "admin-ai-card"
          }
        >
          <div>
            <p className="eyebrow">AI Rewrite Assistant</p>
            <h2>Generate ChainBrief Draft</h2>
            <p>
              AI output must be reviewed before publishing. It uses only the saved
              RSS metadata and excerpt for this article.
            </p>
            {article?.is_imported ? (
              <p className="admin-warning-text">
                Imported RSS article. Recommended workflow: Generate rewrite, review,
                publish.
              </p>
            ) : null}
            {needsReview ? (
              <p className="admin-warning-text">
                This article was AI-assisted and still needs editorial review.
              </p>
            ) : null}
            {aiStatus ? (
              <p className="admin-muted-line">
                AI status: {aiStatus}
                {aiModel ? ` with ${aiModel}` : ""}
              </p>
            ) : null}
            {aiNotes ? <p className="admin-muted-line">AI notes: {aiNotes}</p> : null}
          </div>
          {aiRewriteEnabled ? (
            <button
              className="button button-primary"
              disabled={isAiPending}
              onClick={generateRewrite}
              type="button"
            >
              {isAiPending ? "Generating..." : "Generate AI Rewrite"}
            </button>
          ) : (
            <p className="admin-disabled-notice">
              AI rewrite is currently disabled. Manual editorial review is active.
            </p>
          )}
          {aiMessage ? <p className="form-success">{aiMessage}</p> : null}
          {aiError ? <p className="form-error">{aiError}</p> : null}
        </section>
      ) : null}

      {article?.is_imported ? (
        <section className="admin-ai-card">
          <div>
            <p className="eyebrow">Manual Rewrite Helper</p>
            <h2>Editorial Workflow</h2>
            <ul className="admin-helper-list">
              <li>Review original source.</li>
              <li>Rewrite title, excerpt and content manually.</li>
              <li>Keep source attribution.</li>
              <li>Set status to published only after review.</li>
            </ul>
            <label className="admin-copy-template">
              Prompt template
              <textarea
                readOnly
                value={`Rewrite this imported crypto news item into an original ChainBrief brief. Use only the facts in the source metadata and excerpt. Keep source attribution, avoid hype, do not provide financial advice, and write clean editorial paragraphs.\n\nTitle: ${title}\nSource: ${article.source_name || ""}\nOriginal URL: ${article.original_source_url || article.source_url || ""}\nCategory: ${article.category || ""}\nExcerpt: ${excerpt}`}
              />
            </label>
          </div>
        </section>
      ) : null}

      <form action={action} className="admin-form-panel">
        <div className="form-grid">
          <label>
            Title
            <input
              name="title"
              onChange={(event) => setTitle(event.target.value)}
              required
              type="text"
              value={title}
            />
          </label>
          <label>
            Slug
            <input
              name="slug"
              onChange={(event) => setSlug(event.target.value)}
              required
              type="text"
              value={slug}
            />
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
        <div className="form-wide">
          <ImageUploadField
            label="Featured image URL"
            name="featured_image"
            value={featuredImage}
            onChange={setFeaturedImage}
            folder="articles/featured"
            recommendedSize="1200x630 or 1600x900"
            helpText="Used on public article cards and article detail pages when available."
          />
        </div>
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
          <textarea
            name="excerpt"
            onChange={(event) => setExcerpt(event.target.value)}
            value={excerpt}
          />
        </label>
        <label className="form-wide">
          Content
          <textarea
            name="content"
            onChange={(event) => setContent(event.target.value)}
            value={content}
          />
        </label>
        <label>
          SEO title
          <input
            name="seo_title"
            onChange={(event) => setSeoTitle(event.target.value)}
            type="text"
            value={seoTitle}
          />
        </label>
        <label>
          SEO description
          <input
            name="seo_description"
            onChange={(event) => setSeoDescription(event.target.value)}
            type="text"
            value={seoDescription}
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
      <label className="admin-checkbox">
        <input
          checked={needsReview}
          name="needs_review"
          onChange={(event) => setNeedsReview(event.target.checked)}
          type="checkbox"
        />
        Needs editorial review
      </label>
      <button className="button button-primary" type="submit">
        {submitLabel}
      </button>
      </form>
    </>
  );
}
