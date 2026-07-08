import PageHero from "../../components/PageHero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact ChainBrief"
        description="Use this page for editorial tips, advertising inquiries, partnership requests, and general questions."
      />
      <section className="text-panel">
        <p>Email: hello@chainbrief.example</p>
        <p>Advertising: ads@chainbrief.example</p>
        <p>
          A real contact form can be added later when backend services are
          connected.
        </p>
      </section>
    </>
  );
}
