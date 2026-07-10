/* eslint-disable @next/next/no-img-element */
type ArticleCoverProps = {
  category: string;
  title: string;
  imageUrl?: string;
  isSponsored?: boolean;
  variant?: "card" | "hero";
};

const toneMatchers = [
  { tone: "bitcoin", terms: ["bitcoin", "btc"] },
  { tone: "ethereum", terms: ["ethereum", "eth"] },
  { tone: "defi", terms: ["defi", "lending", "liquidity", "dex"] },
  { tone: "regulation", terms: ["regulation", "policy", "stablecoin", "legal"] },
  { tone: "infrastructure", terms: ["infrastructure", "ai", "data", "node", "wallet"] },
  { tone: "markets", terms: ["market", "markets", "exchange", "trading", "unlock"] },
];

function getTone(category: string, title: string, isSponsored?: boolean) {
  if (isSponsored) {
    return "sponsored";
  }

  const searchable = `${category} ${title}`.toLowerCase();
  const match = toneMatchers.find((matcher) =>
    matcher.terms.some((term) => searchable.includes(term)),
  );

  return match?.tone || "default";
}

function getLabel(category: string, isSponsored?: boolean) {
  if (isSponsored) {
    return "Sponsored Brief";
  }

  return category?.trim() || "Editorial Brief";
}

export default function ArticleCover({
  category,
  title,
  imageUrl,
  isSponsored,
  variant = "card",
}: ArticleCoverProps) {
  if (imageUrl) {
    return (
      <div className={`article-cover article-cover-${variant} article-cover-uploaded`}>
        <img src={imageUrl} alt="" />
      </div>
    );
  }

  const tone = getTone(category, title, isSponsored);

  return (
    <div
      className={`article-cover article-cover-${variant} article-cover-fallback article-cover-${tone}`}
      aria-label={`${getLabel(category, isSponsored)} visual cover`}
      role="img"
    >
      <span className="article-cover-grid" />
      <span className="article-cover-mark" />
      <span className="article-cover-label">{getLabel(category, isSponsored)}</span>
      <strong>ChainBrief</strong>
      <span className="article-cover-signal" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}
