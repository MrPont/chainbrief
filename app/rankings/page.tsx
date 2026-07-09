import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "../../components/PageHero";
import { getRankedPublicProjects } from "../../lib/publicProjects";

export const metadata: Metadata = {
  title: "Crypto Project Rankings",
  description:
    "ChainBrief rankings for notable crypto projects based on market position, ecosystem strength, product maturity and narrative momentum.",
  alternates: {
    canonical: "/rankings",
  },
  openGraph: {
    title: "Crypto Project Rankings | ChainBrief",
    description:
      "Discover ranked crypto projects across infrastructure, DeFi, L1s, L2s and Web3.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Project Rankings | ChainBrief",
    description:
      "Crypto project rankings and discovery from ChainBrief.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

export const dynamic = "force-dynamic";

export default async function RankingsPage() {
  const projects = await getRankedPublicProjects();

  return (
    <>
      <PageHero
        eyebrow="Project research"
        title="Top Crypto Projects"
        description="Placeholder rankings for notable crypto projects based on market position, ecosystem growth, product maturity, and narrative strength."
      />

      <section className="project-grid wide-grid">
        {projects.map((project) => (
          <Link className="project-card" href={`/projects/${project.slug}`} key={project.slug}>
            <span className="project-rank">{String(project.rank).padStart(2, "0")}</span>
            <div>
              <h2>{project.name}</h2>
              <p>{project.category}</p>
            </div>
            <strong>{project.score}</strong>
            <p>{project.shortDescription}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
