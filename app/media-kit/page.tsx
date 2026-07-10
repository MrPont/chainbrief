import type { Metadata } from "next";
import Link from "next/link";
import BannerAd from "../../components/BannerAd";

export const metadata: Metadata = {
  title: "ChainBrief Media Kit",
  description:
    "Advertising and campaign opportunities across ChainBrief sponsored articles, banners, project listings, partner media, influencers, AMAs and launch visibility packages.",
  alternates: {
    canonical: "/media-kit",
  },
  openGraph: {
    title: "ChainBrief Media Kit",
    description:
      "Media visibility options for crypto and Web3 projects across ChainBrief placements and campaign channels.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainBrief Media Kit",
    description:
      "Request advertising and campaign options for crypto and Web3 visibility.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

const mediaOptions = [
  "Sponsored Articles",
  "Press Releases",
  "Banner Placements",
  "Project Listings",
  "Newsletter Sponsorship",
  "Influencer and KOL Campaigns",
  "AMA and Community Campaigns",
  "Exchange Listing Visibility",
  "Launch Visibility Packages",
  "Custom Web3 Campaign Support",
];

const mediaKitIncludes = [
  "Available placements",
  "Banner dimensions",
  "Sponsored content options",
  "Campaign formats",
  "Audience and positioning summary",
  "Pricing on request",
  "Contact details",
];

const packages = [
  {
    name: "Starter PR Package",
    description:
      "For teams that need a credible first media placement, launch announcement, or educational sponsored article.",
  },
  {
    name: "Visibility Boost Package",
    description:
      "For projects that want combined ChainBrief placement, banners, and partner distribution around a growth milestone.",
  },
  {
    name: "Launch Campaign Package",
    description:
      "For token launches, exchange listings, product launches, and ecosystem announcements that need coordinated visibility.",
  },
  {
    name: "Premium Growth Package",
    description:
      "For teams that need a multi-channel campaign across media, influencers, AMAs, programmatic ads, and listings.",
  },
];

export default function MediaKitPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">ChainBrief Media Kit</p>
        <h1>Media Visibility for Crypto and Web3 Projects</h1>
        <p>
          Promote your crypto project through ChainBrief placements, sponsored
          articles, banner campaigns, project listings, partner media,
          influencers, AMAs and launch visibility packages. The media kit is
          available on request and includes current formats, placement options,
          and pricing details.
        </p>
      </section>

      <BannerAd
        placement="leaderboard"
        className="section-placement"
        fallbackLabel="Leaderboard Banner"
      />

      <section className="marketing-section">
        <div className="section-heading">
          <p className="eyebrow">Options</p>
          <h2>Media Opportunities</h2>
        </div>
        <div className="use-case-grid">
          {mediaOptions.map((option) => (
            <span key={option}>{option}</span>
          ))}
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <p className="eyebrow">Packages</p>
          <h2>Example Campaign Packages</h2>
        </div>
        <div className="package-grid">
          {packages.map((item) => (
            <article className="package-card" key={item.name}>
              <h2>{item.name}</h2>
              <strong>Pricing on request</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <p className="eyebrow">Media Kit Includes</p>
          <h2>Everything Needed to Scope a Campaign</h2>
        </div>
        <div className="use-case-grid">
          {mediaKitIncludes.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="cta-panel marketing-cta">
        <p className="eyebrow">Media kit</p>
        <h2>Request the Media Kit</h2>
        <p>
          Tell us what you are launching, who you need to reach, and when the
          campaign should go live. ChainBrief will share relevant placement
          options, campaign formats, and pricing details on request.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/contact">
            Request the Media Kit
          </Link>
          <Link className="button button-secondary" href="/contact">
            Request Pricing
          </Link>
        </div>
      </section>
    </>
  );
}
