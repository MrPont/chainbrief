import PageHero from "../../components/PageHero";

const projects = [
  { rank: "01", name: "Arbitrum", sector: "Layer 2", score: "94", note: "Deep liquidity and strong developer traction." },
  { rank: "02", name: "EigenLayer", sector: "Restaking", score: "91", note: "Fast-growing infrastructure narrative." },
  { rank: "03", name: "Aave", sector: "DeFi", score: "89", note: "Established lending market with broad integrations." },
  { rank: "04", name: "Celestia", sector: "Modular", score: "86", note: "Important data availability ecosystem." },
  { rank: "05", name: "Chainlink", sector: "Oracle", score: "84", note: "Core oracle and cross-chain infrastructure." },
  { rank: "06", name: "Uniswap", sector: "DEX", score: "82", note: "Leading decentralized exchange brand." },
];

export default function RankingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Project research"
        title="Top Crypto Projects"
        description="Placeholder rankings for notable crypto projects based on market position, ecosystem growth, product maturity, and narrative strength."
      />

      <section className="project-grid wide-grid">
        {projects.map((project) => (
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
