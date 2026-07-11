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
  "Featured Project Placement",
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

const placementOptions = [
  {
    name: "Homepage Top Placement",
    description: "Premium horizontal placement near the top of the homepage.",
    bestFor: "major launches, ecosystem announcements and visibility campaigns.",
  },
  {
    name: "Homepage Mid Placement",
    description: "Native banner placement inside the homepage content flow.",
    bestFor: "project discovery and campaign awareness.",
  },
  {
    name: "Article Inline Placement",
    description: "In-article placement between editorial sections.",
    bestFor: "contextual visibility around crypto news and market coverage.",
  },
  {
    name: "Article Sidebar Placement",
    description: "Compact sidebar placement next to article content.",
    bestFor: "ongoing brand visibility.",
  },
  {
    name: "Sitewide Sidebar Placement",
    description: "Recurring compact placement across selected website sections.",
    bestFor: "sustained campaign presence.",
  },
  {
    name: "Footer Placement",
    description: "Lower-page horizontal placement across selected pages.",
    bestFor: "long-term campaign support.",
  },
  {
    name: "Featured Project Card",
    description: "Project card inside ChainBrief's project discovery section.",
    bestFor: "token projects, Web3 apps, infrastructure and launches.",
  },
  {
    name: "Sponsored Article",
    description: "Editorial-style sponsored coverage published on ChainBrief.",
    bestFor: "project launches, product explainers and ecosystem updates.",
  },
];

const placementTableRows = [
  {
    placement: "Homepage Top Placement",
    format: "Horizontal banner",
    bestFor: "Major campaign visibility",
  },
  {
    placement: "Homepage Mid Placement",
    format: "Native banner",
    bestFor: "Project discovery",
  },
  {
    placement: "Article Inline Placement",
    format: "In-article banner",
    bestFor: "Contextual visibility",
  },
  {
    placement: "Article Sidebar Placement",
    format: "Sidebar card/banner",
    bestFor: "Ongoing awareness",
  },
  {
    placement: "Sitewide Sidebar Placement",
    format: "Compact recurring placement",
    bestFor: "Brand visibility",
  },
  {
    placement: "Footer Placement",
    format: "Horizontal lower-page banner",
    bestFor: "Campaign support",
  },
  {
    placement: "Featured Project Card",
    format: "Project discovery card",
    bestFor: "Web3 project visibility",
  },
  {
    placement: "Sponsored Article",
    format: "Editorial placement",
    bestFor: "Launches and announcements",
  },
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

      <section className="cta-panel compact-cta-panel">
        <p className="eyebrow">Featured Project Placement</p>
        <h2>Homepage and directory project visibility</h2>
        <p>
          Place your project inside ChainBrief&apos;s project discovery and
          homepage visibility modules. Media kit and pricing available on
          request for featured, sponsored and promoted project placements.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/contact">
            Request Media Kit
          </Link>
          <Link className="button button-secondary" href="/advertise">
            View Ad Options
          </Link>
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Inventory</p>
            <h2>Media Placement Options</h2>
          </div>
        </div>
        <p className="section-intro">
          Explore available visibility placements across ChainBrief news,
          market coverage and project discovery pages.
        </p>
        <div className="media-placement-grid">
          {placementOptions.map((option) => (
            <article className="media-placement-card" key={option.name}>
              <span>{option.name}</span>
              <p>{option.description}</p>
              <small>Best for: {option.bestFor}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Placement Map</p>
            <h2>How Inventory Fits Into the Site</h2>
          </div>
        </div>
        <div className="placement-map-grid">
          <article className="placement-map-card">
            <h3>Homepage Layout</h3>
            <div className="placement-map-preview homepage-map-preview">
              <span>Header</span>
              <span className="placement-map-highlight">Homepage Top Placement</span>
              <span>Hero</span>
              <span className="placement-map-highlight">Homepage Mid Placement</span>
              <span>Featured Projects</span>
              <span className="placement-map-highlight">Footer Placement</span>
            </div>
          </article>
          <article className="placement-map-card">
            <h3>Article Layout</h3>
            <div className="placement-map-preview article-map-preview">
              <span className="placement-map-wide">Article Header</span>
              <span className="placement-map-content">Article Content</span>
              <span className="placement-map-highlight placement-map-side">
                Article Sidebar Placement
              </span>
              <span className="placement-map-highlight placement-map-content">
                Article Inline Placement
              </span>
              <span className="placement-map-highlight placement-map-wide">
                Footer Placement
              </span>
            </div>
          </article>
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Formats</p>
            <h2>Placement Availability</h2>
          </div>
        </div>
        <div className="table-card media-placement-table">
          <table>
            <thead>
              <tr>
                <th>Placement</th>
                <th>Format</th>
                <th>Best For</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {placementTableRows.map((row) => (
                <tr key={row.placement}>
                  <td>{row.placement}</td>
                  <td>{row.format}</td>
                  <td>{row.bestFor}</td>
                  <td>On request</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="cta-panel compact-cta-panel">
        <p className="eyebrow">Placement planning</p>
        <h2>Request ChainBrief Media Kit</h2>
        <p>
          Tell us about your campaign goals, target markets and preferred
          placement type. ChainBrief will respond with available options.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/contact">
            Request Placement
          </Link>
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
