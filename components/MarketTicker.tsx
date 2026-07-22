"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MarketTickerAsset } from "../lib/marketTicker";

type MarketTickerProps = {
  assets: MarketTickerAsset[];
  isLive: boolean;
};

function getMovement(asset: MarketTickerAsset) {
  const change = asset.priceChangePercentage24h;

  if (change === null) {
    return {
      className: "is-neutral",
      indicator: "",
      label: "24 hour change unavailable",
    };
  }

  if (change < 0) {
    return {
      className: "is-down",
      indicator: "",
      label: "down",
    };
  }

  if (change > 0) {
    return {
      className: "is-up",
      indicator: "",
      label: "up",
    };
  }

  return {
    className: "is-neutral",
    indicator: "",
    label: "flat",
  };
}

export default function MarketTicker({ assets, isLive }: MarketTickerProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || assets.length === 0) {
    return null;
  }

  const tickerItems = [...assets, ...assets];

  return (
    <aside
      aria-label={`Crypto market ticker using ${isLive ? "cached live" : "sample"} market data`}
      className="market-ticker"
    >
      <div className="market-ticker-track">
        {tickerItems.map((asset, index) => {
          const movement = getMovement(asset);

          return (
            <Link
              aria-label={`${asset.name} ${asset.formattedPrice}, ${movement.label} ${asset.formattedChange24h} over 24 hours`}
              className="market-ticker-item"
              href="/markets"
              key={`${asset.id}-${index}`}
            >
              <strong>{asset.symbol}</strong>
              <span>{asset.formattedPrice}</span>
              <em className={movement.className}>
                {movement.indicator}
                {asset.formattedChange24h}
              </em>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
