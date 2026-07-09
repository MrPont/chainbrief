import { fetchActiveBannerAd, type BannerPlacement } from "../lib/publicBanners";

type BannerAdProps = {
  placement: BannerPlacement;
  fallbackLabel?: string;
  fallbackSize?: string;
  variant?: "banner" | "box";
  className?: string;
};

export default async function BannerAd({
  placement,
  fallbackLabel = "Available placement",
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
      <section className={`ad-box ${className}`.trim()} aria-label="Advertisement">
        <span>{fallbackLabel}</span>
        {fallbackSize ? <strong>{fallbackSize}</strong> : null}
      </section>
    );
  }

  return (
    <section className={`ad-banner ${className}`.trim()} aria-label="Advertisement">
      <span>{fallbackLabel}</span>
    </section>
  );
}
