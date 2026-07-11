import Link from "next/link";
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
    eyebrow: "Header Banner",
    inventoryLabel: "",
    heading: "",
    text: "",
    cta: "",
    href: "/contact",
  },
  homepage_top: {
    eyebrow: "Homepage Top Banner",
    inventoryLabel: "",
    heading: "",
    text: "",
    cta: "",
    href: "/contact",
  },
  homepage_mid: {
    eyebrow: "Homepage Mid Banner",
    inventoryLabel: "FEATURED PROJECT SPOTLIGHT",
    heading: "Project Visibility on ChainBrief",
    text: "Sponsored coverage and project placements for Web3 teams.",
    cta: "Request Placement",
    href: "/contact",
    secondaryCta: "Media Kit",
    secondaryHref: "/media-kit",
  },
  article_inline: {
    eyebrow: "Article Inline Banner",
    inventoryLabel: "FEATURED PROJECT SPOTLIGHT",
    heading: "Project Visibility on ChainBrief",
    text: "Sponsored coverage and project placements for Web3 teams.",
    cta: "Request Placement",
    href: "/contact",
    secondaryCta: "Media Kit",
    secondaryHref: "/media-kit",
  },
  article_sidebar: {
    eyebrow: "Article Sidebar Banner",
    inventoryLabel: "PARTNER PLACEMENT",
    heading: "Reach Crypto Readers",
    text: "Campaign options and media placements are available on request.",
    cta: "Media Kit",
    href: "/media-kit",
    secondaryCta: "Contact Us",
    secondaryHref: "/contact",
  },
  sidebar: {
    eyebrow: "Sidebar Banner",
    inventoryLabel: "PARTNER PLACEMENT",
    heading: "Reach Crypto Readers",
    text: "Campaign options and media placements are available on request.",
    cta: "Media Kit",
    href: "/media-kit",
    secondaryCta: "Contact Us",
    secondaryHref: "/contact",
  },
  footer: {
    eyebrow: "Footer Banner",
    inventoryLabel: "CAMPAIGN OPTIONS",
    heading: "Work With ChainBrief",
    text: "Media kit, sponsored articles and campaign options available on request.",
    cta: "Contact Us",
    href: "/contact",
    secondaryCta: "View Options",
    secondaryHref: "/advertise",
  },
  leaderboard: {
    eyebrow: "Leaderboard Banner",
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
  article_sidebar: "partner",
  sidebar: "partner",
  footer: "options",
  leaderboard: "media-kit",
};

export default async function BannerAd({
  placement,
  fallbackLabel,
  fallbackSize,
  variant = "banner",
  className = "",
}: BannerAdProps) {
  const banner = await fetchActiveBannerAd(placement);

  if (banner) {
    const activeClassName = [
      variant === "box" ? "promo-panel" : "promo-slot",
      "media-placement-live",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <aside className={activeClassName} aria-label={`Sponsored placement: ${banner.title}`}>
        <a href={banner.targetUrl}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Ad creatives can come from arbitrary advertiser/CDN domains. */}
          <img src={banner.imageUrl} alt={banner.title} />
          <span>{banner.advertiserName}</span>
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
        fallbackLabel={fallbackLabel}
        fallbackSize={fallbackSize}
        placement={placement}
        variant="box"
      />
    );
  }

  return (
    <FallbackBanner
      className={className}
      fallbackLabel={fallbackLabel}
      fallbackSize={fallbackSize}
      placement={placement}
      variant="banner"
    />
  );
}

function FallbackBanner({
  className,
  fallbackLabel,
  fallbackSize,
  placement,
  variant,
}: {
  className: string;
  fallbackLabel?: string;
  fallbackSize?: string;
  placement: BannerPlacement;
  variant: "banner" | "box";
}) {
  const copy = fallbackCopy[placement];
  const eyebrow =
    !fallbackLabel || fallbackLabel === "Available placement"
      ? copy.eyebrow
      : fallbackLabel;
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
    <section className={wrapperClassName} aria-label={`${eyebrow} sponsored placement`}>
      <div className="campaign-slot-copy">
        <span className="campaign-slot-eyebrow">{eyebrow}</span>
        <span className="campaign-slot-label">{copy.inventoryLabel}</span>
        <h2>{copy.heading}</h2>
        <p>{copy.text}</p>
        {fallbackSize ? <strong className="campaign-slot-size">{fallbackSize}</strong> : null}
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
