/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublicProjectBySlug,
  type PublicProject,
} from "../../../lib/publicProjects";
import { latestNews, SITE_URL } from "../../../lib/siteData";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

function getSiteUrl() {
  return process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
}

function getProjectUrl(slug: string) {
  return new URL(`/projects/${slug}`, getSiteUrl()).toString();
}

function ProjectLists({ project }: { project: PublicProject }) {
  const hasHighlights = project.highlights.length > 0;
  const hasRisks = project.risks.length > 0;

  if (!hasHighlights && !hasRisks) {
    return null;
  }

  return (
    <section className="two-column-list">
      {hasHighlights ? (
        <div>
          <h2>Highlights</h2>
          <ul>
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {hasRisks ? (
        <div>
          <h2>Risks</h2>
          <ul>
            {project.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const canonicalUrl = getProjectUrl(project.slug);
  const title = `${project.name} (${project.symbol}) Project Profile`;

  return {
    title,
    description: project.shortDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: project.shortDescription,
      type: "article",
      url: canonicalUrl,
      images: ["/chainbrief-market-intelligence.png"],
    },
  };
}

export default async function ProjectProfilePage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectUrl = getProjectUrl(project.slug);
  const relatedNews = latestNews
    .filter(
      (article) =>
        article.relatedAsset === project.symbol ||
        article.category === project.category ||
        article.tags.some((tag) => project.tags.includes(tag)),
    )
    .slice(0, 3);
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
          {project.logoUrl ? (
            <div className="project-profile-logo">
              <img src={project.logoUrl} alt="" />
            </div>
          ) : null}
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

        <aside className="promo-slot article-placement" aria-label="Project profile placement">
          <span>Project Profile Banner Ad Placement</span>
        </aside>

        <section className="article-content">
          <section>
            <h2>Overview</h2>
            <p>{project.fullDescription}</p>
          </section>

          {project.keyMetrics ? (
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
          ) : null}

          <ProjectLists project={project} />
        </section>

        <footer className="article-footer-blocks">
          {project.tags.length > 0 ? (
            <section className="tag-list" aria-label="Project tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </section>
          ) : null}

          <section className="external-link-panel">
            <h2>External Links</h2>
            <div>
              <a href={project.websiteUrl}>Website</a>
              <a href={project.twitterUrl}>Twitter/X</a>
              {project.telegramUrl ? <a href={project.telegramUrl}>Telegram</a> : null}
            </div>
          </section>

          {project.isSponsored ? (
            <section className="attribution-block">
              <h2>Sponsored Disclosure</h2>
              <p>
                This project profile includes a sponsored placement label.
                ChainBrief keeps risk notes and informational disclaimers
                visible on sponsored project pages.
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

      {relatedNews.length > 0 ? (
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
      ) : null}
    </>
  );
}
