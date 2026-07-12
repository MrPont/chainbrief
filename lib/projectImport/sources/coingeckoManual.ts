import "server-only";

import type {
  ImportedProjectCandidate,
  ProjectImportOptions,
  ProjectImportSource,
} from "../types";
import { fetchCoinGeckoProjectDetails } from "./coingeckoDetails";

const COINGECKO_COIN_PAGE = "https://www.coingecko.com/en/coins";

function normalizeCoinGeckoId(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  try {
    const url = new URL(trimmedValue);
    const coinIndex = url.pathname
      .split("/")
      .filter(Boolean)
      .findIndex((segment) => segment.toLowerCase() === "coins");
    const id = coinIndex >= 0 ? url.pathname.split("/").filter(Boolean)[coinIndex + 1] : null;

    return id?.trim().toLowerCase() || null;
  } catch {
    return trimmedValue
      .replace(/^\/+|\/+$/g, "")
      .split("?")[0]
      .trim()
      .toLowerCase();
  }
}

export function parseCoinGeckoIds(input?: string) {
  const ids = (input || "")
    .split(/[\n,]/)
    .map(normalizeCoinGeckoId)
    .filter((id): id is string => Boolean(id && /^[a-z0-9-]+$/.test(id)));

  return Array.from(new Set(ids));
}

async function fetchManualCoinGeckoProjects(
  options?: ProjectImportOptions,
): Promise<ImportedProjectCandidate[]> {
  const ids = parseCoinGeckoIds(options?.manualCoinGeckoIds);

  if (ids.length === 0) {
    throw new Error(
      "Enter at least one CoinGecko coin ID or URL for manual import.",
    );
  }

  const projects: ImportedProjectCandidate[] = [];

  for (const id of ids.slice(0, 20)) {
    const details = await fetchCoinGeckoProjectDetails(id);

    if (!details.name) {
      projects.push({
        name: id,
        ticker: null,
        category: "Manual CoinGecko Import",
        websiteUrl: null,
        shortDescription: null,
        sourceName: "CoinGecko Manual",
        sourceUrl: `${COINGECKO_COIN_PAGE}/${id}`,
        externalId: id,
        importError:
          details.warning || `CoinGecko project details were not found for ${id}.`,
      });
      continue;
    }

    projects.push({
      name: details.name,
      ticker: details.ticker,
      category: "Manual CoinGecko Import",
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
      shortDescription:
        "Imported from CoinGecko Manual. Review website, socials, category and description before publishing.",
      sourceName: "CoinGecko Manual",
      sourceUrl: `${COINGECKO_COIN_PAGE}/${details.id || id}`,
      externalId: details.id || id,
    });
  }

  return projects;
}

export const coinGeckoManualProjectSource: ProjectImportSource = {
  id: "coingecko_manual_ids",
  name: "Manual CoinGecko ID Import",
  description:
    "Imports richer draft project metadata from manually entered CoinGecko coin IDs or CoinGecko coin URLs.",
  fetchProjects: fetchManualCoinGeckoProjects,
};
