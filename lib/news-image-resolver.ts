export type NewsFallbackImage = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  tags: string[];
  priority: number;
};

export type ArticleImageResolution = {
  imageUrl: string;
  source: "featured" | "tag-fallback" | "category-fallback" | "general-fallback";
  fallbackImageId?: string;
  altText: string;
};

const GENERAL_CATEGORY = "general";

export const NEWS_FALLBACK_CATEGORIES = [
  GENERAL_CATEGORY,
  "markets",
  "regulation",
  "exchanges",
  "bitcoin",
  "ethereum",
  "altcoins",
  "defi",
  "security",
  "ai-tech",
  "nft-gaming",
] as const;

const categoryAliases: Record<string, string> = {
  general: "general",
  generalcrypto: "general",
  crypto: "general",
  web3: "general",
  markets: "markets",
  market: "markets",
  trading: "markets",
  liquidity: "markets",
  bitcoin: "bitcoin",
  btc: "bitcoin",
  ethereum: "ethereum",
  eth: "ethereum",
  altcoin: "altcoins",
  altcoins: "altcoins",
  exchange: "exchanges",
  exchanges: "exchanges",
  cex: "exchanges",
  binance: "exchanges",
  coinbase: "exchanges",
  defi: "defi",
  regulation: "regulation",
  regulatory: "regulation",
  policy: "regulation",
  sec: "regulation",
  legal: "regulation",
  security: "security",
  hack: "security",
  exploit: "security",
  ai: "ai-tech",
  aicrypto: "ai-tech",
  aitech: "ai-tech",
  artificialintelligence: "ai-tech",
  infrastructure: "ai-tech",
  tech: "ai-tech",
  technology: "ai-tech",
  nft: "nft-gaming",
  nfts: "nft-gaming",
  nftgaming: "nft-gaming",
  gaming: "nft-gaming",
  gamefi: "nft-gaming",
};

function key(value?: string | null) {
  return (value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function normalizeCategory(value?: string | null) {
  return categoryAliases[key(value)] || GENERAL_CATEGORY;
}

function stableHash(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function chooseStableImage(images: NewsFallbackImage[], seed: string) {
  if (images.length === 0) {
    return null;
  }

  const sortedImages = [...images].sort((first, second) => {
    if (second.priority !== first.priority) {
      return second.priority - first.priority;
    }

    return first.id.localeCompare(second.id);
  });
  const topPriority = sortedImages[0].priority;
  const priorityPool = sortedImages.filter((image) => image.priority === topPriority);
  const index = stableHash(seed) % priorityPool.length;

  return priorityPool[index];
}

function imagesForCategory(images: NewsFallbackImage[], category: string) {
  const target = normalizeCategory(category);

  return images.filter((image) => normalizeCategory(image.category) === target);
}

function imagesForTag(images: NewsFallbackImage[], tag: string) {
  const tagKey = key(tag);

  return images.filter((image) =>
    image.tags.some((fallbackTag) => key(fallbackTag) === tagKey),
  );
}

function buildFallbackResult(
  image: NewsFallbackImage | null,
  source: ArticleImageResolution["source"],
) {
  if (!image) {
    return null;
  }

  return {
    imageUrl: image.imageUrl,
    source,
    fallbackImageId: image.id,
    altText: `${image.title} editorial cover`,
  };
}

export function resolveArticleImage({
  articleId,
  slug,
  featuredImageUrl,
  category,
  tags,
  fallbackImages,
}: {
  articleId?: string;
  slug: string;
  featuredImageUrl?: string;
  category?: string;
  tags?: string[];
  fallbackImages: NewsFallbackImage[];
}): ArticleImageResolution | null {
  const featuredImage = featuredImageUrl?.trim();

  if (featuredImage) {
    return {
      imageUrl: featuredImage,
      source: "featured",
      altText: "",
    };
  }

  const seed = articleId || slug;

  for (const tag of tags || []) {
    const exactTagMatch = chooseStableImage(imagesForTag(fallbackImages, tag), seed);

    if (exactTagMatch) {
      return buildFallbackResult(exactTagMatch, "tag-fallback");
    }

    const tagCategoryMatch = chooseStableImage(
      imagesForCategory(fallbackImages, normalizeCategory(tag)),
      seed,
    );

    if (tagCategoryMatch) {
      return buildFallbackResult(tagCategoryMatch, "tag-fallback");
    }
  }

  const categoryMatch = chooseStableImage(
    imagesForCategory(fallbackImages, normalizeCategory(category)),
    seed,
  );

  if (categoryMatch) {
    return buildFallbackResult(categoryMatch, "category-fallback");
  }

  return buildFallbackResult(
    chooseStableImage(imagesForCategory(fallbackImages, GENERAL_CATEGORY), seed),
    "general-fallback",
  );
}
