import type { Metadata } from "next";
import ArticleCover from "../../components/ArticleCover";
import PageHero from "../../components/PageHero";

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

const sponsoredArticles = [
  {
    title: "How Data Infrastructure Is Powering the Next Wave of Web3 Apps",
    partner: "Data partner",
    excerpt: "A sponsored look at indexing, analytics, and real-time product dashboards.",
  },
  {
    title: "Why Security Reviews Matter Before a Token Launch",
    partner: "Audit partner",
    excerpt: "A practical overview of audits, monitoring, and launch readiness workflows.",
  },
  {
    title: "Building Better Wallet Onboarding for Mainstream Users",
    partner: "Wallet partner",
    excerpt: "Sponsored insights on embedded wallets, recovery, and smoother first sessions.",
  },
  {
    title: "Institutional Access to Digital Asset Yield Strategies",
    partner: "Research partner",
    excerpt: "A partner briefing on risk controls, reporting, and structured crypto products.",
  },
];

export default function SponsoredPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner content"
        title="Sponsored Articles"
        description="Clearly labeled partner articles and educational campaigns for crypto teams that want to reach ChainBrief readers."
      />

      <section className="news-grid">
        {sponsoredArticles.map((article) => (
          <article className="news-card sponsored-list-card" key={article.title}>
            <ArticleCover category="Sponsored" isSponsored title={article.title} />
            <div className="card-meta">
              <span>Sponsored</span>
              <span>{article.partner}</span>
            </div>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
          </article>
        ))}
      </section>
    </>
  );
}
