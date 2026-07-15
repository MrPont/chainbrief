import type { NewsFallbackImage } from "./news-image-resolver";

/*
 * Local-only fallback image library.
 *
 * Add optimized owned .webp files later under:
 * public/images/news-fallbacks/
 *
 * Suggested folders:
 * - public/images/news-fallbacks/general/
 * - public/images/news-fallbacks/markets/
 * - public/images/news-fallbacks/regulation/
 * - public/images/news-fallbacks/exchanges/
 * - public/images/news-fallbacks/bitcoin/
 * - public/images/news-fallbacks/ethereum/
 * - public/images/news-fallbacks/altcoins/
 * - public/images/news-fallbacks/defi/
 * - public/images/news-fallbacks/security/
 * - public/images/news-fallbacks/ai-tech/
 * - public/images/news-fallbacks/nft-gaming/
 *
 * Keep this config local. Do not query remote services and do not point these
 * records at third-party publisher images.
 */
const localNewsFallbackImages: NewsFallbackImage[] = [
  // Example for later, after the file exists:
  // {
  //   id: "general-crypto-1",
  //   title: "General Crypto 1",
  //   imageUrl: "/images/news-fallbacks/general/general-crypto-1.webp",
  //   category: "general",
  //   tags: ["crypto", "web3"],
  //   priority: 10,
  // },
];

export function getActiveNewsFallbackImages() {
  return localNewsFallbackImages;
}
