/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import BannerAd from "../../components/BannerAd";
import PageHero from "../../components/PageHero";
import { getPublicNewsArticles } from "../../lib/publicArticles";

export const metadata: Metadata = {
  title: "Crypto News",
  description:
    "Latest crypto news, Bitcoin and Ethereum updates, DeFi coverage, regulation, Web3 trends and market narratives from ChainBrief.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "Crypto News | ChainBrief",
    description:
      "Read ChainBrief crypto news, market updates, regulation coverage and Web3 analysis.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto News | ChainBrief",
    description:
      "Latest crypto news, market updates and Web3 trend coverage.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

const categories = ["All", "Bitcoin", "Ethereum", "DeFi", "Regulation", "Markets"];

export const dynamic = "force-dynamic";

function formatArticleDate(date: string) {
  if (!date) {
    return "Draft date";
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

export default async function NewsPage() {
  const articles = await getPublicNewsArticles();

  return (
    <>
      <PageHero
        eyebrow="Latest coverage"
        title="Crypto News"
        description="Daily market updates, protocol news, regulation coverage, and Web3 trend tracking from the ChainBrief editorial desk."
      />

      <BannerAd
        placement="leaderboard"
        className="section-placement"
        fallbackLabel="News Page Banner"
      />

      <section className="toolbar" aria-label="News tools">
        <div className="filter-row">
          {categories.map((category) => (
            <button type="button" key={category}>
              {category}
            </button>
          ))}
        </div>
        <input aria-label="Search news" placeholder="Search news..." type="search" />
      </section>

      <section className="news-grid">
        {articles.map((article) => (
          <Link className="news-card" href={`/news/${article.slug}`} key={article.slug}>
            {article.featuredImage ? (
              <div className="news-card-image">
                <img src={article.featuredImage} alt="" />
              </div>
            ) : null}
            <div className="card-meta">
              <span>{article.category}</span>
              <span>{formatArticleDate(article.publishedDate)}</span>
            </div>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            <div className="article-card-footer">
              <span>{article.author || article.sourceName}</span>
              <span>{article.readingTime}</span>
            </div>
            {article.isSponsored ? (
              <span className="impact-pill">
                Sponsored{article.sponsorName ? ` by ${article.sponsorName}` : ""}
              </span>
            ) : article.impact ? (
              <span className="impact-pill">{article.impact}</span>
            ) : null}
          </Link>
        ))}
      </section>
    </>
  );
}
