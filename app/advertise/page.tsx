import Link from "next/link";
import type { Metadata } from "next";
import BannerAd from "../../components/BannerAd";
import PageHero from "../../components/PageHero";
import { sponsorPackages } from "../../lib/siteData";

export const metadata: Metadata = {
  title: "Advertise on ChainBrief",
  description:
    "On-site ChainBrief advertising options including banners, sponsored articles, featured project cards and newsletter sponsorships.",
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

export default function AdvertisePage() {
  return (
    <>
      <PageHero
        eyebrow="Reach crypto readers"
        title="Advertise With ChainBrief"
        description="Advertise focuses on ChainBrief on-site media placements. For broader crypto marketing campaigns, visit ChainBrief Marketing."
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
          programmatic ads, partner media, and launch support.
        </p>
      </section>

      <section className="package-grid">
        {sponsorPackages.map((item) => (
          <article className="package-card" key={item.name}>
            <h2>{item.name}</h2>
            <strong>{item.price}</strong>
            <p>{item.description}</p>
          </article>
        ))}
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
          will prepare package options and sample placements.
        </p>
        <Link className="button button-primary" href="/media-kit">
          Request ChainBrief Ad Options
        </Link>
      </section>

      <section className="cta-panel compact-cta-panel">
        <p className="eyebrow">Marketing services</p>
        <h2>Need a full crypto marketing campaign?</h2>
        <p>
          Explore ChainBrief Marketing for PR, banners, listings, influencer
          outreach, AMAs, programmatic exposure, and launch support.
        </p>
        <Link className="button button-secondary" href="/marketing">
          Visit Marketing
        </Link>
      </section>
    </>
  );
}
