import PageHero from "../../components/PageHero";

export default function DisclaimerPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Disclaimer"
        description="ChainBrief content is for informational purposes only and should not be treated as financial, investment, tax, or legal advice."
      />
      <section className="text-panel">
        <p>
          Crypto assets are volatile and involve risk. Readers should do their
          own research and consult qualified professionals before making
          financial decisions.
        </p>
      </section>
    </>
  );
}
