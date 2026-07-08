import PageHero from "../../components/PageHero";
import { topProjects } from "../../lib/siteData";

export default function RankingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Project research"
        title="Top Crypto Projects"
        description="Placeholder rankings for notable crypto projects based on market position, ecosystem growth, product maturity, and narrative strength."
      />

      <section className="project-grid wide-grid">
        {topProjects.map((project) => (
          <article className="project-card" key={project.name}>
            <span className="project-rank">{project.rank}</span>
            <div>
              <h2>{project.name}</h2>
              <p>{project.sector}</p>
            </div>
            <strong>{project.score}</strong>
            <p>{project.note}</p>
          </article>
        ))}
      </section>
    </>
  );
}
