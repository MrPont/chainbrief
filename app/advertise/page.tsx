import Link from "next/link";
import PageHero from "../../components/PageHero";

const packages = [
  {
    name: "Banner Ads",
    description: "High-visibility placements across homepage, category pages, and market pages.",
  },
  {
    name: "Sponsored Articles",
    description: "Clearly labeled partner articles written for crypto-native readers.",
  },
  {
    name: "Featured Project Listings",
    description: "Premium visibility inside rankings and project discovery sections.",
  },
  {
    name: "Newsletter Sponsorship",
    description: "Dedicated brand placement in future ChainBrief email briefings.",
  },
];

export default function AdvertisePage() {
  return (
    <>
      <PageHero
        eyebrow="Reach crypto readers"
        title="Advertise With ChainBrief"
        description="Promote your exchange, protocol, wallet, fund, infrastructure product, or Web3 campaign to an English-language crypto audience."
      />

      <section className="package-grid">
        {packages.map((item) => (
          <article className="package-card" key={item.name}>
            <h2>{item.name}</h2>
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
    </>
  );
}
