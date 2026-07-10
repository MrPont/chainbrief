import "server-only";
import { marketMovers } from "./siteData";

const COINGECKO_MARKETS_URL = "https://api.coingecko.com/api/v3/coins/markets";
const MARKET_IDS = [
  "bitcoin",
  "ethereum",
  "solana",
  "binancecoin",
  "ripple",
  "cardano",
  "dogecoin",
  "chainlink",
  "arbitrum",
  "avalanche-2",
];

export type MarketAsset = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number | null;
  formattedPrice: string;
  marketCap: number | null;
  formattedMarketCap: string;
  marketCapRank: number | null;
  totalVolume: number | null;
  formattedVolume: string;
  priceChangePercentage24h: number | null;
  formattedChange24h: string;
  priceChangePercentage7d: number | null;
  formattedChange7d: string;
  lastUpdated: string | null;
  formattedLastUpdated: string;
  accent: "green" | "blue" | "violet" | "red";
};

export type MarketDataResult = {
  assets: MarketAsset[];
  isLive: boolean;
  source: "coingecko" | "sample";
};

type CoinGeckoMarketRow = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  last_updated: string | null;
};

const fallbackExtras = [
  {
    symbol: "LINK",
    name: "Chainlink",
    price: "$22.40",
    change: "+1.4%",
    cap: "$14B",
    accent: "green" as const,
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    price: "$1.28",
    change: "-0.9%",
    cap: "$5B",
    accent: "red" as const,
  },
];

function formatCurrency(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "N/A";
  }

  const maximumFractionDigits = value >= 1 ? 2 : 6;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);
}

function formatCompactCurrency(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "N/A";
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

function parseStaticCurrency(value: string) {
  const normalizedValue = value.replace(/[$,]/g, "").trim();
  const multiplier = normalizedValue.endsWith("T")
    ? 1_000_000_000_000
    : normalizedValue.endsWith("B")
      ? 1_000_000_000
      : normalizedValue.endsWith("M")
        ? 1_000_000
        : 1;
  const numericValue = Number.parseFloat(normalizedValue.replace(/[TBM]/g, ""));

  return Number.isNaN(numericValue) ? null : numericValue * multiplier;
}

function parseStaticPercent(value: string) {
  const numericValue = Number.parseFloat(value.replace("%", ""));
  return Number.isNaN(numericValue) ? null : numericValue;
}

function formatLastUpdated(value: string | null) {
  if (!value) {
    return "Sample";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalizeAccent(value: string): MarketAsset["accent"] {
  if (value === "green" || value === "blue" || value === "violet" || value === "red") {
    return value;
  }

  return "blue";
}

function mapCoinGeckoRow(row: CoinGeckoMarketRow, index: number): MarketAsset {
  const change24h = row.price_change_percentage_24h;
  const change7d = row.price_change_percentage_7d_in_currency ?? null;

  return {
    id: row.id,
    symbol: row.symbol.toUpperCase(),
    name: row.name,
    image: row.image,
    currentPrice: row.current_price,
    formattedPrice: formatCurrency(row.current_price),
    marketCap: row.market_cap,
    formattedMarketCap: formatCompactCurrency(row.market_cap),
    marketCapRank: row.market_cap_rank,
    totalVolume: row.total_volume,
    formattedVolume: formatCompactCurrency(row.total_volume),
    priceChangePercentage24h: change24h,
    formattedChange24h: formatPercent(change24h),
    priceChangePercentage7d: change7d,
    formattedChange7d: formatPercent(change7d),
    lastUpdated: row.last_updated,
    formattedLastUpdated: formatLastUpdated(row.last_updated),
    accent: change24h !== null && change24h < 0 ? "red" : index % 3 === 0 ? "green" : index % 3 === 1 ? "blue" : "violet",
  };
}

function getSampleMarketAssets(): MarketAsset[] {
  return [...marketMovers, ...fallbackExtras].map((coin, index) => {
    const price = parseStaticCurrency(coin.price);
    const marketCap = parseStaticCurrency(coin.cap);
    const change24h = parseStaticPercent(coin.change);

    return {
      id: coin.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      symbol: coin.symbol,
      name: coin.name,
      image: "",
      currentPrice: price,
      formattedPrice: coin.price,
      marketCap,
      formattedMarketCap: coin.cap,
      marketCapRank: index + 1,
      totalVolume: null,
      formattedVolume: "Sample",
      priceChangePercentage24h: change24h,
      formattedChange24h: coin.change,
      priceChangePercentage7d: null,
      formattedChange7d: "Sample",
      lastUpdated: null,
      formattedLastUpdated: "Sample",
      accent: normalizeAccent(coin.accent),
    };
  });
}

export async function getMarketData(): Promise<MarketDataResult> {
  const url = new URL(COINGECKO_MARKETS_URL);
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("ids", MARKET_IDS.join(","));
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", String(MARKET_IDS.length));
  url.searchParams.set("page", "1");
  url.searchParams.set("sparkline", "false");
  url.searchParams.set("price_change_percentage", "24h,7d");

  const headers: HeadersInit = {
    accept: "application/json",
  };

  if (process.env.COINGECKO_API_KEY) {
    headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
  }

  try {
    const response = await fetch(url, {
      headers,
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      console.error(`CoinGecko market request failed: ${response.status}`);
      return {
        assets: getSampleMarketAssets(),
        isLive: false,
        source: "sample",
      };
    }

    const data = (await response.json()) as CoinGeckoMarketRow[];

    if (!Array.isArray(data) || data.length === 0) {
      return {
        assets: getSampleMarketAssets(),
        isLive: false,
        source: "sample",
      };
    }

    return {
      assets: data.map(mapCoinGeckoRow),
      isLive: true,
      source: "coingecko",
    };
  } catch (error) {
    console.error("CoinGecko market request failed:", error);
    return {
      assets: getSampleMarketAssets(),
      isLive: false,
      source: "sample",
    };
  }
}
