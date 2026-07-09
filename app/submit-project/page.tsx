import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Submit Project",
  description:
    "Submit a crypto project for future ChainBrief directory, ranking, sponsored content, banner, influencer, AMA or launch campaign consideration.",
  alternates: {
    canonical: "/submit-project",
  },
  openGraph: {
    title: "Submit a Crypto Project | ChainBrief",
    description:
      "Share your crypto project with ChainBrief for future directory, ranking, media and campaign consideration.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit a Crypto Project | ChainBrief",
    description:
      "Static project submission page for ChainBrief directory and marketing consideration.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

const campaignInterests = [
  "Project listing",
  "Sponsored article",
  "Banner ads",
  "Influencer campaign",
  "AMA",
  "Launch campaign",
];

export default function SubmitProjectPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Project submissions</p>
        <h1>Submit Your Crypto Project</h1>
        <p>
          Share your project for future ChainBrief directory coverage, ranking
          research, sponsored visibility, or marketing campaign planning.
        </p>
      </section>

      <section className="form-panel">
        <div className="form-grid">
          <label>
            Project name
            <input type="text" placeholder="Example Protocol" />
          </label>
          <label>
            Website
            <input type="url" placeholder="https://example.com" />
          </label>
          <label>
            Category
            <input type="text" placeholder="Layer 2, DeFi, AI, GameFi..." />
          </label>
          <label>
            Chain
            <input type="text" placeholder="Ethereum, Solana, Base..." />
          </label>
          <label>
            Token symbol
            <input type="text" placeholder="EXM" />
          </label>
          <label>
            Contact email
            <input type="email" placeholder="team@example.com" />
          </label>
          <label>
            Telegram
            <input type="text" placeholder="@projecthandle" />
          </label>
          <label>
            X/Twitter
            <input type="text" placeholder="@project" />
          </label>
          <label className="form-wide">
            Short description
            <textarea placeholder="Briefly describe the project, category, traction, and campaign goals." />
          </label>
        </div>

        <fieldset className="checkbox-panel">
          <legend>Campaign interest</legend>
          {campaignInterests.map((interest) => (
            <label key={interest}>
              <input type="checkbox" />
              {interest}
            </label>
          ))}
        </fieldset>

        <p className="form-note">
          Form submission will be connected in a later version. For now, contact
          ads@chainbrief.example.
        </p>

        <div className="hero-actions">
          <Link className="button button-primary" href="/marketing">
            Explore Marketing Services
          </Link>
          <Link className="button button-secondary" href="/media-kit">
            View Media Kit
          </Link>
        </div>
      </section>
    </>
  );
}
