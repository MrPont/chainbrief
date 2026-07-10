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
    inventoryLabel: "Premium Placement",
    heading: "Your Ad Could Be Here",
    text: "Promote your crypto project, exchange, token, app or campaign to the ChainBrief audience.",
    cta: "Advertise with ChainBrief",
    href: "/advertise",
    secondaryCta: "Get Media Kit",
    secondaryHref: "/media-kit",
  },
  homepage_top: {
    eyebrow: "Homepage Top Banner",
    inventoryLabel: "Premium Placement",
    heading: "Your Ad Could Be Here",
    text: "Promote your crypto project, exchange, token, app or campaign to the ChainBrief audience.",
    cta: "Advertise with ChainBrief",
    href: "/advertise",
    secondaryCta: "Get Media Kit",
    secondaryHref: "/media-kit",
  },
  homepage_mid: {
    eyebrow: "Homepage Mid Banner",
    inventoryLabel: "Campaign Slot",
    heading: "Reach Crypto Readers, Traders and Web3 Projects",
    text: "Put your brand inside ChainBrief market coverage, project rankings and editorial discovery.",
    cta: "View Ad Options",
    href: "/advertise",
    secondaryCta: "Media Kit",
    secondaryHref: "/media-kit",
  },
  article_inline: {
    eyebrow: "Article Inline Banner",
    inventoryLabel: "Sponsored Placement",
    heading: "Sponsor This Article Area",
    text: "Show your project to readers already engaged with crypto news and market content.",
    cta: "Get Media Kit",
    href: "/media-kit",
    secondaryCta: "Advertise",
    secondaryHref: "/advertise",
  },
  article_sidebar: {
    eyebrow: "Article Sidebar Banner",
    inventoryLabel: "Sidebar Ad",
    heading: "Reach Active Crypto Readers",
    text: "Place your brand next to market coverage, project rankings and editorial content.",
    cta: "View Ad Options",
    href: "/advertise",
    secondaryCta: "Media Kit",
    secondaryHref: "/media-kit",
  },
  sidebar: {
    eyebrow: "Sidebar Banner",
    inventoryLabel: "Sidebar Ad",
    heading: "Reach Active Crypto Readers",
    text: "Place your brand next to market coverage, project rankings and editorial content.",
    cta: "View Ad Options",
    href: "/advertise",
    secondaryCta: "Media Kit",
    secondaryHref: "/media-kit",
  },
  footer: {
    eyebrow: "Footer Banner",
    inventoryLabel: "Always-On Placement",
    heading: "Advertise on ChainBrief",
    text: "Keep your project visible across crypto news, rankings and marketing service pages.",
    cta: "Advertise with ChainBrief",
    href: "/advertise",
    secondaryCta: "Media Kit",
    secondaryHref: "/media-kit",
  },
  leaderboard: {
    eyebrow: "Leaderboard Banner",
    inventoryLabel: "Leaderboard",
    heading: "This Space Is Available for Advertising",
    text: "Banner campaigns, sponsored coverage, listings and launch visibility for Web3 brands.",
    cta: "Start a Campaign",
    href: "/advertise",
    secondaryCta: "Get Media Kit",
    secondaryHref: "/media-kit",
  },
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
      variant === "box" ? "ad-box" : "ad-banner",
      "banner-ad-live",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <aside className={activeClassName} aria-label={`Advertisement: ${banner.title}`}>
        <a href={banner.targetUrl}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Ad creatives can come from arbitrary advertiser/CDN domains. */}
          <img src={banner.imageUrl} alt={banner.title} />
          <span>{banner.advertiserName}</span>
        </a>
      </aside>
    );
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
  const label =
    !fallbackLabel || fallbackLabel === "Available placement"
      ? copy.inventoryLabel
      : fallbackLabel;
  const wrapperClassName = [
    variant === "box" ? "ad-box" : "ad-banner",
    "ad-fallback",
    variant === "box" ? "ad-fallback-box" : "ad-fallback-wide",
    `ad-fallback-${placement.replace(/_/g, "-")}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={wrapperClassName} aria-label={`${copy.eyebrow} advertisement`}>
      <div className="ad-fallback-copy">
        <span className="ad-fallback-eyebrow">{copy.eyebrow}</span>
        <span className="ad-fallback-label">{label}</span>
        <h2>{copy.heading}</h2>
        <p>{copy.text}</p>
        {fallbackSize ? <strong className="ad-fallback-size">{fallbackSize}</strong> : null}
      </div>
      <div className="ad-fallback-actions">
        <Link className="ad-fallback-button" href={copy.href}>
          {copy.cta}
        </Link>
        {copy.secondaryCta && copy.secondaryHref ? (
          <Link className="ad-fallback-link" href={copy.secondaryHref}>
            {copy.secondaryCta}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
