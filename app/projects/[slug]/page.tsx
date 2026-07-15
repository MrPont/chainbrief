/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCover from "../../../components/ArticleCover";
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

function hasUsableUrl(url?: string) {
  return Boolean(url && url !== "#");
}

function formatStatus(status?: string) {
  if (!status) {
    return "Published";
  }

  return status
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function hasRank(project: PublicProject) {
  return Number.isFinite(project.rank) && project.rank > 0 && project.rank < 999;
}

function hasScore(project: PublicProject) {
  return Number.isFinite(project.score) && project.score > 0;
}

function shortenAddress(address: string) {
  if (address.length <= 18) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-5)}`;
}

function getProjectInitials(project: PublicProject) {
  const symbol = project.symbol && project.symbol !== "N/A" ? project.symbol : "";

  return (symbol || project.name)
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();
}

function ProjectLogo({ project }: { project: PublicProject }) {
  if (project.logoUrl) {
    return (
      <div className="project-profile-logo">
        <img src={project.logoUrl} alt={`${project.name} logo`} />
      </div>
    );
  }

  return (
    <div className="project-profile-logo project-logo-fallback" aria-hidden="true">
      {getProjectInitials(project)}
    </div>
  );
}

function ProjectLinks({
  className = "",
  compact = false,
  project,
}: {
  className?: string;
  compact?: boolean;
  project: PublicProject;
}) {
  const links = [
    { label: "Website", url: project.websiteUrl },
    { label: "Twitter/X", url: project.twitterUrl },
    { label: "Telegram", url: project.telegramUrl },
    { label: "Discord", url: project.discordUrl },
    { label: "GitHub", url: project.githubUrl },
    { label: "Whitepaper", url: project.whitepaperUrl },
    { label: "Explorer", url: project.explorerUrl },
  ].filter((link) => hasUsableUrl(link.url));

  if (links.length === 0) {
    return null;
  }

  return (
    <div className={`project-link-row ${compact ? "project-link-row-compact" : ""} ${className}`}>
      {links.map((link) => (
        <a href={link.url} key={link.label} rel="noreferrer" target="_blank">
          {link.label}
        </a>
      ))}
    </div>
  );
}

function hasExternalProjectLinks(project: PublicProject) {
  return [
    project.websiteUrl,
    project.twitterUrl,
    project.telegramUrl,
    project.discordUrl,
    project.githubUrl,
    project.whitepaperUrl,
    project.explorerUrl,
  ].some(hasUsableUrl);
}

function DetailGrid({ project }: { project: PublicProject }) {
  const details = [
    { label: "Chain", value: project.chain },
    { label: "Contract", value: project.contractAddress ? shortenAddress(project.contractAddress) : "" },
    { label: "Category", value: project.category },
    { label: "Rank", value: hasRank(project) ? `#${project.rank}` : "" },
    { label: "Score", value: hasScore(project) ? String(project.score) : "" },
    { label: "Status", value: formatStatus(project.status) },
  ].filter((item) => item.value && item.value !== "Multi-chain");

  if (details.length === 0) {
    return null;
  }

  return (
    <section>
      <h2>Project Details</h2>
      <div className="project-detail-grid">
        {details.map((detail) => (
          <article key={detail.label}>
            <span>{detail.label}</span>
            <strong>{detail.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function TechnicalInfo({ project }: { project: PublicProject }) {
  if (!project.chain && !project.explorerUrl && !project.contractAddress) {
    return null;
  }

  return (
    <section className="technical-panel">
      <h2>Technical Information</h2>
      <div className="technical-list">
        {project.chain ? (
          <div>
            <span>Chain</span>
            <strong>{project.chain}</strong>
          </div>
        ) : null}
        {hasUsableUrl(project.explorerUrl) ? (
          <div>
            <span>Explorer</span>
            <a href={project.explorerUrl} rel="noreferrer" target="_blank">
              Open explorer
            </a>
          </div>
        ) : null}
        {project.contractAddress ? (
          <div className="technical-address-row">
            <span>Contract Address</span>
            <strong>{shortenAddress(project.contractAddress)}</strong>
            <code>{project.contractAddress}</code>
          </div>
        ) : null}
      </div>
    </section>
  );
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
          <h2>Risk Notes</h2>
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
  const image = project.logoUrl || "/chainbrief-market-intelligence.png";

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
      images: [image],
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
      url: hasUsableUrl(project.websiteUrl) ? project.websiteUrl : projectUrl,
    },
  };
  const overview =
    project.fullDescription?.trim() ||
    project.shortDescription?.trim() ||
    "This project profile is being prepared by the ChainBrief research desk.";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="project-profile-shell">
        <header className="article-header project-profile-header rich-project-header">
          <div className="project-hero-main">
            <ProjectLogo project={project} />
            <div>
              <div className="article-kicker-row">
                <span className="category-badge">{project.category}</span>
                {project.symbol && project.symbol !== "N/A" ? (
                  <span className="category-badge project-symbol-badge">
                    {project.symbol}
                  </span>
                ) : null}
                {project.chain ? (
                  <span className="category-badge project-chain-badge">
                    {project.chain}
                  </span>
                ) : null}
                {project.isSponsored ? (
                  <span className="sponsored-label">
                    {project.sponsorLabel || "Sponsored profile"}
                  </span>
                ) : null}
              </div>
              <h1>
                {project.name}
                {project.symbol && project.symbol !== "N/A" ? (
                  <span>{project.symbol}</span>
                ) : null}
              </h1>
              <p className="article-excerpt">{project.shortDescription}</p>
            </div>
          </div>
          <ProjectLinks compact project={project} />
        </header>

        <aside className="promo-slot article-placement" aria-label="Project profile placement">
          <span>Project Profile Banner Ad Placement</span>
        </aside>

        <section className="article-content">
          <section>
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <DetailGrid project={project} />

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

          <TechnicalInfo project={project} />
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

          {hasExternalProjectLinks(project) ? (
            <section className="external-link-panel">
              <h2>External Links</h2>
              <ProjectLinks project={project} />
            </section>
          ) : null}

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
                <ArticleCover
                  category={article.category}
                  isSponsored={article.isSponsored}
                  title={article.title}
                />
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
