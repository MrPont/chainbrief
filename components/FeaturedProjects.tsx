/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { PublicProject } from "../lib/publicProjects";

type FeaturedProjectsProps = {
  projects: PublicProject[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  limit?: number;
  showDirectoryLink?: boolean;
  className?: string;
};

const defaultBadges = ["Featured", "Trending", "Featured", "Project Spotlight"];
const placementCards = [
  {
    badge: "Promoted",
    title: "Your Project Could Be Featured Here",
    subtitle: "Premium Placement",
    meta: ["Launch visibility", "Web3"],
    text: "Request project visibility across ChainBrief homepage, directory and discovery modules.",
    cta: "Request Placement",
  },
  {
    badge: "Featured",
    title: "Launch Visibility Available",
    subtitle: "Project Spotlight",
    meta: ["Homepage", "Directory"],
    text: "Position your project beside curated crypto coverage and market intelligence modules.",
    cta: "Get Featured",
  },
  {
    badge: "Sponsored",
    title: "Promote a Web3 Narrative",
    subtitle: "Discovery Slot",
    meta: ["Campaign", "Media"],
    text: "Use featured inventory to support a launch, ecosystem update, funding milestone or listing campaign.",
    cta: "Request Media Kit",
  },
];

function getProjectBadge(project: PublicProject, index: number) {
  if (project.isSponsored) {
    return project.sponsorLabel || "Sponsored";
  }

  return defaultBadges[index % defaultBadges.length];
}

function getProjectInitials(project: PublicProject) {
  const symbol = project.symbol?.replace(/[^a-z0-9]/gi, "").slice(0, 3);

  if (symbol) {
    return symbol.toUpperCase();
  }

  return project.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getProjectMetric(project: PublicProject) {
  if (project.score) {
    return `Score ${project.score}`;
  }

  if (project.rank && project.rank < 999) {
    return `Rank #${project.rank}`;
  }

  return "Profile";
}

export default function FeaturedProjects({
  projects,
  title = "Featured Crypto Projects",
  subtitle = "Curated visibility for Web3 teams, launches and market narratives.",
  eyebrow = "Project visibility",
  limit = 4,
  showDirectoryLink = true,
  className = "",
}: FeaturedProjectsProps) {
  const featuredProjects = [...projects]
    .sort((first, second) => {
      if (first.isSponsored !== second.isSponsored) {
        return first.isSponsored ? -1 : 1;
      }

      if (first.rank !== second.rank) {
        return first.rank - second.rank;
      }

      return second.score - first.score;
    })
    .slice(0, limit);
  const openSlots = Math.max(0, limit - featuredProjects.length);
  const classNames = ["featured-projects-section", className].filter(Boolean).join(" ");

  return (
    <section className={classNames}>
      <div className="section-heading featured-projects-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {showDirectoryLink ? <Link href="/projects">View directory</Link> : null}
      </div>

      <div className="featured-project-grid">
        {featuredProjects.map((project, index) => (
          <Link
            className="featured-project-card"
            href={`/projects/${project.slug}`}
            key={project.slug}
          >
            <div className="featured-project-topline">
              <span className="featured-project-badge">{getProjectBadge(project, index)}</span>
              {project.rank && project.rank < 999 ? <span>#{project.rank}</span> : null}
            </div>
            <div className="featured-project-identity">
              {project.logoUrl ? (
                <img src={project.logoUrl} alt="" />
              ) : (
                <span className="featured-project-logo-fallback">
                  {getProjectInitials(project)}
                </span>
              )}
              <div>
                <h3>{project.name}</h3>
                {project.symbol && project.symbol !== "N/A" ? <p>{project.symbol}</p> : null}
              </div>
            </div>
            <div className="featured-project-meta">
              <span>{project.category}</span>
              {project.chain ? <span>{project.chain}</span> : null}
            </div>
            <p>{project.shortDescription}</p>
            <div className="featured-project-footer">
              <span>{getProjectMetric(project)}</span>
              <strong>View Project</strong>
            </div>
          </Link>
        ))}

        {Array.from({ length: openSlots }).map((_, index) => {
          const placement = placementCards[index % placementCards.length];

          return (
            <Link
              className="featured-project-card featured-project-placement"
              href="/contact"
              key={placement.title}
            >
              <div className="featured-project-topline">
                <span className="featured-project-badge">{placement.badge}</span>
                <span>Inventory</span>
              </div>
              <div className="featured-project-identity">
                <span className="featured-project-logo-fallback">CB</span>
                <div>
                  <h3>{placement.title}</h3>
                  <p>{placement.subtitle}</p>
                </div>
              </div>
              <div className="featured-project-meta">
                {placement.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <p>{placement.text}</p>
              <div className="featured-project-footer">
                <span>Media kit on request</span>
                <strong>{placement.cta}</strong>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
