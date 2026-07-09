import Link from "next/link";
import PageHero from "../../components/PageHero";
import { cryptoProjects } from "../../lib/siteData";

const projectCategories = [
  "All",
  "Layer 1",
  "Layer 2",
  "DeFi",
  "Infrastructure",
  "Restaking",
  "Data",
];

export default function ProjectsPage() {
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
        {cryptoProjects.map((project) => (
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
