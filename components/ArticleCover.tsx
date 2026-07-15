/* eslint-disable @next/next/no-img-element */
type ArticleCoverProps = {
  category: string;
  title: string;
  imageUrl?: string;
  resolvedImageAlt?: string;
  resolvedImageUrl?: string;
  isImported?: boolean;
  isSponsored?: boolean;
  variant?: "card" | "hero";
};

const toneMatchers = [
  { tone: "bitcoin", terms: ["bitcoin", "btc"] },
  { tone: "ethereum", terms: ["ethereum", "eth", "ether"] },
  { tone: "xrp", terms: ["xrp", "ripple"] },
  { tone: "regulation", terms: ["regulation", "policy", "sec", "government", "legal"] },
  { tone: "defi", terms: ["defi", "lending", "liquidity", "dex", "protocol", "yield"] },
  {
    tone: "infrastructure",
    terms: ["infrastructure", "ai", "data", "node", "wallet", "rollup", "scaling", "network"],
  },
  { tone: "markets", terms: ["market", "markets", "exchange", "trading", "unlock"] },
];

function getTone(category: string, title: string, isSponsored?: boolean) {
  if (isSponsored) {
    return "sponsored";
  }

  const searchable = `${title} ${category}`.toLowerCase();
  const match = toneMatchers.find((matcher) =>
    matcher.terms.some((term) => new RegExp(`(^|[^a-z0-9])${term}([^a-z0-9]|$)`).test(searchable)),
  );

  return match?.tone || "default";
}

function getCoverCopy(tone: string) {
  const coverCopy: Record<string, { label: string; headline: string }> = {
    bitcoin: { label: "BITCOIN", headline: "Market Pulse" },
    ethereum: { label: "ETHEREUM", headline: "Network Brief" },
    xrp: { label: "XRP", headline: "Liquidity Watch" },
    defi: { label: "DEFI", headline: "Protocol Brief" },
    regulation: { label: "POLICY", headline: "Regulation Watch" },
    infrastructure: { label: "INFRASTRUCTURE", headline: "Data Layer" },
    markets: { label: "MARKETS", headline: "Market Signal" },
    sponsored: { label: "SPONSORED", headline: "Partner Brief" },
    default: { label: "CHAINBRIEF BRIEF", headline: "Editorial Brief" },
  };

  return coverCopy[tone] || coverCopy.default;
}

function isOwnedMediaUrl(imageUrl: string) {
  const trimmedUrl = imageUrl.trim();

  if (!trimmedUrl) {
    return false;
  }

  if (trimmedUrl.startsWith("/")) {
    return true;
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "chainbrief-media";
    const isSupabaseStoragePath = parsedUrl.pathname.includes(
      `/storage/v1/object/public/${bucketName}/`,
    );

    if (!isSupabaseStoragePath) {
      return false;
    }

    if (!supabaseUrl) {
      return parsedUrl.hostname.endsWith(".supabase.co");
    }

    return parsedUrl.hostname === new URL(supabaseUrl).hostname;
  } catch {
    return false;
  }
}

export default function ArticleCover({
  category,
  title,
  imageUrl,
  resolvedImageAlt,
  resolvedImageUrl,
  isImported,
  isSponsored,
  variant = "card",
}: ArticleCoverProps) {
  if (resolvedImageUrl) {
    return (
      <div className={`article-cover article-cover-${variant} article-cover-uploaded`}>
        <img src={resolvedImageUrl} alt={resolvedImageAlt || ""} />
      </div>
    );
  }

  const canShowImage = imageUrl && (!isImported || isOwnedMediaUrl(imageUrl));

  if (canShowImage) {
    return (
      <div className={`article-cover article-cover-${variant} article-cover-uploaded`}>
        <img src={imageUrl} alt="" />
      </div>
    );
  }

  const tone = getTone(category, title, isSponsored);
  const coverCopy = getCoverCopy(tone);

  return (
    <div
      className={`article-cover article-cover-${variant} article-cover-fallback article-cover-${tone}`}
      aria-label={`${coverCopy.label} visual cover`}
      role="img"
    >
      <span className="article-cover-grid" />
      <span className="article-cover-mark" />
      <span className="article-cover-motif" aria-hidden="true" />
      <span className="article-cover-label">{coverCopy.label}</span>
      <strong>{coverCopy.headline}</strong>
      <span className="article-cover-signal" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}
