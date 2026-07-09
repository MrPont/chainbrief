import Link from "next/link";
import PageHero from "../../components/PageHero";
import { latestNews } from "../../lib/siteData";

const categories = ["All", "Bitcoin", "Ethereum", "DeFi", "Regulation", "Markets"];

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
        {latestNews.map((article) => (
          <Link className="news-card" href={`/news/${article.slug}`} key={article.slug}>
            <div className="card-meta">
              <span>{article.category}</span>
              <span>{article.readingTime}</span>
            </div>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            <span className="impact-pill">{article.impact}</span>
          </Link>
        ))}
      </section>
    </>
  );
}
