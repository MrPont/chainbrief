import type { Metadata } from "next";
import Link from "next/link";
import BannerAd from "../../components/BannerAd";

export const metadata: Metadata = {
  title: "Crypto Marketing Services | ChainBrief",
  description:
    "Crypto PR, banner advertising, project listings, influencer campaigns, AMAs, programmatic ads and launch visibility services for Web3 projects.",
  openGraph: {
    title: "Crypto Marketing Services | ChainBrief",
    description:
      "Crypto PR, banner advertising, project listings, influencer campaigns, AMAs, programmatic ads and launch visibility services for Web3 projects.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Marketing Services | ChainBrief",
    description:
      "Crypto PR, banner advertising, project listings, influencer campaigns, AMAs, programmatic ads and launch visibility services for Web3 projects.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  alternates: {
    canonical: "/marketing",
  },
};

const services = [
  {
    title: "PR Articles & Press Releases",
    label: "Earned visibility",
    description:
      "Publish market-aware announcements, thought leadership, and launch stories that explain why your project matters. ChainBrief helps shape the message for crypto-native readers and partner distribution.",
  },
  {
    title: "Banner Advertising",
    label: "Media placements",
    description:
      "Run high-visibility display placements across ChainBrief pages built for crypto news, markets, rankings, and project discovery. Campaigns can support awareness, launch windows, and retargeting funnels.",
  },
  {
    title: "Project Listings",
    label: "Discovery layer",
    description:
      "Position your project in directory-style placements that give readers a clear overview of category, chain, metrics, highlights, and risks. Listings are designed for credibility rather than empty hype.",
  },
  {
    title: "Influencer & KOL Campaigns",
    label: "Social reach",
    description:
      "Coordinate crypto creator, analyst, and KOL amplification around announcements, launches, and education campaigns. The focus is message fit, timing, and audience quality.",
  },
  {
    title: "AMA & Community Campaigns",
    label: "Community trust",
    description:
      "Support Telegram, Discord, X Spaces, and community AMA activations with campaign planning and promotional coverage. Useful for teams that need direct audience interaction before or after launch.",
  },
  {
    title: "Programmatic Advertising",
    label: "Paid distribution",
    description:
      "Extend reach through programmatic placements built around crypto, finance, and Web3 audiences. Campaigns can complement ChainBrief media inventory with broader targeted exposure.",
  },
  {
    title: "Exchange & Listing Support",
    label: "Market access",
    description:
      "Prepare visibility around exchange listings, liquidity milestones, and market expansion moments. Support may include PR, banners, community pushes, and coordinated launch narratives.",
  },
  {
    title: "Investor & Email Campaigns",
    label: "Capital reach",
    description:
      "Build structured visibility for investor updates, ecosystem announcements, and fundraising narratives. Email and partner distribution can help teams reach a more focused audience.",
  },
];

const packages = [
  {
    name: "Starter Visibility",
    action: "Request media kit",
    description:
      "For early projects that need credible first exposure. May include sponsored coverage, starter banner placement, and basic project listing visibility, scoped after review.",
  },
  {
    name: "Growth Campaign",
    action: "Custom campaign package",
    description:
      "For teams expanding reach after product traction. May include ChainBrief placements, KOL coordination, newsletter visibility, and community campaign support.",
  },
  {
    name: "Launch Campaign",
    action: "Pricing on request",
    description:
      "For token launches, product launches, exchange listings, or ecosystem announcements. May include PR, banners, AMAs, influencers, and launch-week distribution.",
  },
  {
    name: "Premium Visibility",
    action: "Custom campaign package",
    description:
      "For projects that need broad market presence across multiple channels. May include premium media placement, programmatic reach, KOL waves, and strategic campaign planning.",
  },
];

const useCases = [
  "Token launches",
  "Exchange listing campaigns",
  "CEX/DEX visibility",
  "Web3 product launches",
  "DeFi campaigns",
  "AI crypto projects",
  "NFT/GameFi campaigns",
  "Fundraising visibility",
  "Community growth",
];

const processSteps = [
  "Share your project and goals",
  "Choose visibility channels",
  "Launch the campaign",
  "Track reach and results",
];

const beyondServices = [
  "PR placements on partner crypto websites",
  "Banner advertising on external crypto media",
  "Exchange listing visibility support",
  "Influencer campaigns",
  "Telegram and X/Twitter community campaigns",
  "Programmatic advertising",
  "Investor and email campaigns",
];

export default function MarketingPage() {
  return (
    <>
      <section className="marketing-hero">
        <div>
          <p className="eyebrow">ChainBrief Marketing</p>
          <h1>Crypto Marketing Built for Visibility, Trust and Market Reach</h1>
          <p className="hero-subheadline">
            ChainBrief helps crypto and Web3 projects increase visibility through
            media placements, sponsored content, banner campaigns, project
            listings, influencer outreach, AMAs, programmatic advertising and
            strategic launch support. Campaign plans are custom-scoped around
            placement, duration, format, and distribution scope.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/contact">
              Request Media Kit
            </Link>
            <Link className="button button-secondary" href="/contact">
              Start a Campaign
            </Link>
          </div>
        </div>
        <aside className="marketing-hero-panel">
          <span className="panel-label">Campaign mix</span>
          <strong>PR, paid media, listings, creators, AMAs and launch support.</strong>
          <div className="pulse-grid">
            <span>Audience</span>
            <strong>Crypto native</strong>
            <span>Format</span>
            <strong>Multi-channel</strong>
            <span>Goal</span>
            <strong>Visibility</strong>
          </div>
        </aside>
      </section>

      <section className="marketing-section">
        <BannerAd
          placement="leaderboard"
          className="section-placement"
          fallbackLabel="Leaderboard Banner"
        />

        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>Visibility Channels for Web3 Teams</h2>
        </div>
        <div className="marketing-grid">
          {services.map((service) => (
            <article className="marketing-card" key={service.title}>
              <span>{service.label}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <p className="eyebrow">Packages</p>
          <h2>Campaign Packages</h2>
        </div>
        <p className="section-intro">
          Packages are built around media visibility, sponsored coverage, launch
          support, community visibility, partner placements, and project
          discovery. Pricing is available on request after the campaign scope is
          defined.
        </p>
        <div className="package-grid">
          {packages.map((item) => (
            <article className="package-card" key={item.name}>
              <h2>{item.name}</h2>
              <strong>{item.action}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <p className="eyebrow">Use cases</p>
          <h2>Where ChainBrief Marketing Can Help</h2>
        </div>
        <div className="use-case-grid">
          {useCases.map((useCase) => (
            <span key={useCase}>{useCase}</span>
          ))}
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <p className="eyebrow">Process</p>
          <h2>How Campaigns Move From Brief to Market</h2>
        </div>
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <article className="process-card" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <p className="eyebrow">Beyond ChainBrief</p>
          <h2>Services Beyond ChainBrief</h2>
          <Link href="/advertise">On-site ads</Link>
        </div>
        <div className="use-case-grid">
          {beyondServices.map((service) => (
            <span key={service}>{service}</span>
          ))}
        </div>
      </section>

      <section className="cta-panel marketing-cta">
        <p className="eyebrow">Campaign planning</p>
        <h2>Ready to Build Visibility for Your Crypto Project?</h2>
        <p>
          Request a media kit or campaign proposal and the ChainBrief team will
          suggest the best mix of PR, banners, listings, influencers, AMAs and
          programmatic exposure. No fixed public packages are shown because each
          plan depends on placement mix, duration, creative format and
          distribution scope.
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
    </>
  );
}
