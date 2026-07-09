export const SITE_URL = "https://chainbrief.example";

export type NewsArticle = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  contentSections: {
    heading: string;
    body: string;
  }[];
  author: string;
  sourceLabel: string;
  readingTime: string;
  publishedDate: string;
  tags: string[];
  relatedAsset?: string;
  isSponsored: boolean;
  sponsorName?: string;
  originalSourceUrl?: string;
  impact: string;
};

export const latestNews: NewsArticle[] = [
  {
    slug: "bitcoin-market-structure-liquidity-zones",
    category: "Bitcoin",
    title: "Bitcoin Holds Key Support as Traders Watch Liquidity Zones",
    excerpt:
      "Analysts are tracking spot demand, funding rates, and ETF flows as Bitcoin consolidates near a major technical level.",
    contentSections: [
      {
        heading: "Liquidity defines the range",
        body:
          "Bitcoin is trading inside a compressed range where order book depth, spot ETF flows, and derivatives positioning are giving desks a clearer map of near-term risk. The most important signal is not a single price level, but whether buyers keep defending dips with real spot demand rather than short-lived leverage.",
      },
      {
        heading: "Derivatives remain active",
        body:
          "Funding rates have cooled from recent peaks, but open interest remains large enough to amplify moves in either direction. That leaves the market vulnerable to fast liquidations if price breaks below the current support band or squeezes above a cluster of short positions.",
      },
      {
        heading: "What traders are watching",
        body:
          "Market participants are focused on ETF creations, stablecoin liquidity, and whether long-term holders continue distributing into strength. A decisive move above resistance would likely need rising volume and broad participation from majors, not just Bitcoin alone.",
      },
    ],
    author: "Maya Collins",
    sourceLabel: "ChainBrief Markets Desk",
    readingTime: "18 min read",
    publishedDate: "2026-07-09",
    tags: ["Bitcoin", "Market structure", "ETF flows", "Liquidity"],
    relatedAsset: "BTC",
    isSponsored: false,
    impact: "Market structure",
  },
  {
    slug: "ethereum-scaling-roadmap-rollup-efficiency",
    category: "Ethereum",
    title: "Ethereum Scaling Roadmap Puts Rollup Efficiency Back in Focus",
    excerpt:
      "Protocol teams are prioritizing rollup costs, data availability, and wallet experience as Ethereum infrastructure matures.",
    contentSections: [
      {
        heading: "Scaling shifts from theory to operations",
        body:
          "Ethereum's next scaling phase is increasingly about reliability, cost predictability, and better user flows. Rollups have already moved significant activity off the base layer, but teams now need to make settlement, bridging, and transaction confirmation feel less fragmented.",
      },
      {
        heading: "Data costs still matter",
        body:
          "Lower data costs can improve margins for application chains and high-throughput consumer products. Developers are comparing rollup stacks not only on fees, but also on uptime, sequencing assumptions, and how easily wallets can abstract network complexity.",
      },
      {
        heading: "Institutional read-through",
        body:
          "For funds and infrastructure providers, Ethereum's scaling roadmap remains a long-duration thesis. The key question is whether cheaper execution translates into sticky application demand instead of temporary fee-sensitive activity.",
      },
    ],
    author: "Julian Reyes",
    sourceLabel: "ChainBrief Protocol Desk",
    readingTime: "12 min read",
    publishedDate: "2026-07-09",
    tags: ["Ethereum", "Layer 2", "Rollups", "Scaling"],
    relatedAsset: "ETH",
    isSponsored: false,
    impact: "Infrastructure",
  },
  {
    slug: "defi-lending-blue-chip-collateral-rebound",
    category: "DeFi",
    title: "DeFi Lending Markets Rebound as Blue-Chip Collateral Rises",
    excerpt:
      "Borrowing demand is climbing across major protocols while risk teams monitor collateral volatility.",
    contentSections: [
      {
        heading: "Borrow demand returns",
        body:
          "Large DeFi lending markets are seeing renewed demand as major crypto assets regain momentum. Borrowers are using blue-chip collateral to increase directional exposure, manage stablecoin liquidity, and rotate into higher-beta narratives.",
      },
      {
        heading: "Risk teams stay conservative",
        body:
          "Protocol risk parameters remain tighter than during prior cycles. Supply caps, liquidation thresholds, and oracle monitoring are all receiving closer attention after several years of stress events across onchain credit markets.",
      },
      {
        heading: "Revenue follows activity",
        body:
          "Higher utilization can support protocol revenue, but durable growth depends on disciplined collateral onboarding. The most resilient lending markets are likely to be those that balance liquidity expansion with conservative risk controls.",
      },
    ],
    author: "Nadia Park",
    sourceLabel: "ChainBrief DeFi Desk",
    readingTime: "9 min read",
    publishedDate: "2026-07-08",
    tags: ["DeFi", "Lending", "Collateral", "Stablecoins"],
    relatedAsset: "AAVE",
    isSponsored: false,
    impact: "Protocol revenue",
  },
  {
    slug: "stablecoin-regulation-compliance-standards",
    category: "Regulation",
    title: "Stablecoin Regulation Debate Centers on Reserves and Disclosures",
    excerpt:
      "Policy discussions remain centered on reserve quality, issuer reporting, and cross-border payment oversight.",
    contentSections: [
      {
        heading: "Reserve transparency leads the agenda",
        body:
          "Stablecoin policy teams are focusing on how issuers disclose reserves, manage redemption risk, and report attestations. Regulators want clearer lines between payment instruments, trading liquidity, and yield-bearing products.",
      },
      {
        heading: "Market impact may be uneven",
        body:
          "Clearer rules could benefit established issuers with compliance infrastructure while increasing costs for smaller entrants. Exchanges, wallets, and payment companies are watching closely because stablecoin access sits at the center of many crypto user flows.",
      },
      {
        heading: "A global coordination problem",
        body:
          "Stablecoins move across borders faster than policy frameworks. The next phase of regulation will likely hinge on how domestic reserve requirements interact with international settlement, sanctions screening, and consumer protection rules.",
      },
    ],
    author: "Clara Bennett",
    sourceLabel: "ChainBrief Policy Desk",
    readingTime: "8 min read",
    publishedDate: "2026-07-08",
    tags: ["Stablecoins", "Regulation", "Compliance", "Payments"],
    relatedAsset: "USDC",
    isSponsored: false,
    originalSourceUrl: "https://example.com/original-source-placeholder",
    impact: "Policy watch",
  },
  {
    slug: "web3-wallet-onboarding-mainstream-users",
    category: "Web3",
    title: "Consumer Crypto Apps Shift Toward Wallet-Free Onboarding",
    excerpt:
      "Product teams are simplifying signups, gas payments, and recovery flows to win mainstream users.",
    contentSections: [
      {
        heading: "The wallet fades into the product",
        body:
          "Consumer crypto teams are redesigning onboarding so users can try an app before understanding seed phrases, gas, or network selection. Embedded wallets, social recovery, and sponsored transactions are becoming the default pattern for mainstream products.",
      },
      {
        heading: "Retention is the real test",
        body:
          "Removing friction can improve first sessions, but retention still depends on whether the app offers a reason to return. The strongest teams are treating wallet abstraction as infrastructure, not as the main product promise.",
      },
      {
        heading: "Security tradeoffs remain",
        body:
          "Simpler onboarding introduces new custody, recovery, and permissioning questions. Product teams need clear consent flows and reliable recovery options if they want consumer adoption without repeating old platform-risk mistakes.",
      },
    ],
    author: "Evan Moore",
    sourceLabel: "ChainBrief Product Desk",
    readingTime: "6 min read",
    publishedDate: "2026-07-07",
    tags: ["Web3", "Wallets", "Consumer crypto", "Onboarding"],
    isSponsored: false,
    impact: "Adoption",
  },
  {
    slug: "ai-crypto-infrastructure-data-compute-networks",
    category: "Infrastructure",
    title: "AI Crypto Infrastructure Projects Compete for Data and Compute Demand",
    excerpt:
      "Decentralized compute, model coordination, and data networks are turning AI into one of crypto's busiest infrastructure narratives.",
    contentSections: [
      {
        heading: "Narrative meets infrastructure",
        body:
          "AI-linked crypto projects are moving beyond ticker-driven speculation and toward practical infrastructure claims. Teams are pitching decentralized compute, verifiable inference, model marketplaces, and data coordination systems for builders who need alternatives to centralized platforms.",
      },
      {
        heading: "Demand is not evenly distributed",
        body:
          "The strongest projects will need measurable usage rather than broad AI branding. Investors are watching whether networks can attract developers, sustain supply-side economics, and prove that token incentives improve the product experience.",
      },
      {
        heading: "The next diligence layer",
        body:
          "As the sector matures, research desks are looking at utilization, customer concentration, and real revenue. The AI crypto category may stay volatile, but infrastructure projects with transparent demand metrics could separate from the theme trade.",
      },
    ],
    author: "Priya Shah",
    sourceLabel: "ChainBrief Research Desk",
    readingTime: "10 min read",
    publishedDate: "2026-07-07",
    tags: ["AI", "Infrastructure", "Compute", "Data networks"],
    relatedAsset: "RNDR",
    isSponsored: true,
    sponsorName: "DataGrid Labs",
    impact: "Infrastructure",
  },
  {
    slug: "exchange-liquidity-market-makers-altcoin-depth",
    category: "Markets",
    title: "Exchange Liquidity Splits Between Majors and Select Altcoin Themes",
    excerpt:
      "Market makers are concentrating depth in high-volume pairs while smaller tokens face wider spreads and sharper intraday swings.",
    contentSections: [
      {
        heading: "Depth concentrates in majors",
        body:
          "Exchange liquidity remains strongest in Bitcoin, Ethereum, and a narrow set of high-conviction altcoins. Smaller markets are seeing wider spreads, thinner books, and more sensitivity to headline-driven flows.",
      },
      {
        heading: "Market makers stay selective",
        body:
          "Liquidity providers are prioritizing venues and pairs where volume is durable enough to justify balance sheet usage. That selectivity can create a feedback loop where popular themes receive better execution while weaker narratives become more fragile.",
      },
      {
        heading: "Why it matters",
        body:
          "For traders, liquidity quality can matter more than the quoted price move. Thin books can turn routine rotations into exaggerated breakouts or breakdowns, especially around unlocks, listings, and macro events.",
      },
    ],
    author: "Maya Collins",
    sourceLabel: "ChainBrief Markets Desk",
    readingTime: "7 min read",
    publishedDate: "2026-07-06",
    tags: ["Exchanges", "Liquidity", "Market makers", "Altcoins"],
    isSponsored: false,
    impact: "Trader flows",
  },
  {
    slug: "token-unlocks-altcoin-volatility-supply-schedule",
    category: "Markets",
    title: "Token Unlocks Put Altcoin Supply Schedules Back Under the Microscope",
    excerpt:
      "Liquidity remains selective as traders rotate between infrastructure, AI, and real-world asset narratives ahead of major unlock events.",
    contentSections: [
      {
        heading: "Supply calendars return to focus",
        body:
          "Token unlocks are becoming a larger part of trader preparation as several high-profile projects approach new supply events. Markets are not reacting to unlocks uniformly; the impact depends on liquidity, holder composition, and whether demand can absorb additional float.",
      },
      {
        heading: "Communication shapes expectations",
        body:
          "Projects that clearly explain vesting, treasury usage, and ecosystem incentives often face less uncertainty than teams that leave the market guessing. Even when unlocks are known in advance, weak communication can pressure sentiment.",
      },
      {
        heading: "Execution risk for newer tokens",
        body:
          "Newer assets with concentrated ownership and shallow liquidity are most exposed to volatile repricing. Traders are watching whether unlock-related supply gets distributed gradually or arrives during already fragile market windows.",
      },
    ],
    author: "Leo Hart",
    sourceLabel: "ChainBrief Token Desk",
    readingTime: "5 min read",
    publishedDate: "2026-07-06",
    tags: ["Token unlocks", "Altcoins", "Supply", "Vesting"],
    isSponsored: false,
    impact: "Supply risk",
  },
];

export function getArticleBySlug(slug: string) {
  return latestNews.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3) {
  const article = getArticleBySlug(slug);

  if (!article) {
    return [];
  }

  const related = latestNews.filter((candidate) => {
    if (candidate.slug === slug) {
      return false;
    }

    return (
      candidate.category === article.category ||
      candidate.tags.some((tag) => article.tags.includes(tag)) ||
      candidate.relatedAsset === article.relatedAsset
    );
  });

  const fallback = latestNews.filter(
    (candidate) =>
      candidate.slug !== slug &&
      !related.some((relatedArticle) => relatedArticle.slug === candidate.slug),
  );

  return [...related, ...fallback].slice(0, limit);
}

export const marketMovers = [
  { symbol: "BTC", name: "Bitcoin", price: "$108,420", change: "+2.8%", cap: "$2.13T", accent: "green" },
  { symbol: "ETH", name: "Ethereum", price: "$5,860", change: "+1.9%", cap: "$706B", accent: "blue" },
  { symbol: "SOL", name: "Solana", price: "$284.10", change: "+5.4%", cap: "$132B", accent: "violet" },
  { symbol: "BNB", name: "BNB", price: "$812.35", change: "-0.7%", cap: "$119B", accent: "red" },
  { symbol: "XRP", name: "XRP", price: "$2.42", change: "+0.6%", cap: "$137B", accent: "green" },
  { symbol: "ADA", name: "Cardano", price: "$1.18", change: "-1.1%", cap: "$42B", accent: "red" },
  { symbol: "DOGE", name: "Dogecoin", price: "$0.31", change: "+3.2%", cap: "$46B", accent: "blue" },
  { symbol: "AVAX", name: "Avalanche", price: "$64.80", change: "+2.1%", cap: "$27B", accent: "violet" },
];

export const topProjects = [
  {
    rank: "01",
    name: "Arbitrum",
    sector: "Layer 2",
    score: "94",
    note: "Strong developer activity and expanding DeFi liquidity.",
  },
  {
    rank: "02",
    name: "EigenLayer",
    sector: "Restaking",
    score: "91",
    note: "Growing validator economy with broad infrastructure integrations.",
  },
  {
    rank: "03",
    name: "Aave",
    sector: "DeFi",
    score: "89",
    note: "Leading lending protocol with resilient risk management.",
  },
  {
    rank: "04",
    name: "Celestia",
    sector: "Modular",
    score: "86",
    note: "Data availability adoption remains a key market narrative.",
  },
  {
    rank: "05",
    name: "Chainlink",
    sector: "Oracle",
    score: "84",
    note: "Core oracle and cross-chain infrastructure for data-hungry apps.",
  },
  {
    rank: "06",
    name: "Uniswap",
    sector: "DEX",
    score: "82",
    note: "Leading decentralized exchange brand with durable liquidity share.",
  },
];

export const sponsorPackages = [
  {
    name: "Homepage Leaderboard",
    price: "$2,400 / week",
    description: "Top-of-page visibility across the highest-intent ChainBrief entry point.",
  },
  {
    name: "Sponsored Article",
    price: "$3,800 / campaign",
    description: "Clearly labeled partner education written for crypto-native readers.",
  },
  {
    name: "Project Spotlight",
    price: "$1,900 / week",
    description: "Premium positioning inside rankings and project discovery modules.",
  },
  {
    name: "Newsletter Sponsorship",
    price: "$1,250 / send",
    description: "Dedicated placement in future market briefings and weekly recaps.",
  },
];
