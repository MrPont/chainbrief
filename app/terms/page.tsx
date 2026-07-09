import type { Metadata } from "next";
import PageHero from "../../components/PageHero";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "ChainBrief terms placeholder for website usage, sponsored content rules, intellectual property and liability limits.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms"
        description="These placeholder terms outline general rules for using ChainBrief content, pages, tools, and future services."
      />
      <section className="text-panel">
        <p>
          Final terms should define acceptable use, intellectual property,
          limitations of liability, sponsored content rules, and dispute
          procedures.
        </p>
      </section>
    </>
  );
}
