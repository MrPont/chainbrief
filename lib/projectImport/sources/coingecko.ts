import "server-only";

import type { ImportedProjectCandidate, ProjectImportSource } from "../types";

type CoinGeckoTrendingResponse = {
  coins?: Array<{
    item?: {
      id?: string;
      name?: string;
      symbol?: string;
      market_cap_rank?: number | null;
    };
  }>;
};

const COINGECKO_TRENDING_URL = "https://api.coingecko.com/api/v3/search/trending";

function getCoinGeckoHeaders() {
  const headers: Record<string, string> = {
    accept: "application/json",
  };

  if (process.env.COINGECKO_API_KEY) {
    headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
  }

  return headers;
}

function buildShortDescription(rank?: number | null) {
  if (!rank) {
    return "Imported factual metadata from CoinGecko trending projects. Review and replace with an original ChainBrief description before publishing.";
  }

  return `Imported factual metadata from CoinGecko trending projects. Market cap rank at import: #${rank}. Review and replace with an original ChainBrief description before publishing.`;
}

async function fetchCoinGeckoTrendingProjects(): Promise<ImportedProjectCandidate[]> {
  const response = await fetch(COINGECKO_TRENDING_URL, {
    headers: getCoinGeckoHeaders(),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as CoinGeckoTrendingResponse;

  return (payload.coins || [])
    .map((coin) => coin.item)
    .filter((item): item is NonNullable<typeof item> => Boolean(item?.id && item.name))
    .slice(0, 15)
    .map((item) => ({
      name: item.name?.trim() || "",
      ticker: item.symbol?.trim().toUpperCase() || null,
      category: "Market Discovery",
      websiteUrl: null,
      shortDescription: buildShortDescription(item.market_cap_rank),
      sourceName: "CoinGecko",
      sourceUrl: `https://www.coingecko.com/en/coins/${item.id}`,
      externalId: item.id || null,
    }))
    .filter((project) => project.name.length > 0);
}

export const coinGeckoProjectSource: ProjectImportSource = {
  id: "coingecko",
  name: "CoinGecko Trending",
  description:
    "Imports factual metadata from CoinGecko trending coins as draft project profiles for manual review.",
  fetchProjects: fetchCoinGeckoTrendingProjects,
};
