import type { Metadata } from "next";
import Logo from "../../components/Logo";

export const metadata: Metadata = {
  title: "Brand",
  description:
    "ChainBrief brand system with the primary logo, icon mark, color palette, and usage examples.",
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
          A geometric crypto media mark combining a chain link, brief/news
          document, and market signal bars for a premium editorial finance feel.
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
          avatar, footer, and campaign materials. The chain element signals
          crypto infrastructure, the document shape signals news and research,
          and the rising bars signal market intelligence.
        </p>
      </section>
    </>
  );
}
