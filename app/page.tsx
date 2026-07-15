import Link from "next/link";
import type { Metadata } from "next";
import ArticleCover from "../components/ArticleCover";
import BannerAd from "../components/BannerAd";
import FeaturedProjects from "../components/FeaturedProjects";
import { getMarketData } from "../lib/marketData";
import { getActiveNewsFallbackImages } from "../lib/news-fallback-images";
import { resolveArticleImage } from "../lib/news-image-resolver";
import {
  fetchPublishedSponsoredSupabaseArticles,
  getPublicNewsArticles,
} from "../lib/publicArticles";
import { getPublicProjects } from "../lib/publicProjects";

export const metadata: Metadata = {
  title: "ChainBrief - Crypto News, Markets & Project Rankings",
  description:
    "Crypto news, market signals, project rankings, and marketing visibility services for Web3 teams.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ChainBrief - Crypto News, Markets & Project Rankings",
    description:
      "Track crypto news, markets, rankings, and Web3 visibility opportunities with ChainBrief.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainBrief - Crypto News, Markets & Project Rankings",
    description:
      "Crypto news, market signals, project rankings, and marketing visibility services for Web3 teams.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

export const dynamic = "force-dynamic";

const projectBenefits = [
  {
    title: "Crypto-native audience",
    description:
      "Reach readers who already understand token launches, DeFi, infrastructure, exchanges, and Web3 product cycles.",
  },
  {
    title: "Editorial-style visibility",
    description:
      "Present your story through structured, credible media formats rather than generic promotional noise.",
  },
  {
    title: "Multi-channel campaign support",
    description:
      "Combine PR, sponsored content, banners, influencer outreach, AMAs, and programmatic visibility.",
  },
  {
    title: "Project ranking and discovery layer",
    description:
      "Use project profiles, rankings, and directory placements to support long-term discovery.",
  },
];

const campaignChannels = [
  "ChainBrief Media",
  "Partner Media Placements",
  "Banner Campaigns",
  "Influencer & KOL Network",
  "AMA & Community Campaigns",
  "Exchange Listing Visibility",
];

const coverageFocus = [
  {
    title: "Market News",
    description: "Fast crypto market context",
  },
  {
    title: "Project Discovery",
    description: "Emerging Web3 projects",
  },
  {
    title: "Sponsored Coverage",
    description: "Media visibility options",
  },
  {
    title: "Web3 Campaigns",
    description: "Placement options for teams",
  },
];

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

export default async function Home() {
  const [marketData, publicArticles, publicProjects, sponsoredArticles] = await Promise.all([
    getMarketData(),
    getPublicNewsArticles(),
    getPublicProjects(),
    fetchPublishedSponsoredSupabaseArticles(1),
  ]);
  const marketCards = marketData.assets.slice(0, 4);
  const homepageArticles = publicArticles.slice(0, 4);
  const homepageSponsoredArticle = sponsoredArticles[0];
  const fallbackImages = getActiveNewsFallbackImages();
  const heroHeadlines = publicArticles.slice(0, 3);
  const heroMarketPulse = ["bitcoin", "ethereum", "solana", "ripple"]
    .map((id) => marketData.assets.find((coin) => coin.id === id))
    .filter((coin): coin is NonNullable<typeof coin> => Boolean(coin))
    .slice(0, 4);
  const topRankedProjects = publicProjects
    .filter((project) => project.source === "supabase")
    .sort((first, second) => {
      if (first.rank !== second.rank) {
        return first.rank - second.rank;
      }

      return second.score - first.score;
    })
    .slice(0, 4);

  return (
    <>
      <BannerAd
        placement="homepage_top"
        className="top-placement"
        fallbackLabel="Homepage Top Banner"
      />

      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Crypto media and market intelligence</p>
          <h1 className="hero-title">
            Crypto news, market signals, and project visibility in one place.
          </h1>
          <p className="hero-subheadline">
            ChainBrief delivers fast crypto coverage, market snapshots, project
            discovery, and sponsored visibility options for Web3 teams.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/news">
              Latest News
            </Link>
            <Link className="button button-secondary" href="/rankings">
              View Rankings
            </Link>
            <Link className="button button-secondary" href="/advertise">
              Advertise
            </Link>
          </div>
          <div className="hero-feature-chips" aria-label="ChainBrief features">
            <span>24/7 Market Watch</span>
            <span>Project Rankings</span>
            <span>Sponsored Coverage</span>
            <span>Fast Editorial Format</span>
          </div>
          <div className="coverage-focus" aria-label="Coverage focus">
            <p className="panel-label">Coverage Focus</p>
            <div className="coverage-focus-grid">
              {coverageFocus.map((item) => (
                <article key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="hero-web3-cta">
            <div>
              <span className="panel-label">For Web3 teams</span>
              <strong>Promote your project on ChainBrief.</strong>
              <p>
                Submit your project for review or explore visibility options
                across ChainBrief.
              </p>
            </div>
            <div className="hero-web3-actions">
              <Link className="button button-primary" href="/submit-project">
                Submit Project
              </Link>
              <Link className="button button-secondary" href="/advertise">
                Advertise
              </Link>
            </div>
          </div>
        </div>
        <aside className="hero-panel hero-dashboard" aria-label="Market briefing">
          <div className="hero-dashboard-card hero-market-card">
            <div className="hero-dashboard-heading">
              <span className="panel-label">Market Pulse</span>
              <small>{marketData.isLive ? "Live via CoinGecko" : "Sample data"}</small>
            </div>
            <div className="hero-market-list">
              {heroMarketPulse.map((coin) => (
                <Link href="/markets" className="hero-market-row" key={coin.id}>
                  <span>
                    <strong>{coin.symbol}</strong>
                    <small>{coin.name}</small>
                  </span>
                  <span>{coin.formattedPrice}</span>
                  <em className={coin.priceChangePercentage24h && coin.priceChangePercentage24h < 0 ? "is-negative" : "is-positive"}>
                    {coin.formattedChange24h}
                  </em>
                </Link>
              ))}
            </div>
          </div>

          <div className="hero-dashboard-card hero-headlines-card">
            <div className="hero-dashboard-heading">
              <span className="panel-label">Trending Now</span>
              <Link href="/news">All news</Link>
            </div>
            <div className="hero-headline-list">
              {heroHeadlines.map((article) => (
                <Link href={`/news/${article.slug}`} key={article.slug}>
                  <span>{article.category}</span>
                  <strong>{article.title}</strong>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="content-grid">
        <div className="primary-column">
          <div className="section-heading">
            <p className="eyebrow">Latest coverage</p>
            <h2>Latest News</h2>
            <Link href="/news">View all</Link>
          </div>
          <div className="news-grid">
            {homepageArticles.map((article) => {
              const image = resolveArticleImage({
                articleId: article.id,
                slug: article.slug,
                featuredImageUrl: article.featuredImage,
                category: article.category,
                tags: article.tags,
                fallbackImages,
              });

              return (
                <Link className="news-card" href={`/news/${article.slug}`} key={article.slug}>
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
                    <span>{article.category}</span>
                    <span>{formatArticleDate(article.publishedDate)}</span>
                  </div>
                  <h3>{article.title}</h3>
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
              );
            })}
          </div>
        </div>

        <aside className="sidebar">
          <BannerAd
            placement="sidebar"
            variant="box"
            fallbackLabel="Sidebar Banner"
            fallbackSize="300 x 250"
          />
          {homepageSponsoredArticle ? (
            <Link
              className="sponsored-card sponsored-article-card"
              href={`/news/${homepageSponsoredArticle.slug}`}
            >
              <ArticleCover
                category={homepageSponsoredArticle.category}
                imageUrl={homepageSponsoredArticle.featuredImage}
                isImported={homepageSponsoredArticle.isImported}
                isSponsored={homepageSponsoredArticle.isSponsored}
                title={homepageSponsoredArticle.title}
              />
              <p className="eyebrow">Sponsored Article</p>
              <h2>{homepageSponsoredArticle.title}</h2>
              <p>{homepageSponsoredArticle.excerpt}</p>
              {homepageSponsoredArticle.sponsorName ? (
                <span className="sponsored-partner">
                  Sponsored by {homepageSponsoredArticle.sponsorName}
                </span>
              ) : null}
              <span className="sponsored-card-link">Read Sponsored Brief</span>
            </Link>
          ) : (
            <section className="sponsored-card sponsored-empty-card">
              <p className="eyebrow">Sponsored Article</p>
              <h2>Sponsored coverage is available on request.</h2>
              <p>
                Publish clearly labeled partner content for crypto readers,
                traders, and Web3 project teams.
              </p>
              <Link href="/contact">Request Media Kit</Link>
            </section>
          )}
        </aside>
      </section>

      <section className="market-section">
        <BannerAd
          placement="homepage_mid"
          className="section-placement"
          fallbackLabel="Homepage Mid Banner"
        />

        <div className="section-heading">
          <p className="eyebrow">Live sample data</p>
          <h2>Market Movers</h2>
          <Link href="/markets">Open markets</Link>
        </div>
        <div className="mover-grid">
          {marketCards.map((coin) => (
            <article className={`mover-card accent-${coin.accent}`} key={coin.symbol}>
              <div className="coin-symbol">{coin.symbol}</div>
              <p>{coin.name}</p>
              <strong>{coin.formattedPrice}</strong>
              <span>{coin.formattedChange24h}</span>
            </article>
          ))}
        </div>
      </section>

      <FeaturedProjects projects={publicProjects} />

      <section className="projects-section">
        <div className="section-heading">
          <p className="eyebrow">Research desk</p>
          <h2>Top Crypto Projects</h2>
          <Link href={topRankedProjects.length > 0 ? "/rankings" : "/submit-project"}>
            {topRankedProjects.length > 0 ? "View rankings" : "Submit project"}
          </Link>
        </div>
        {topRankedProjects.length > 0 ? (
          <div className="project-grid">
            {topRankedProjects.map((project) => (
              <Link className="project-card" href={`/projects/${project.slug}`} key={project.slug}>
                <span className="project-rank">
                  {project.rank && project.rank < 999 ? `#${project.rank}` : "Ranked"}
                </span>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.category}</p>
                </div>
                <strong>{project.score || "N/A"}</strong>
                <p>{project.shortDescription}</p>
              </Link>
            ))}
          </div>
        ) : (
          <section className="cta-panel compact-cta-panel rankings-update-panel">
            <p className="eyebrow">Rankings update</p>
            <h2>Project rankings are being updated</h2>
            <p>
              ChainBrief is preparing the editorial ranking layer from public
              project data. Submit a project for review or explore the current
              project directory while rankings are being curated.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/submit-project">
                Submit Your Project
              </Link>
              <Link className="button button-secondary" href="/projects">
                View Directory
              </Link>
            </div>
          </section>
        )}
      </section>

      <section className="cta-panel marketing-home-panel">
        <p className="eyebrow">For Crypto Projects</p>
        <h2>Visibility support beyond the newsroom</h2>
        <p>
          ChainBrief helps projects gain visibility through PR articles,
          sponsored content, banner ads, project rankings, influencer campaigns,
          AMAs, programmatic campaigns, and exchange or listing visibility.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/marketing">
            Explore Marketing Services
          </Link>
          <Link className="button button-secondary" href="/media-kit">
            Request Media Kit
          </Link>
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <p className="eyebrow">Why projects use ChainBrief</p>
          <h2>Built for credible crypto visibility</h2>
        </div>
        <div className="marketing-grid compact-marketing-grid">
          {projectBenefits.map((benefit) => (
            <article className="marketing-card" key={benefit.title}>
              <span>Project growth</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <p className="eyebrow">Campaign channels</p>
          <h2>Media, community and launch visibility</h2>
        </div>
        <div className="use-case-grid">
          {campaignChannels.map((channel) => (
            <span key={channel}>{channel}</span>
          ))}
        </div>
      </section>

      <section className="cta-panel marketing-cta">
        <p className="eyebrow">Campaign CTA</p>
        <h2>Ready to Put Your Project in Front of Crypto Readers?</h2>
        <p>
          Build awareness with ChainBrief media, advertising placements, project
          discovery, and multi-channel Web3 campaign support.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/marketing">
            Start a Campaign
          </Link>
          <Link className="button button-secondary" href="/advertise">
            View Advertising Options
          </Link>
        </div>
      </section>

      <BannerAd
        placement="leaderboard"
        className="bottom-placement"
        fallbackLabel="Leaderboard Banner"
      />
    </>
  );
}
