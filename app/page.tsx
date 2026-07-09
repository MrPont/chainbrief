import Image from "next/image";
import Link from "next/link";
import { latestNews, marketMovers, topProjects } from "../lib/siteData";

export default function Home() {
  return (
    <>
      <section className="ad-banner top-banner" aria-label="Advertisement">
        <span>Premium Banner Ad Placement</span>
      </section>

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
          <section className="ad-box" aria-label="Advertisement">
            <span>Available placement</span>
            <strong>300 x 250</strong>
          </section>
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
          ChainBrief also supports project visibility through PR, banner
          campaigns, project listings, influencer outreach, AMAs, and
          programmatic advertising for crypto and Web3 teams.
        </p>
        <Link className="button button-primary" href="/marketing">
          Explore Marketing Services
        </Link>
      </section>

      <section className="ad-banner bottom-banner" aria-label="Advertisement">
        <span>Leaderboard Ad Placement</span>
      </section>
    </>
  );
}
