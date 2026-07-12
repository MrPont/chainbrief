import "server-only";

type CoinGeckoDetailsResponse = {
  id?: string;
  name?: string;
  symbol?: string;
  description?: {
    en?: string;
  };
  links?: {
    homepage?: string[];
    blockchain_site?: string[];
    official_forum_url?: string[];
    chat_url?: string[];
    announcement_url?: string[];
    twitter_screen_name?: string;
    telegram_channel_identifier?: string;
    repos_url?: {
      github?: string[];
      bitbucket?: string[];
    };
    whitepaper?: string;
  };
  platforms?: Record<string, string>;
  detail_platforms?: Record<
    string,
    {
      contract_address?: string;
      decimal_place?: number | null;
    }
  >;
};

export type CoinGeckoProjectDetails = {
  id: string | null;
  name: string | null;
  ticker: string | null;
  websiteUrl: string | null;
  twitterUrl: string | null;
  telegramUrl: string | null;
  discordUrl: string | null;
  githubUrl: string | null;
  whitepaperUrl: string | null;
  explorerUrl: string | null;
  contractAddress: string | null;
  chain: string | null;
  importedDescription: string | null;
  importedLinksJson: Record<string, unknown> | null;
  warning: string | null;
};

const COINGECKO_COIN_URL = "https://api.coingecko.com/api/v3/coins";

function firstUrl(values?: string[]) {
  return values?.find((value) => value.trim().length > 0)?.trim() || null;
}

function asUrl(value?: string | null) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

function buildTwitterUrl(screenName?: string) {
  const name = screenName?.trim().replace(/^@/, "");

  return name ? `https://x.com/${name}` : null;
}

function buildTelegramUrl(identifier?: string) {
  const channel = identifier?.trim().replace(/^@/, "");

  return channel ? `https://t.me/${channel}` : null;
}

function findChatUrl(values: string[] | undefined, pattern: RegExp) {
  return values?.find((value) => pattern.test(value))?.trim() || null;
}

function getPrimaryPlatform(payload: CoinGeckoDetailsResponse) {
  const platformEntries = Object.entries(payload.platforms || {}).filter(
    ([platform, address]) => platform.trim().length > 0 && address.trim().length > 0,
  );

  if (platformEntries.length > 0) {
    return {
      chain: platformEntries[0][0],
      contractAddress: platformEntries[0][1],
    };
  }

  const detailEntries = Object.entries(payload.detail_platforms || {}).filter(
    ([platform, detail]) =>
      platform.trim().length > 0 && Boolean(detail.contract_address?.trim()),
  );

  if (detailEntries.length > 0) {
    return {
      chain: detailEntries[0][0],
      contractAddress: detailEntries[0][1].contract_address?.trim() || null,
    };
  }

  return {
    chain: null,
    contractAddress: null,
  };
}

function emptyDetails(warning: string | null): CoinGeckoProjectDetails {
  return {
    id: null,
    name: null,
    ticker: null,
    websiteUrl: null,
    twitterUrl: null,
    telegramUrl: null,
    discordUrl: null,
    githubUrl: null,
    whitepaperUrl: null,
    explorerUrl: null,
    contractAddress: null,
    chain: null,
    importedDescription: null,
    importedLinksJson: null,
    warning,
  };
}

export async function fetchCoinGeckoProjectDetails(
  coinId: string,
): Promise<CoinGeckoProjectDetails> {
  const apiKey = process.env.COINGECKO_API_KEY?.trim();
  const headers: Record<string, string> = {
    accept: "application/json",
  };

  if (apiKey) {
    headers["x-cg-demo-api-key"] = apiKey;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${COINGECKO_COIN_URL}/${coinId}`, {
      headers,
      signal: controller.signal,
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return emptyDetails(
        `CoinGecko detail request failed for ${coinId} with status ${response.status}.`,
      );
    }

    const payload = (await response.json()) as CoinGeckoDetailsResponse;
    const links = payload.links || {};
    const telegramFromChat = findChatUrl(links.chat_url, /t\.me|telegram/i);
    const { chain, contractAddress } = getPrimaryPlatform(payload);
    const selectedLinks = {
      homepage: links.homepage?.filter(Boolean) || [],
      blockchain_site: links.blockchain_site?.filter(Boolean) || [],
      chat_url: links.chat_url?.filter(Boolean) || [],
      announcement_url: links.announcement_url?.filter(Boolean) || [],
      twitter_screen_name: links.twitter_screen_name || null,
      telegram_channel_identifier: links.telegram_channel_identifier || null,
      github: links.repos_url?.github?.filter(Boolean) || [],
      whitepaper: links.whitepaper || null,
    };

    return {
      id: payload.id?.trim() || coinId,
      name: payload.name?.trim() || null,
      ticker: payload.symbol?.trim().toUpperCase() || null,
      websiteUrl: firstUrl(links.homepage),
      twitterUrl: buildTwitterUrl(links.twitter_screen_name),
      telegramUrl:
        buildTelegramUrl(links.telegram_channel_identifier) || asUrl(telegramFromChat),
      discordUrl: asUrl(findChatUrl(links.chat_url, /discord/i)),
      githubUrl: firstUrl(links.repos_url?.github),
      whitepaperUrl: asUrl(links.whitepaper),
      explorerUrl: firstUrl(links.blockchain_site),
      contractAddress,
      chain,
      importedDescription: payload.description?.en?.trim() || null,
      importedLinksJson: selectedLinks,
      warning: null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? `CoinGecko detail request timed out for ${coinId}.`
        : `CoinGecko detail request failed for ${coinId}.`;

    return emptyDetails(message);
  } finally {
    clearTimeout(timeout);
  }
}
