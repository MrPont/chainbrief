import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import PageHero from "../../components/PageHero";

export const metadata: Metadata = {
  title: "Contact ChainBrief",
  description:
    "Contact ChainBrief for editorial tips, advertising, project submissions and crypto media partnerships.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact ChainBrief",
    description:
      "Reach ChainBrief for editorial, advertising, project submissions and partnerships.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact ChainBrief",
    description:
      "Contact ChainBrief for crypto media, advertising and project visibility inquiries.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

const contactCards = [
  { label: "Editorial tips", email: "editorial@chainbrief.example" },
  { label: "Advertising", email: "ads@chainbrief.example" },
  { label: "Project submissions", email: "projects@chainbrief.example" },
  { label: "Partnerships", email: "partners@chainbrief.example" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact ChainBrief"
        description="Use this page for editorial tips, advertising inquiries, partnership requests, and general questions."
      />

      <section className="package-grid contact-card-grid">
        {contactCards.map((card) => (
          <article className="package-card" key={card.email}>
            <h2>{card.label}</h2>
            <strong>{card.email}</strong>
            <p>Use this inbox for focused ChainBrief communication.</p>
          </article>
        ))}
      </section>

      <ContactForm />
    </>
  );
}
