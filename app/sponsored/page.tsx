import Link from "next/link";
import type { Metadata } from "next";
import ArticleCover from "../../components/ArticleCover";
import PageHero from "../../components/PageHero";
import { getActiveNewsFallbackImages } from "../../lib/news-fallback-images";
import { resolveArticleImage } from "../../lib/news-image-resolver";
import { fetchPublishedSponsoredSupabaseArticles } from "../../lib/publicArticles";

export const metadata: Metadata = {
  title: "Sponsored Articles",
  description:
    "Clearly labeled sponsored articles and partner content for crypto and Web3 teams on ChainBrief.",
  alternates: {
    canonical: "/sponsored",
  },
  openGraph: {
    title: "Sponsored Articles | ChainBrief",
    description:
      "Partner content and sponsored crypto articles published on ChainBrief.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

export const dynamic = "force-dynamic";

function formatArticleDate(date: string) {
  if (!date) {
    return "Recently published";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

export default async function SponsoredPage() {
  const [articles, fallbackImages] = await Promise.all([
    fetchPublishedSponsoredSupabaseArticles(),
    Promise.resolve(getActiveNewsFallbackImages()),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Partner content"
        title="Sponsored Articles"
        description="Clearly labeled partner articles and educational campaigns for crypto teams that want to reach ChainBrief readers."
      />

      {articles.length > 0 ? (
        <section className="news-grid sponsored-article-grid">
          {articles.map((article) => {
            const image = resolveArticleImage({
              articleId: article.id,
              slug: article.slug,
              featuredImageUrl: article.featuredImage,
              category: article.category,
              tags: article.tags,
              fallbackImages,
            });

            return (
              <Link
                className="news-card sponsored-list-card"
                href={`/news/${article.slug}`}
                key={article.slug}
              >
                <ArticleCover
                  category={article.category}
                  imageUrl={article.featuredImage}
                  isImported={article.isImported}
                  isSponsored={article.isSponsored}
                  resolvedImageAlt={image?.altText}
                  resolvedImageUrl={image?.imageUrl}
                  title={article.title}
                />
                <div className="card-meta">
                  <span>Sponsored</span>
                  <span>{formatArticleDate(article.publishedDate)}</span>
                </div>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
                <div className="article-card-footer">
                  <span>{article.sponsorName || article.sourceName}</span>
                  <span>{article.readingTime}</span>
                </div>
                {article.sponsorName ? (
                  <span className="impact-pill">Sponsored by {article.sponsorName}</span>
                ) : (
                  <span className="impact-pill">Sponsored</span>
                )}
              </Link>
            );
          })}
        </section>
      ) : (
        <section className="sponsored-empty-state">
          <p className="eyebrow">Sponsored coverage</p>
          <h2>No sponsored articles are published yet.</h2>
          <p>
            Future partner content will appear here only after editorial review,
            publication, and clear sponsored labeling.
          </p>
          <Link className="button button-primary" href="/contact">
            Request Media Kit
          </Link>
        </section>
      )}
    </>
  );
}
