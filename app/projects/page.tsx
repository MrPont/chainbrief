/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "../../components/PageHero";
import { getPublicProjects } from "../../lib/publicProjects";

export const metadata: Metadata = {
  title: "Crypto Project Directory",
  description:
    "Explore ChainBrief crypto project profiles, rankings, categories, market signals and project discovery pages.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Crypto Project Directory | ChainBrief",
    description:
      "Track crypto project profiles across DeFi, infrastructure, L1s, L2s, data networks and Web3.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Project Directory | ChainBrief",
    description:
      "Project discovery profiles and rankings for crypto and Web3 markets.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

const projectCategories = [
  "All",
  "Layer 1",
  "Layer 2",
  "DeFi",
  "Infrastructure",
  "Restaking",
  "Data",
];

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <>
      <PageHero
        eyebrow="Project research"
        title="Crypto Project Directory"
        description="Track infrastructure, DeFi, Web3, AI crypto, L1/L2 ecosystems, and the market narratives shaping digital asset project discovery."
      />

      <section className="toolbar" aria-label="Project directory tools">
        <div className="filter-row">
          {projectCategories.map((category) => (
            <button type="button" key={category}>
              {category}
            </button>
          ))}
        </div>
        <input aria-label="Search projects" placeholder="Search projects..." type="search" />
      </section>

      <section className="project-directory-grid">
        {projects.map((project) => (
          <Link className="directory-card" href={`/projects/${project.slug}`} key={project.slug}>
            <div className="directory-card-header">
              <div>
                <span className="category-badge">{project.category}</span>
                {project.isSponsored ? (
                  <span className="sponsored-label">
                    {project.sponsorLabel || "Sponsored"}
                  </span>
                ) : null}
              </div>
              <strong>#{project.rank}</strong>
            </div>
            {project.logoUrl ? (
              <div className="project-logo-row">
                <img src={project.logoUrl} alt="" />
              </div>
            ) : null}
            <h2>
              {project.name} <span>{project.symbol}</span>
            </h2>
            <p>{project.shortDescription}</p>
            <div className="project-score-row">
              <span>Chain</span>
              <strong>{project.chain}</strong>
              <span>Score</span>
              <strong>{project.score}</strong>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
