import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import BannerAd from "../components/BannerAd";
import { latestNews, marketMovers, topProjects } from "../lib/siteData";

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

export default function Home() {
  return (
    <>
      <BannerAd
        placement="homepage_top"
        className="top-banner"
        fallbackLabel="Homepage Top Banner"
      />

      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Crypto intelligence for a faster market</p>
          <h1>ChainBrief tracks the stories moving digital assets</h1>
          <p className="hero-subheadline">
            Static-first crypto news, market snapshots, project rankings, and
            sponsored placements for investors, builders, and operators who
            need fast context without the noise.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/news">
              Latest News
            </Link>
            <Link className="button button-secondary" href="/advertise">
              Advertise With Us
            </Link>
          </div>
          <dl className="hero-stats" aria-label="ChainBrief coverage stats">
            <div>
              <dt>6</dt>
              <dd>Coverage desks</dd>
            </div>
            <div>
              <dt>24/7</dt>
              <dd>Market watch</dd>
            </div>
            <div>
              <dt>100%</dt>
              <dd>Static MVP</dd>
            </div>
          </dl>
        </div>
        <aside className="hero-panel visual-panel" aria-label="Market briefing">
          <Image
            alt="Abstract ChainBrief market intelligence dashboard"
            height={916}
            loading="eager"
            src="/chainbrief-market-intelligence.png"
            unoptimized
            width={1717}
          />
          <div className="visual-panel-copy">
            <span className="panel-label">Market Pulse</span>
            <strong>Risk-on sentiment improves as majors reclaim momentum.</strong>
            <div className="pulse-grid">
              <span>BTC Dominance</span>
              <strong>53.4%</strong>
              <span>DeFi TVL</span>
              <strong>$148B</strong>
              <span>Fear & Greed</span>
              <strong>72</strong>
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
            {latestNews.map((article) => (
              <Link className="news-card" href={`/news/${article.slug}`} key={article.slug}>
                <div className="card-meta">
                  <span>{article.category}</span>
                  <span>{article.readingTime}</span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <span className="impact-pill">{article.impact}</span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="sidebar">
          <BannerAd
            placement="sidebar"
            variant="box"
            fallbackLabel="Sidebar Banner"
            fallbackSize="300 x 250"
          />
          <section className="sponsored-card">
            <p className="eyebrow">Sponsored Article</p>
            <h2>How Infrastructure Teams Are Scaling Onchain Data Products</h2>
            <p>
              A partner briefing on analytics, indexing, and the next wave of
              real-time Web3 application tooling.
            </p>
            <Link href="/sponsored">Read Sponsored Brief</Link>
          </section>
        </aside>
      </section>

      <section className="market-section">
        <BannerAd
          placement="homepage_mid"
          className="section-banner"
          fallbackLabel="Homepage Mid Banner"
        />

        <div className="section-heading">
          <p className="eyebrow">Live sample data</p>
          <h2>Market Movers</h2>
          <Link href="/markets">Open markets</Link>
        </div>
        <div className="mover-grid">
          {marketMovers.slice(0, 4).map((coin) => (
            <article className={`mover-card accent-${coin.accent}`} key={coin.symbol}>
              <div className="coin-symbol">{coin.symbol}</div>
              <p>{coin.name}</p>
              <strong>{coin.price}</strong>
              <span>{coin.change}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="projects-section">
        <div className="section-heading">
          <p className="eyebrow">Research desk</p>
          <h2>Top Crypto Projects</h2>
          <Link href="/projects">View directory</Link>
        </div>
        <div className="project-grid">
          {topProjects.slice(0, 4).map((project) => (
            <Link className="project-card" href={`/projects/${project.slug}`} key={project.slug}>
              <span className="project-rank">{project.rank}</span>
              <div>
                <h3>{project.name}</h3>
                <p>{project.sector}</p>
              </div>
              <strong>{project.score}</strong>
              <p>{project.note}</p>
            </Link>
          ))}
        </div>
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
        className="bottom-banner"
        fallbackLabel="Leaderboard Banner"
      />
    </>
  );
}
