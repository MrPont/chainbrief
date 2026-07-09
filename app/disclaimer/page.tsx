import type { Metadata } from "next";
import PageHero from "../../components/PageHero";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "ChainBrief disclaimer for informational crypto content, market commentary and project research.",
  alternates: {
    canonical: "/disclaimer",
  },
};

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
