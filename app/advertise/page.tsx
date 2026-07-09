import Link from "next/link";
import PageHero from "../../components/PageHero";
import { sponsorPackages } from "../../lib/siteData";

export default function AdvertisePage() {
  return (
    <>
      <PageHero
        eyebrow="Reach crypto readers"
        title="Advertise With ChainBrief"
        description="Promote your exchange, protocol, wallet, fund, infrastructure product, or Web3 campaign to an English-language crypto audience."
      />

      <section className="package-grid">
        {sponsorPackages.map((item) => (
          <article className="package-card" key={item.name}>
            <h2>{item.name}</h2>
            <strong>{item.price}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="cta-panel">
        <p className="eyebrow">Media kit</p>
        <h2>Plan your next campaign with ChainBrief</h2>
        <p>
          Share your goals, target audience, and timeline. The advertising team
          will prepare package options and sample placements.
        </p>
        <Link className="button button-primary" href="/contact">
          Contact Advertising
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
          Explore Marketing Services
        </Link>
      </section>
    </>
  );
}
