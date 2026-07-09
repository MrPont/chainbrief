import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  cryptoProjects,
  getProjectBySlug,
  getRelatedProjectNews,
  SITE_URL,
} from "../../../lib/siteData";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getProjectUrl(slug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;

  return new URL(`/projects/${slug}`, siteUrl).toString();
}

export function generateStaticParams() {
  return cryptoProjects.map((project) => ({
    slug: project.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const canonicalUrl = getProjectUrl(project.slug);

  return {
    title: `${project.name} (${project.symbol}) Project Profile`,
    description: project.shortDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${project.name} (${project.symbol}) Project Profile`,
      description: project.shortDescription,
      type: "article",
      url: canonicalUrl,
      images: ["/chainbrief-market-intelligence.png"],
    },
  };
}

export default async function ProjectProfilePage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedNews = getRelatedProjectNews(project);
  const projectUrl = getProjectUrl(project.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${project.name} Project Profile`,
    description: project.shortDescription,
    url: projectUrl,
    publisher: {
      "@type": "Organization",
      name: "ChainBrief",
    },
    about: {
      "@type": "Organization",
      name: project.name,
      alternateName: project.symbol,
      url: project.websiteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="project-profile-shell">
        <header className="article-header project-profile-header">
          <div className="article-kicker-row">
            <span className="category-badge">{project.category}</span>
            {project.isSponsored ? (
              <span className="sponsored-label">
                {project.sponsorLabel || "Sponsored profile"}
              </span>
            ) : null}
          </div>
          <h1>
            {project.name} <span>{project.symbol}</span>
          </h1>
          <p className="article-excerpt">{project.shortDescription}</p>
          <dl className="article-meta project-profile-meta" aria-label="Project metadata">
            <div>
              <dt>Rank</dt>
              <dd>#{project.rank}</dd>
            </div>
            <div>
              <dt>Score</dt>
              <dd>{project.score}</dd>
            </div>
            <div>
              <dt>Chain</dt>
              <dd>{project.chain}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{project.category}</dd>
            </div>
          </dl>
        </header>

        <aside className="ad-banner article-ad" aria-label="Advertisement">
          <span>Project Profile Banner Ad Placement</span>
        </aside>

        <section className="article-content">
          <section>
            <h2>Overview</h2>
            <p>{project.fullDescription}</p>
          </section>

          <section>
            <h2>Key Metrics</h2>
            <div className="metric-grid">
              <article>
                <span>Market Position</span>
                <p>{project.keyMetrics.marketPosition}</p>
              </article>
              <article>
                <span>Ecosystem Strength</span>
                <p>{project.keyMetrics.ecosystemStrength}</p>
              </article>
              <article>
                <span>Developer Activity</span>
                <p>{project.keyMetrics.developerActivity}</p>
              </article>
              <article>
                <span>Liquidity Profile</span>
                <p>{project.keyMetrics.liquidityProfile}</p>
              </article>
            </div>
          </section>

          <section className="two-column-list">
            <div>
              <h2>Highlights</h2>
              <ul>
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Risks</h2>
              <ul>
                {project.risks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
          </section>
        </section>

        <footer className="article-footer-blocks">
          <section className="tag-list" aria-label="Project tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </section>

          <section className="external-link-panel">
            <h2>External Links</h2>
            <div>
              <a href={project.websiteUrl}>Website placeholder</a>
              <a href={project.twitterUrl}>Social placeholder</a>
            </div>
          </section>

          {project.isSponsored ? (
            <section className="attribution-block">
              <h2>Sponsored Disclosure</h2>
              <p>
                This project profile includes a sponsored placement label. ChainBrief
                keeps editorial-style risk notes and informational disclaimers visible
                on every sponsored project page.
              </p>
            </section>
          ) : null}

          <section className="disclaimer-block">
            <h2>Disclaimer</h2>
            <p>
              This project profile is for informational purposes only and should
              not be considered investment advice.
            </p>
          </section>
        </footer>
      </article>

      <section className="related-section">
        <div className="section-heading">
          <p className="eyebrow">Project context</p>
          <h2>Related News</h2>
          <Link href="/news">All news</Link>
        </div>
        <div className="news-grid">
          {relatedNews.map((article) => (
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
      </section>
    </>
  );
}
