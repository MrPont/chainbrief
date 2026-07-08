import PageHero from "../../components/PageHero";

const categories = ["All", "Bitcoin", "Ethereum", "DeFi", "Regulation", "Web3"];

const articles = [
  {
    category: "Bitcoin",
    title: "Bitcoin Liquidity Builds Around New Resistance Zone",
    excerpt:
      "Market desks are watching order book depth and ETF demand as Bitcoin attempts another breakout.",
  },
  {
    category: "Ethereum",
    title: "Ethereum Developers Outline Next Scaling Priorities",
    excerpt:
      "Protocol teams continue to focus on rollup efficiency, wallet experience, and validator performance.",
  },
  {
    category: "DeFi",
    title: "DeFi Lending Protocols Report Stronger Borrow Demand",
    excerpt:
      "Blue-chip collateral markets are seeing more activity as traders return to onchain leverage.",
  },
  {
    category: "Regulation",
    title: "Lawmakers Review Stablecoin Compliance Standards",
    excerpt:
      "Policy discussions remain centered on reserves, disclosures, and cross-border payment rules.",
  },
  {
    category: "Web3",
    title: "Consumer Crypto Apps Experiment With Simpler Wallet Flows",
    excerpt:
      "New onboarding patterns are hiding gas fees and seed phrases from first-time users.",
  },
  {
    category: "Markets",
    title: "Altcoin Rotation Favors Infrastructure and AI Tokens",
    excerpt:
      "Liquidity is selective, but several high-conviction themes are gaining trader attention.",
  },
];

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Latest coverage"
        title="Crypto News"
        description="Daily market updates, protocol news, regulation coverage, and Web3 trend tracking from the ChainBrief editorial desk."
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
          <article className="news-card" key={article.title}>
            <div className="card-meta">
              <span>{article.category}</span>
              <span>Sample</span>
            </div>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
          </article>
        ))}
      </section>
    </>
  );
}
