import "server-only";

import type { ImportedProjectCandidate, ProjectImportSource } from "../types";
import { fetchCoinGeckoProjectDetails } from "./coingeckoDetails";

type CoinGeckoRecentlyAddedCoin = {
  id?: string;
  coin_id?: string;
  name?: string;
  symbol?: string;
  ticker?: string;
};

type CoinGeckoRecentlyAddedResponse =
  | CoinGeckoRecentlyAddedCoin[]
  | {
      coins?: CoinGeckoRecentlyAddedCoin[];
      data?: CoinGeckoRecentlyAddedCoin[];
    };

const COINGECKO_RECENTLY_ADDED_URL =
  "https://pro-api.coingecko.com/api/v3/coins/list/new";
const COINGECKO_NEW_COINS_PAGE =
  "https://www.coingecko.com/en/new-cryptocurrencies";

function getCoinGeckoProApiKey() {
  const apiKey = process.env.COINGECKO_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "CoinGecko API key is missing. Add COINGECKO_API_KEY to environment variables.",
    );
  }

  return apiKey;
}

function getCoins(payload: CoinGeckoRecentlyAddedResponse) {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.coins || payload.data || [];
}

function getCoinId(coin: CoinGeckoRecentlyAddedCoin) {
  return coin.id?.trim() || coin.coin_id?.trim() || null;
}

function getTicker(coin: CoinGeckoRecentlyAddedCoin) {
  return coin.symbol?.trim().toUpperCase() || coin.ticker?.trim().toUpperCase() || null;
}

async function fetchCoinGeckoRecentlyAddedProjects(): Promise<
  ImportedProjectCandidate[]
> {
  const response = await fetch(COINGECKO_RECENTLY_ADDED_URL, {
    headers: {
      accept: "application/json",
      "x-cg-pro-api-key": getCoinGeckoProApiKey(),
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko Recently Added request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as CoinGeckoRecentlyAddedResponse;

  const baseProjects = getCoins(payload)
    .filter((coin) => Boolean(coin.name?.trim()))
    .slice(0, 20)
    .map((coin) => {
      const coinId = getCoinId(coin);

      return {
        name: coin.name?.trim() || "",
        ticker: getTicker(coin),
        category: "Recently Added",
        websiteUrl: null,
        shortDescription:
          "Recently added on CoinGecko. Review project website, category and official links before publishing.",
        sourceName: "CoinGecko Recently Added",
        sourceUrl: coinId
          ? `https://www.coingecko.com/en/coins/${coinId}`
          : COINGECKO_NEW_COINS_PAGE,
        externalId: coinId,
      };
    })
    .filter((project) => project.name.length > 0);

  return Promise.all(
    baseProjects.map(async (project) => {
      if (!project.externalId) {
        return project;
      }

      const details = await fetchCoinGeckoProjectDetails(project.externalId);

      return {
        ...project,
        websiteUrl: details.websiteUrl,
        twitterUrl: details.twitterUrl,
        telegramUrl: details.telegramUrl,
        discordUrl: details.discordUrl,
        githubUrl: details.githubUrl,
        whitepaperUrl: details.whitepaperUrl,
        explorerUrl: details.explorerUrl,
        contractAddress: details.contractAddress,
        chain: details.chain,
        importedDescription: details.importedDescription,
        importedLinksJson: details.importedLinksJson,
        detailWarning: details.warning,
      };
    }),
  );
}

export const coinGeckoRecentlyAddedProjectSource: ProjectImportSource = {
  id: "coingecko_recently_added",
  name: "CoinGecko Recently Added",
  description:
    "Imports recently added CoinGecko projects as draft profiles for manual review. Requires COINGECKO_API_KEY.",
  fetchProjects: fetchCoinGeckoRecentlyAddedProjects,
};
