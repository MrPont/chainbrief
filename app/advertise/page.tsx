import Link from "next/link";
import type { Metadata } from "next";
import BannerAd from "../../components/BannerAd";
import PageHero from "../../components/PageHero";
import { sponsorPackages } from "../../lib/siteData";

export const metadata: Metadata = {
  title: "Advertise on ChainBrief",
  description:
    "Request ChainBrief advertising options for banners, sponsored articles, featured project cards and newsletter sponsorships.",
  alternates: {
    canonical: "/advertise",
  },
  openGraph: {
    title: "Advertise on ChainBrief",
    description:
      "Reach crypto readers through ChainBrief on-site advertising placements and sponsored content.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Advertise on ChainBrief",
    description:
      "ChainBrief on-site advertising options for crypto and Web3 teams.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

const placements = [
  "Header banner",
  "Homepage leaderboard",
  "Sidebar ad",
  "In-article banner",
  "Featured sponsored article",
  "Featured project card",
  "Newsletter sponsorship",
];

const planningFactors = [
  "placement and page context",
  "campaign duration",
  "creative format",
  "sponsored content scope",
  "distribution and visibility goals",
];

export default function AdvertisePage() {
  return (
    <>
      <PageHero
        eyebrow="Reach crypto readers"
        title="Advertise With ChainBrief"
        description="Tell us your campaign goals and we will suggest the right ChainBrief placement mix. Pricing is available on request and depends on placement, duration, format and distribution scope."
      />

      <BannerAd
        placement="leaderboard"
        className="section-placement"
        fallbackLabel="Leaderboard Banner"
      />

      <section className="cta-panel compact-cta-panel">
        <p className="eyebrow">Advertising vs marketing</p>
        <h2>Advertise on ChainBrief, or run a broader campaign</h2>
        <p>
          Advertise is for ChainBrief placements such as banners, sponsored
          articles, featured project cards, and newsletter sponsorships.
          Marketing covers full crypto campaigns across PR, influencers, AMAs,
          programmatic ads, partner media, and launch support. Public fixed
          pricing is not displayed; request the media kit or pricing details for
          the current placement menu.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/contact">
            Request Media Kit
          </Link>
          <Link className="button button-secondary" href="/contact">
            Request Pricing
          </Link>
        </div>
      </section>

      <section className="package-grid">
        {sponsorPackages.map((item) => (
          <article className="package-card" key={item.name}>
            <h2>{item.name}</h2>
            <strong>{item.actionLabel}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <p className="eyebrow">Pricing approach</p>
          <h2>Campaign Plans Are Scoped to Your Goals</h2>
        </div>
        <div className="use-case-grid">
          {planningFactors.map((factor) => (
            <span key={factor}>{factor}</span>
          ))}
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <p className="eyebrow">Placements</p>
          <h2>ChainBrief Ad Placement Examples</h2>
        </div>
        <div className="use-case-grid">
          {placements.map((placement) => (
            <span key={placement}>{placement}</span>
          ))}
        </div>
      </section>

      <section className="cta-panel">
        <p className="eyebrow">Media kit</p>
        <h2>Plan your next campaign with ChainBrief</h2>
        <p>
          Share your goals, target audience, and timeline. The advertising team
          will prepare package options, sample placements, and pricing details
          based on the formats that fit your campaign.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/contact">
            Request Media Kit
          </Link>
          <Link className="button button-secondary" href="/contact">
            Request Pricing
          </Link>
        </div>
      </section>

      <section className="cta-panel compact-cta-panel">
        <p className="eyebrow">Marketing services</p>
        <h2>Need a full crypto marketing campaign?</h2>
        <p>
          Explore ChainBrief Marketing for PR, banners, listings, influencer
          outreach, AMAs, programmatic exposure, and launch support.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/contact">
            Start a Campaign
          </Link>
          <Link className="button button-secondary" href="/marketing">
            Visit Marketing
          </Link>
        </div>
      </section>
    </>
  );
}
