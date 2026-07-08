import PageHero from "../../components/PageHero";

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
