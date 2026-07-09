import type { Metadata } from "next";
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

      <section className="form-panel">
        <div className="form-grid">
          <label>
            Name
            <input type="text" placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            Company/project
            <input type="text" placeholder="Company or project name" />
          </label>
          <label>
            Inquiry type
            <select defaultValue="">
              <option value="" disabled>
                Select inquiry type
              </option>
              <option>Editorial</option>
              <option>Advertising</option>
              <option>Project submission</option>
              <option>Partnership</option>
            </select>
          </label>
          <label className="form-wide">
            Message
            <textarea placeholder="Tell us what you need help with." />
          </label>
        </div>
        <p className="form-note">
          Form submission will be connected later. For now, email the relevant
          ChainBrief inbox above.
        </p>
      </section>
    </>
  );
}
