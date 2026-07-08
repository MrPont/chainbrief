import Link from "next/link";

const latestNews = [
  {
    category: "Bitcoin",
    title: "Bitcoin Holds Key Support as Traders Watch Liquidity Zones",
    excerpt:
      "Analysts are tracking spot demand, funding rates, and ETF flows as Bitcoin consolidates near a major technical level.",
    time: "18 min read",
  },
  {
    category: "Ethereum",
    title: "Ethereum Restaking Protocols Draw Fresh Institutional Interest",
    excerpt:
      "New validator yield products are bringing renewed attention to Ethereum infrastructure and liquid staking markets.",
    time: "12 min read",
  },
  {
    category: "Regulation",
    title: "Policy Teams Prepare for a Busy Month of Crypto Hearings",
    excerpt:
      "Stablecoin frameworks, exchange oversight, and DeFi reporting rules are moving back into the spotlight.",
    time: "9 min read",
  },
  {
    category: "DeFi",
    title: "Onchain Lending Markets Rebound as Blue-Chip Collateral Rises",
    excerpt:
      "Borrowing demand is climbing across major protocols while risk teams monitor collateral volatility.",
    time: "7 min read",
  },
  {
    category: "Web3",
    title: "Consumer Crypto Apps Shift Toward Wallet-Free Onboarding",
    excerpt:
      "Product teams are simplifying signups, gas payments, and recovery flows to win mainstream users.",
    time: "6 min read",
  },
  {
    category: "Markets",
    title: "Altcoin Volatility Expands Ahead of Major Token Unlocks",
    excerpt:
      "Liquidity remains selective as traders rotate between infrastructure, AI, and real-world asset narratives.",
    time: "5 min read",
  },
];

const marketMovers = [
  { symbol: "BTC", name: "Bitcoin", price: "$108,420", change: "+2.8%", accent: "green" },
  { symbol: "ETH", name: "Ethereum", price: "$5,860", change: "+1.9%", accent: "blue" },
  { symbol: "SOL", name: "Solana", price: "$284.10", change: "+5.4%", accent: "violet" },
  { symbol: "BNB", name: "BNB", price: "$812.35", change: "-0.7%", accent: "red" },
];

const topProjects = [
  {
    rank: "01",
    name: "Arbitrum",
    sector: "Layer 2",
    score: "94",
    note: "Strong developer activity and expanding DeFi liquidity.",
  },
  {
    rank: "02",
    name: "EigenLayer",
    sector: "Restaking",
    score: "91",
    note: "Growing validator economy with broad infrastructure integrations.",
  },
  {
    rank: "03",
    name: "Aave",
    sector: "DeFi",
    score: "89",
    note: "Leading lending protocol with resilient risk management.",
  },
  {
    rank: "04",
    name: "Celestia",
    sector: "Modular",
    score: "86",
    note: "Data availability adoption remains a key market narrative.",
  },
];

export default function Home() {
  return (
    <>
      <section className="ad-banner top-banner" aria-label="Advertisement">
        <span>Premium Banner Ad Placement</span>
      </section>

      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Crypto intelligence for a faster market</p>
          <h1>Crypto News, Market Signals & Project Rankings</h1>
          <p className="hero-subheadline">
            ChainBrief tracks crypto markets, Web3 trends, Bitcoin, Ethereum,
            DeFi, regulation, and emerging projects with fast context for
            investors, builders, and operators.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/news">
              Latest News
            </Link>
            <Link className="button button-secondary" href="/advertise">
              Advertise With Us
            </Link>
          </div>
        </div>
        <aside className="hero-panel" aria-label="Market briefing">
          <div>
            <span className="panel-label">Market Pulse</span>
            <strong>Risk-on sentiment improves as majors reclaim momentum.</strong>
          </div>
          <div className="pulse-grid">
            <span>BTC Dominance</span>
            <strong>53.4%</strong>
            <span>DeFi TVL</span>
            <strong>$148B</strong>
            <span>Fear & Greed</span>
            <strong>72</strong>
          </div>
        </aside>
      </section>

      <section className="content-grid">
        <div className="primary-column">
          <div className="section-heading">
            <p className="eyebrow">Latest coverage</p>
            <h2>Latest News</h2>
          </div>
          <div className="news-grid">
            {latestNews.map((article) => (
              <article className="news-card" key={article.title}>
                <div className="card-meta">
                  <span>{article.category}</span>
                  <span>{article.time}</span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="sidebar">
          <section className="ad-box" aria-label="Advertisement">
            <span>Sidebar Ad</span>
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
        </div>
        <div className="mover-grid">
          {marketMovers.map((coin) => (
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
        </div>
        <div className="project-grid">
          {topProjects.map((project) => (
            <article className="project-card" key={project.name}>
              <span className="project-rank">{project.rank}</span>
              <div>
                <h3>{project.name}</h3>
                <p>{project.sector}</p>
              </div>
              <strong>{project.score}</strong>
              <p>{project.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ad-banner bottom-banner" aria-label="Advertisement">
        <span>Leaderboard Ad Placement</span>
      </section>
    </>
  );
}
