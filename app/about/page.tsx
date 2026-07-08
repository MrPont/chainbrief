import PageHero from "../../components/PageHero";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="About ChainBrief"
        description="ChainBrief is an English-language crypto media and market website covering Bitcoin, Ethereum, DeFi, Web3, regulation, and emerging projects."
      />
      <section className="text-panel">
        <p>
          This page is a professional placeholder for the full company story,
          editorial mission, team details, and future disclosure standards.
        </p>
      </section>
    </>
  );
}
