import Link from "next/link";
import { getBannerPlacementConfig } from "../lib/bannerPlacements";
import { fetchActiveBannerAd, type BannerPlacement } from "../lib/publicBanners";

type BannerAdProps = {
  placement: BannerPlacement;
  fallbackLabel?: string;
  fallbackSize?: string;
  variant?: "banner" | "box";
  className?: string;
};

const fallbackCopy: Record<
  BannerPlacement,
  {
    eyebrow: string;
    inventoryLabel: string;
    heading: string;
    text: string;
    cta: string;
    href: string;
    secondaryCta?: string;
    secondaryHref?: string;
  }
> = {
  header: {
    eyebrow: "Advertisement",
    inventoryLabel: "",
    heading: "",
    text: "",
    cta: "",
    href: "/contact",
  },
  homepage_top: {
    eyebrow: "Advertisement",
    inventoryLabel: "",
    heading: "",
    text: "",
    cta: "",
    href: "/contact",
  },
  homepage_mid: {
    eyebrow: "Featured Project Spotlight",
    inventoryLabel: "FEATURED PROJECT SPOTLIGHT",
    heading: "Project Visibility on ChainBrief",
    text: "Sponsored coverage and project placements for Web3 teams.",
    cta: "Request Placement",
    href: "/contact",
    secondaryCta: "Media Kit",
    secondaryHref: "/media-kit",
  },
  article_inline: {
    eyebrow: "Featured Project Spotlight",
    inventoryLabel: "FEATURED PROJECT SPOTLIGHT",
    heading: "Project Visibility on ChainBrief",
    text: "Sponsored coverage and project placements for Web3 teams.",
    cta: "Request Placement",
    href: "/contact",
    secondaryCta: "Media Kit",
    secondaryHref: "/media-kit",
  },
  article_inline_large: {
    eyebrow: "Featured Project Spotlight",
    inventoryLabel: "FEATURED PROJECT SPOTLIGHT",
    heading: "Project Visibility on ChainBrief",
    text: "Sponsored coverage and project placements for Web3 teams.",
    cta: "Request Placement",
    href: "/contact",
    secondaryCta: "Media Kit",
    secondaryHref: "/media-kit",
  },
  article_inline_small: {
    eyebrow: "Featured Project Spotlight",
    inventoryLabel: "FEATURED PROJECT SPOTLIGHT",
    heading: "Project Visibility on ChainBrief",
    text: "Sponsored coverage and project placements for Web3 teams.",
    cta: "Request Placement",
    href: "/contact",
    secondaryCta: "Media Kit",
    secondaryHref: "/media-kit",
  },
  article_sidebar: {
    eyebrow: "Partner Placement",
    inventoryLabel: "PARTNER PLACEMENT",
    heading: "Reach Crypto Readers",
    text: "Campaign options and media placements are available on request.",
    cta: "Media Kit",
    href: "/media-kit",
    secondaryCta: "Contact Us",
    secondaryHref: "/contact",
  },
  sidebar: {
    eyebrow: "Partner Placement",
    inventoryLabel: "PARTNER PLACEMENT",
    heading: "Reach Crypto Readers",
    text: "Campaign options and media placements are available on request.",
    cta: "Media Kit",
    href: "/media-kit",
    secondaryCta: "Contact Us",
    secondaryHref: "/contact",
  },
  footer: {
    eyebrow: "Campaign Options",
    inventoryLabel: "CAMPAIGN OPTIONS",
    heading: "Work With ChainBrief",
    text: "Media kit, sponsored articles and campaign options available on request.",
    cta: "Contact Us",
    href: "/contact",
    secondaryCta: "View Options",
    secondaryHref: "/advertise",
  },
  leaderboard: {
    eyebrow: "Advertisement",
    inventoryLabel: "",
    heading: "",
    text: "",
    cta: "",
    href: "/contact",
  },
};

const hiddenFallbackPlacements = new Set<BannerPlacement>([
  "header",
  "homepage_top",
  "leaderboard",
]);

const placementTone: Record<BannerPlacement, string> = {
  header: "media-kit",
  homepage_top: "media-kit",
  homepage_mid: "spotlight",
  article_inline: "spotlight",
  article_inline_large: "spotlight",
  article_inline_small: "spotlight",
  article_sidebar: "partner",
  sidebar: "partner",
  footer: "options",
  leaderboard: "media-kit",
};

export default async function BannerAd({
  placement,
  variant = "banner",
  className = "",
}: BannerAdProps) {
  const banner = await fetchActiveBannerAd(placement);

  if (banner) {
    const placementConfig = getBannerPlacementConfig(placement);
    const activeClassName = [
      variant === "box" ? "promo-panel" : "promo-slot",
      "media-placement-live",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <aside className={activeClassName} aria-label="Sponsored placement">
        <a href={banner.targetUrl} rel="noopener noreferrer sponsored" target="_blank">
          <span className="sr-only">Advertisement</span>
          <span
            className="media-placement-frame"
            style={{
              aspectRatio: placementConfig.aspectRatio,
              maxWidth: `${placementConfig.maxWidth}px`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Public ad creatives can be GIF, SVG, or advertiser-hosted assets. */}
            <img src={banner.imageUrl} alt={banner.title || "Advertisement"} loading="lazy" />
          </span>
        </a>
      </aside>
    );
  }

  if (hiddenFallbackPlacements.has(placement)) {
    return null;
  }

  if (variant === "box") {
    return (
      <FallbackBanner
        className={className}
        placement={placement}
        variant="box"
      />
    );
  }

  return (
    <FallbackBanner
      className={className}
      placement={placement}
      variant="banner"
    />
  );
}

function FallbackBanner({
  className,
  placement,
  variant,
}: {
  className: string;
  placement: BannerPlacement;
  variant: "banner" | "box";
}) {
  const copy = fallbackCopy[placement];
  const wrapperClassName = [
    variant === "box" ? "promo-panel" : "promo-slot",
    "campaign-slot",
    variant === "box" ? "campaign-slot-box" : "campaign-slot-wide",
    `campaign-slot-${placement.replace(/_/g, "-")}`,
    `campaign-slot-tone-${placementTone[placement]}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={wrapperClassName} aria-label="Sponsored placement">
      <div className="campaign-slot-copy">
        <span className="campaign-slot-eyebrow">{copy.eyebrow}</span>
        <span className="campaign-slot-label">{copy.inventoryLabel}</span>
        <h2>{copy.heading}</h2>
        <p>{copy.text}</p>
      </div>
      <div className="campaign-slot-actions">
        <Link className="campaign-slot-button" href={copy.href}>
          {copy.cta}
        </Link>
        {copy.secondaryCta && copy.secondaryHref ? (
          <Link className="campaign-slot-link" href={copy.secondaryHref}>
            {copy.secondaryCta}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
