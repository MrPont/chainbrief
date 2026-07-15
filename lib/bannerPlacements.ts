export const BANNER_PLACEMENTS = {
  header: {
    maxWidth: 1200,
    aspectRatio: "1200 / 180",
  },
  homepage_top: {
    maxWidth: 1200,
    aspectRatio: "1200 / 180",
  },
  leaderboard: {
    maxWidth: 1200,
    aspectRatio: "1200 / 180",
  },
  sidebar: {
    maxWidth: 300,
    aspectRatio: "300 / 250",
  },
  article_sidebar: {
    maxWidth: 300,
    aspectRatio: "300 / 250",
  },
  article_inline: {
    maxWidth: 970,
    aspectRatio: "970 / 250",
  },
  article_inline_large: {
    maxWidth: 970,
    aspectRatio: "970 / 250",
  },
  article_inline_small: {
    maxWidth: 728,
    aspectRatio: "728 / 90",
  },
  homepage_mid: {
    maxWidth: 970,
    aspectRatio: "970 / 250",
  },
  footer: {
    maxWidth: 1200,
    aspectRatio: "1200 / 180",
  },
} as const;

export type BannerPlacementKey = keyof typeof BANNER_PLACEMENTS;

export function getBannerPlacementConfig(placement: string) {
  if (placement in BANNER_PLACEMENTS) {
    return BANNER_PLACEMENTS[placement as BannerPlacementKey];
  }

  return BANNER_PLACEMENTS.leaderboard;
}
