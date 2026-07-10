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

export type CryptoProject = {
  slug: string;
  name: string;
  symbol: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  rank: number;
  score: number;
  chain: string;
  websiteUrl: string;
  twitterUrl: string;
  tags: string[];
  keyMetrics: {
    marketPosition: string;
    ecosystemStrength: string;
    developerActivity: string;
    liquidityProfile: string;
  };
  highlights: string[];
  risks: string[];
  isSponsored: boolean;
  sponsorLabel?: string;
};

export const cryptoProjects: CryptoProject[] = [
  {
    slug: "arbitrum",
    name: "Arbitrum",
    symbol: "ARB",
    category: "Layer 2",
    shortDescription: "Ethereum scaling network focused on low-cost execution and DeFi liquidity.",
    fullDescription:
      "Arbitrum is tracked by ChainBrief as a leading Ethereum Layer 2 ecosystem with deep DeFi activity, active developer tooling, and a broad application base. Its profile is strongest when users value Ethereum alignment, liquidity access, and mature rollup infrastructure over newer high-throughput experiments.",
    rank: 1,
    score: 94,
    chain: "Ethereum Layer 2",
    websiteUrl: "https://example.com/arbitrum",
    twitterUrl: "https://example.com/arbitrum-social",
    tags: ["Layer 2", "Ethereum", "DeFi", "Rollups"],
    keyMetrics: {
      marketPosition: "Top-tier Ethereum scaling ecosystem with strong mindshare.",
      ecosystemStrength: "Broad DeFi, gaming, and infrastructure coverage.",
      developerActivity: "High, supported by mature tooling and active integrations.",
      liquidityProfile: "Deep relative liquidity across major onchain venues.",
    },
    highlights: [
      "Strong DeFi footprint and blue-chip protocol integrations.",
      "Clear Ethereum scaling narrative with established user awareness.",
      "Developer ecosystem benefits from mature rollup tooling.",
    ],
    risks: [
      "Competes with many Layer 2 networks for users and incentives.",
      "Fee compression can pressure ecosystem economics.",
      "Governance and token utility expectations remain important sentiment drivers.",
    ],
    isSponsored: false,
  },
  {
    slug: "eigenlayer",
    name: "EigenLayer",
    symbol: "EIGEN",
    category: "Restaking",
    shortDescription: "Restaking infrastructure designed to extend Ethereum security to new services.",
    fullDescription:
      "EigenLayer sits at the center of the restaking narrative, where staked capital can be used to support additional infrastructure services. ChainBrief tracks it as a high-upside but complex protocol category because growth depends on operator reliability, service demand, and clear risk boundaries for participants.",
    rank: 2,
    score: 91,
    chain: "Ethereum",
    websiteUrl: "https://example.com/eigenlayer",
    twitterUrl: "https://example.com/eigenlayer-social",
    tags: ["Restaking", "Ethereum", "Infrastructure", "Validators"],
    keyMetrics: {
      marketPosition: "Category-defining restaking protocol with strong narrative pull.",
      ecosystemStrength: "Expanding service network and validator-focused integrations.",
      developerActivity: "High among infrastructure teams building actively validated services.",
      liquidityProfile: "Improving, with liquidity tied to broader restaking demand.",
    },
    highlights: [
      "One of the most visible restaking ecosystems in crypto.",
      "Creates a new market for shared security and operator services.",
      "Institutional interest remains strong around validator economics.",
    ],
    risks: [
      "Restaking risk can be difficult for users to evaluate.",
      "Service-level failures may affect confidence in the category.",
      "Token economics and demand capture need continued proof.",
    ],
    isSponsored: false,
  },
  {
    slug: "aave",
    name: "Aave",
    symbol: "AAVE",
    category: "DeFi",
    shortDescription: "Multi-chain lending protocol with large collateral markets and risk controls.",
    fullDescription:
      "Aave is a core DeFi lending venue where users supply collateral, borrow assets, and manage onchain leverage. ChainBrief views Aave as a mature DeFi protocol with durable brand equity, broad asset coverage, and a risk framework that remains central to its long-term positioning.",
    rank: 3,
    score: 89,
    chain: "Multi-chain",
    websiteUrl: "https://example.com/aave",
    twitterUrl: "https://example.com/aave-social",
    tags: ["DeFi", "Lending", "Collateral", "Stablecoins"],
    keyMetrics: {
      marketPosition: "Leading decentralized lending brand across major chains.",
      ecosystemStrength: "Strong integrations with wallets, DeFi apps, and risk dashboards.",
      developerActivity: "Steady, focused on markets, governance, and risk modules.",
      liquidityProfile: "Strong liquidity in major collateral and stablecoin markets.",
    },
    highlights: [
      "Established lending markets with broad user familiarity.",
      "Risk management process is closely watched by the industry.",
      "Revenue potential increases when borrowing demand rises.",
    ],
    risks: [
      "Collateral volatility can stress liquidation systems.",
      "Governance decisions around new markets can create risk.",
      "Competition from newer lending designs remains persistent.",
    ],
    isSponsored: false,
  },
  {
    slug: "celestia",
    name: "Celestia",
    symbol: "TIA",
    category: "Modular",
    shortDescription: "Modular data availability network for rollups and app-specific chains.",
    fullDescription:
      "Celestia represents the modular blockchain thesis, separating data availability from execution and settlement. ChainBrief tracks it as a key infrastructure project for teams that want flexible rollup deployment and lower data costs, while still needing market proof that modular demand can scale sustainably.",
    rank: 4,
    score: 86,
    chain: "Celestia",
    websiteUrl: "https://example.com/celestia",
    twitterUrl: "https://example.com/celestia-social",
    tags: ["Modular", "Data availability", "Rollups", "Infrastructure"],
    keyMetrics: {
      marketPosition: "High-profile modular infrastructure network.",
      ecosystemStrength: "Growing builder base around rollups and app chains.",
      developerActivity: "Active, especially among modular stack teams.",
      liquidityProfile: "Good exchange visibility with narrative-driven volatility.",
    },
    highlights: [
      "Clear data availability narrative for modular builders.",
      "Strong relevance to rollup and app-chain experimentation.",
      "Benefits from demand for cheaper scaling infrastructure.",
    ],
    risks: [
      "Adoption depends on sustained rollup deployment demand.",
      "Competes with other data availability approaches.",
      "Token unlocks and supply expectations can influence sentiment.",
    ],
    isSponsored: false,
  },
  {
    slug: "chainlink",
    name: "Chainlink",
    symbol: "LINK",
    category: "Oracle",
    shortDescription: "Oracle and cross-chain services network for smart contract applications.",
    fullDescription:
      "Chainlink provides oracle infrastructure, data feeds, automation, and cross-chain messaging services used by many smart contract applications. ChainBrief tracks Chainlink as a durable infrastructure project whose market position is tied to reliable data delivery and expanding enterprise-grade crypto workflows.",
    rank: 5,
    score: 84,
    chain: "Multi-chain",
    websiteUrl: "https://example.com/chainlink",
    twitterUrl: "https://example.com/chainlink-social",
    tags: ["Oracle", "Infrastructure", "Data", "Cross-chain"],
    keyMetrics: {
      marketPosition: "Core oracle provider with broad industry recognition.",
      ecosystemStrength: "Very broad integrations across DeFi and infrastructure.",
      developerActivity: "Consistent, with new services beyond price feeds.",
      liquidityProfile: "Deep major-exchange liquidity and strong market awareness.",
    },
    highlights: [
      "Established oracle brand with extensive integrations.",
      "Expanding service set beyond price data.",
      "Cross-chain infrastructure remains a long-running demand area.",
    ],
    risks: [
      "Oracle competition and pricing pressure can evolve over time.",
      "Token value capture remains debated by some investors.",
      "Cross-chain systems carry technical and security complexity.",
    ],
    isSponsored: false,
  },
  {
    slug: "uniswap",
    name: "Uniswap",
    symbol: "UNI",
    category: "DEX",
    shortDescription: "Decentralized exchange protocol known for automated market making and liquidity depth.",
    fullDescription:
      "Uniswap is one of DeFi's most recognizable exchange protocols, providing permissionless swapping and liquidity markets across multiple networks. ChainBrief tracks Uniswap as a mature DEX brand where protocol upgrades, fee debates, and liquidity share remain the key drivers.",
    rank: 6,
    score: 82,
    chain: "Multi-chain",
    websiteUrl: "https://example.com/uniswap",
    twitterUrl: "https://example.com/uniswap-social",
    tags: ["DEX", "DeFi", "Liquidity", "AMM"],
    keyMetrics: {
      marketPosition: "Leading decentralized exchange brand by mindshare.",
      ecosystemStrength: "Large developer and liquidity provider ecosystem.",
      developerActivity: "Steady protocol and interface development.",
      liquidityProfile: "Very strong for major pairs and long-tail assets.",
    },
    highlights: [
      "Deep DeFi brand recognition and recurring user demand.",
      "Important liquidity venue for long-tail token discovery.",
      "Protocol design continues to influence AMM markets.",
    ],
    risks: [
      "DEX competition remains intense across chains.",
      "Fee-switch and governance debates can affect sentiment.",
      "Liquidity incentives may fragment across venues.",
    ],
    isSponsored: false,
  },
  {
    slug: "solana",
    name: "Solana",
    symbol: "SOL",
    category: "Layer 1",
    shortDescription: "High-throughput Layer 1 network focused on fast consumer and trading applications.",
    fullDescription:
      "Solana is tracked by ChainBrief as a high-performance Layer 1 with strong momentum in consumer apps, trading venues, payments experiments, and developer-led product cycles. Its profile benefits from fast execution and strong cultural energy, while network reliability and ecosystem concentration remain important watch areas.",
    rank: 7,
    score: 81,
    chain: "Solana",
    websiteUrl: "https://example.com/solana",
    twitterUrl: "https://example.com/solana-social",
    tags: ["Layer 1", "Consumer crypto", "DeFi", "Payments"],
    keyMetrics: {
      marketPosition: "Major alternative Layer 1 with strong retail and builder attention.",
      ecosystemStrength: "Strong apps across trading, NFTs, payments, and consumer UX.",
      developerActivity: "High, with rapid product experimentation.",
      liquidityProfile: "Deep liquidity for SOL and growing ecosystem markets.",
    },
    highlights: [
      "Fast execution supports consumer-style product experiences.",
      "Strong developer culture and rapid app iteration.",
      "Market narrative benefits from visible ecosystem momentum.",
    ],
    risks: [
      "Network reliability history remains a diligence point.",
      "High expectations can make sentiment volatile.",
      "Competition from Ethereum L2s and other L1s is constant.",
    ],
    isSponsored: false,
  },
  {
    slug: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    category: "Layer 1",
    shortDescription: "Layer 1 ecosystem focused on subnets, DeFi, and custom blockchain deployments.",
    fullDescription:
      "Avalanche is positioned around fast settlement, DeFi activity, and customizable network deployments. ChainBrief tracks Avalanche for its subnet strategy, institutional experiments, and ability to attract applications that want more control over execution environments.",
    rank: 8,
    score: 79,
    chain: "Avalanche",
    websiteUrl: "https://example.com/avalanche",
    twitterUrl: "https://example.com/avalanche-social",
    tags: ["Layer 1", "Subnets", "DeFi", "Enterprise"],
    keyMetrics: {
      marketPosition: "Established Layer 1 with custom-chain positioning.",
      ecosystemStrength: "Moderate to strong, with DeFi and institutional pilots.",
      developerActivity: "Steady around subnet and application-chain tooling.",
      liquidityProfile: "Solid major exchange liquidity with selective onchain depth.",
    },
    highlights: [
      "Subnet narrative appeals to custom blockchain deployments.",
      "Recognizable brand with prior DeFi cycle traction.",
      "Institutional pilots can support differentiated positioning.",
    ],
    risks: [
      "Layer 1 competition is crowded and capital-intensive.",
      "Subnet adoption must translate into durable user activity.",
      "Liquidity can be selective outside major AVAX markets.",
    ],
    isSponsored: true,
    sponsorLabel: "Featured ecosystem profile",
  },
  {
    slug: "optimism",
    name: "Optimism",
    symbol: "OP",
    category: "Layer 2",
    shortDescription: "Ethereum Layer 2 ecosystem built around optimistic rollups and the Superchain thesis.",
    fullDescription:
      "Optimism is an Ethereum scaling ecosystem focused on rollup infrastructure and a multi-chain Superchain strategy. ChainBrief tracks it as a major Layer 2 project where governance, ecosystem incentives, and shared infrastructure adoption are key to the long-term profile.",
    rank: 9,
    score: 78,
    chain: "Ethereum Layer 2",
    websiteUrl: "https://example.com/optimism",
    twitterUrl: "https://example.com/optimism-social",
    tags: ["Layer 2", "Ethereum", "Rollups", "Superchain"],
    keyMetrics: {
      marketPosition: "Major Ethereum L2 with a distinct multi-chain strategy.",
      ecosystemStrength: "Strong, supported by aligned chains and governance programs.",
      developerActivity: "High around OP Stack and shared infrastructure.",
      liquidityProfile: "Good exchange access and solid onchain ecosystem liquidity.",
    },
    highlights: [
      "OP Stack gives builders a recognizable rollup toolkit.",
      "Superchain narrative differentiates ecosystem strategy.",
      "Governance programs support application and infrastructure growth.",
    ],
    risks: [
      "Layer 2 competition can fragment users and liquidity.",
      "Shared-chain strategy requires coordination across many teams.",
      "Token incentives must convert into durable adoption.",
    ],
    isSponsored: false,
  },
  {
    slug: "the-graph",
    name: "The Graph",
    symbol: "GRT",
    category: "Data",
    shortDescription: "Decentralized indexing network for querying blockchain application data.",
    fullDescription:
      "The Graph provides indexing infrastructure that helps applications retrieve and organize blockchain data. ChainBrief tracks it as a foundational data network whose relevance grows when developers need reliable query layers across increasingly complex multi-chain environments.",
    rank: 10,
    score: 76,
    chain: "Multi-chain",
    websiteUrl: "https://example.com/the-graph",
    twitterUrl: "https://example.com/the-graph-social",
    tags: ["Data", "Indexing", "Infrastructure", "Web3"],
    keyMetrics: {
      marketPosition: "Recognized data indexing network for Web3 applications.",
      ecosystemStrength: "Broad relevance across apps that need reliable blockchain queries.",
      developerActivity: "Steady, with focus on indexing performance and network adoption.",
      liquidityProfile: "Adequate major-market liquidity with infrastructure narrative exposure.",
    },
    highlights: [
      "Core data layer for many blockchain application workflows.",
      "Multi-chain complexity increases indexing needs.",
      "Clear infrastructure role beyond short-term market narratives.",
    ],
    risks: [
      "Developer adoption must justify decentralized indexing economics.",
      "Centralized data providers remain strong competitors.",
      "Infrastructure tokens can lag during purely speculative rotations.",
    ],
    isSponsored: false,
  },
];

export const topProjects = cryptoProjects.slice(0, 6).map((project) => ({
  slug: project.slug,
  rank: String(project.rank).padStart(2, "0"),
  name: project.name,
  sector: project.category,
  score: String(project.score),
  note: project.shortDescription,
}));

export function getProjectBySlug(slug: string) {
  return cryptoProjects.find((project) => project.slug === slug);
}

export function getRelatedProjectNews(project: CryptoProject, limit = 3) {
  const matches = latestNews.filter((article) => {
    const searchableProjectTerms = [
      project.name,
      project.symbol,
      project.category,
      ...project.tags,
    ];

    return (
      article.relatedAsset === project.symbol ||
      searchableProjectTerms.some((term) => article.tags.includes(term)) ||
      article.category === project.category
    );
  });

  const fallback = latestNews.filter(
    (article) => !matches.some((match) => match.slug === article.slug),
  );

  return [...matches, ...fallback].slice(0, limit);
}

export const sponsorPackages = [
  {
    name: "Homepage Leaderboard",
    actionLabel: "Pricing on request",
    description:
      "Top-of-page visibility across the highest-intent ChainBrief entry point. Plans depend on placement, duration, creative format, and campaign timing.",
  },
  {
    name: "Sponsored Article",
    actionLabel: "Request media kit",
    description:
      "Clearly labeled partner education written for crypto-native readers, with format and distribution details available in the media kit.",
  },
  {
    name: "Project Spotlight",
    actionLabel: "Custom package",
    description:
      "Premium positioning inside rankings and project discovery modules, scoped around category, duration, and visibility goals.",
  },
  {
    name: "Newsletter Sponsorship",
    actionLabel: "Request pricing",
    description:
      "Dedicated placement in future market briefings and weekly recaps, packaged around audience fit and campaign schedule.",
  },
];
