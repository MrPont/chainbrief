/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BannerAd from "../../../components/BannerAd";
import {
  getPublicArticleBySlug,
  getRelatedPublicArticles,
  type PublicArticle,
} from "../../../lib/publicArticles";
import { SITE_URL } from "../../../lib/siteData";

type NewsArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

function getSiteUrl() {
  return process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
}

function getArticleUrl(slug: string) {
  return new URL(`/news/${slug}`, getSiteUrl()).toString();
}

function formatArticleDate(date: string) {
  if (!date) {
    return "Not dated";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function getArticleParagraphs(article: PublicArticle) {
  return article.content
    .split(/\n{2,}|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function ArticleBody({ article }: { article: PublicArticle }) {
  if (article.contentSections.length > 0) {
    return (
      <>
        {article.contentSections.map((section, index) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
            {index === 0 ? (
              <BannerAd
                placement="article_inline"
                className="article-placement"
                fallbackLabel="Article Inline Banner"
              />
            ) : null}
          </section>
        ))}
      </>
    );
  }

  const paragraphs = getArticleParagraphs(article);

  return (
    <>
      <section>
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
        ) : (
          <p>{article.excerpt}</p>
        )}
        <BannerAd
          placement="article_inline"
          className="article-placement"
          fallbackLabel="Article Inline Banner"
        />
      </section>
    </>
  );
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const canonicalUrl = getArticleUrl(article.slug);
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime: article.publishedDate || undefined,
      authors: [article.author],
      tags: article.tags,
      images: [article.featuredImage || "/chainbrief-market-intelligence.png"],
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedPublicArticles(article);
  const articleUrl = getArticleUrl(article.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedDate,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "ChainBrief",
    },
    mainEntityOfPage: articleUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="article-layout">
        <article className="article-shell">
          <header className="article-header">
            <div className="article-kicker-row">
              <span className="category-badge">{article.category}</span>
              {article.isSponsored ? (
                <span className="sponsored-label">
                  Sponsored{article.sponsorName ? ` by ${article.sponsorName}` : ""}
                </span>
              ) : null}
            </div>
            <h1>{article.title}</h1>
            <p className="article-excerpt">{article.excerpt}</p>
            <dl className="article-meta" aria-label="Article metadata">
              <div>
                <dt>Author</dt>
                <dd>{article.author}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{article.sourceName}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{formatArticleDate(article.publishedDate)}</dd>
              </div>
              <div>
                <dt>Read</dt>
                <dd>{article.readingTime}</dd>
              </div>
            </dl>
          </header>

          {article.featuredImage ? (
            <figure className="article-featured-image">
              <img src={article.featuredImage} alt="" />
            </figure>
          ) : null}

          <section className="article-content">
            <ArticleBody article={article} />
          </section>

          <footer className="article-footer-blocks">
            {article.tags.length > 0 ? (
              <section className="tag-list" aria-label="Article tags">
                {article.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </section>
            ) : null}

            {article.sourceUrl ? (
              <section className="attribution-block">
                <h2>Original Source Attribution</h2>
                <p>
                  Source placeholder: <a href={article.sourceUrl}>{article.sourceUrl}</a>
                </p>
              </section>
            ) : null}

            <section className="disclaimer-block">
              <h2>Disclaimer</h2>
              <p>
                This article is for informational purposes only and should not be
                considered financial advice.
              </p>
            </section>
          </footer>
        </article>

        <aside className="article-sidebar">
          <BannerAd
            placement="article_sidebar"
            variant="box"
            fallbackLabel="Article Sidebar Banner"
            fallbackSize="300 x 250"
          />
        </aside>
      </div>

      {relatedArticles.length > 0 ? (
        <section className="related-section">
          <div className="section-heading">
            <p className="eyebrow">Continue reading</p>
            <h2>Related Articles</h2>
            <Link href="/news">All news</Link>
          </div>
          <div className="news-grid">
            {relatedArticles.map((relatedArticle) => (
              <Link
                className="news-card"
                href={`/news/${relatedArticle.slug}`}
                key={relatedArticle.slug}
              >
                <div className="card-meta">
                  <span>{relatedArticle.category}</span>
                  <span>{relatedArticle.readingTime}</span>
                </div>
                <h3>{relatedArticle.title}</h3>
                <p>{relatedArticle.excerpt}</p>
                {relatedArticle.isSponsored ? (
                  <span className="impact-pill">Sponsored</span>
                ) : relatedArticle.impact ? (
                  <span className="impact-pill">{relatedArticle.impact}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
