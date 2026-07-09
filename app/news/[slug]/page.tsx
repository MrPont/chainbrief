import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getRelatedArticles,
  latestNews,
  SITE_URL,
} from "../../../lib/siteData";

type NewsArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getArticleUrl(slug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;

  return new URL(`/news/${slug}`, siteUrl).toString();
}

export function generateStaticParams() {
  return latestNews.map((article) => ({
    slug: article.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const canonicalUrl = getArticleUrl(article.slug);

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: canonicalUrl,
      publishedTime: article.publishedDate,
      authors: [article.author],
      tags: article.tags,
      images: ["/chainbrief-market-intelligence.png"],
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.slug);
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
              <dd>{article.sourceLabel}</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>{article.publishedDate}</dd>
            </div>
            <div>
              <dt>Read</dt>
              <dd>{article.readingTime}</dd>
            </div>
          </dl>
        </header>

        <section className="article-content">
          {article.contentSections.map((section, index) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {index === 0 ? (
                <aside className="ad-banner article-ad" aria-label="Advertisement">
                  <span>In-Article Banner Ad Placement</span>
                </aside>
              ) : null}
            </section>
          ))}
        </section>

        <footer className="article-footer-blocks">
          <section className="tag-list" aria-label="Article tags">
            {article.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </section>

          {article.originalSourceUrl ? (
            <section className="attribution-block">
              <h2>Original Source Attribution</h2>
              <p>
                Source placeholder:{" "}
                <a href={article.originalSourceUrl}>{article.originalSourceUrl}</a>
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
              <span className="impact-pill">{relatedArticle.impact}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
