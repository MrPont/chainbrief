import type { Metadata } from "next";
import Logo from "../../components/Logo";

export const metadata: Metadata = {
  title: "Brand",
  description:
    "ChainBrief brand system with the primary logo, icon mark, color palette, and usage examples.",
  alternates: {
    canonical: "/brand",
  },
  openGraph: {
    title: "ChainBrief Brand",
    description:
      "ChainBrief logo, icon mark, color palette and usage guidance.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainBrief Brand",
    description:
      "ChainBrief logo, icon mark, color palette and usage guidance.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

const colors = [
  { name: "Signal Blue", value: "#38bdf8" },
  { name: "Market Green", value: "#34d399" },
  { name: "Brief Violet", value: "#a78bfa" },
  { name: "News White", value: "#f8fafc" },
  { name: "Chain Black", value: "#05070b" },
];

export default function BrandPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Brand system</p>
        <h1>ChainBrief Logo</h1>
        <p>
          A text-first crypto media wordmark with a compact CB monogram for
          favicon, social avatar, admin and small-space usage.
        </p>
      </section>

      <section className="brand-showcase-grid">
        <article className="brand-showcase-card">
          <span className="panel-label">Primary full logo</span>
          <div className="brand-logo-stage">
            <Logo size="lg" />
          </div>
        </article>

        <article className="brand-showcase-card">
          <span className="panel-label">Icon mark</span>
          <div className="brand-logo-stage brand-icon-stage">
            <Logo variant="icon" size="lg" />
          </div>
        </article>

        <article className="brand-showcase-card">
          <span className="panel-label">Favicon preview</span>
          <div className="brand-logo-stage brand-favicon-stage">
            <Logo variant="icon" size="sm" />
            <Logo variant="icon" size="md" />
            <Logo variant="icon" size="lg" />
          </div>
        </article>

        <article className="brand-showcase-card brand-dark-sample">
          <span className="panel-label">Dark background</span>
          <div className="brand-logo-stage">
            <Logo size="lg" />
          </div>
        </article>

        <article className="brand-showcase-card brand-light-sample">
          <span className="panel-label">Light background</span>
          <div className="brand-logo-stage">
            <Logo size="lg" />
          </div>
        </article>
      </section>

      <section className="brand-section">
        <div className="section-heading">
          <p className="eyebrow">Palette</p>
          <h2>ChainBrief Colors</h2>
        </div>
        <div className="palette-grid">
          {colors.map((color) => (
            <article className="palette-card" key={color.value}>
              <span style={{ background: color.value }} />
              <h3>{color.name}</h3>
              <p>{color.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="text-panel brand-description-panel">
        <p>
          The ChainBrief mark is built to work across the header, favicon, social
          avatar, footer, and campaign materials. The wordmark carries the main
          publication identity, while the compact CB tile gives the brand a
          recognizable shorthand for small surfaces.
        </p>
      </section>

      <section className="brand-section">
        <div className="section-heading">
          <p className="eyebrow">Usage notes</p>
          <h2>How to Use the Logo</h2>
        </div>
        <div className="marketing-grid compact-marketing-grid">
          <article className="marketing-card">
            <span>Primary</span>
            <h3>Use the full logo for navigation and media kits</h3>
            <p>
              The full lockup pairs the mark with the ChainBrief wordmark for
              maximum recognition.
            </p>
          </article>
          <article className="marketing-card">
            <span>Icon</span>
            <h3>Use the mark for favicons and social avatars</h3>
            <p>
              The simplified symbol stays readable at small sizes and preserves
              the CB monogram without extra chart, circuit, or decorative detail.
            </p>
          </article>
          <article className="marketing-card">
            <span>Contrast</span>
            <h3>Prefer dark or high-contrast backgrounds</h3>
            <p>
              The blue, green and violet accents are designed for near-black
              fintech surfaces and clean light contexts.
            </p>
          </article>
          <article className="marketing-card">
            <span>Spacing</span>
            <h3>Keep the icon clear of dense UI</h3>
            <p>
              Allow breathing room around the mark so the monogram stays crisp
              and the wordmark remains the primary identity.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
