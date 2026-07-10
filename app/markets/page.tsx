/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import PageHero from "../../components/PageHero";
import { getMarketData } from "../../lib/marketData";

export const metadata: Metadata = {
  title: "Crypto Markets",
  description:
    "Live crypto market board for Bitcoin, Ethereum, Solana, altcoins, price moves and market cap signals.",
  alternates: {
    canonical: "/markets",
  },
  openGraph: {
    title: "Crypto Markets | ChainBrief",
    description:
      "Track live crypto market data, price movement and market cap signals.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Markets | ChainBrief",
    description:
      "Crypto market board with live asset data and market movement.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

export const dynamic = "force-dynamic";

function getChangeClass(value: number | null) {
  if (value === null) {
    return "";
  }

  return value < 0 ? "negative" : "positive";
}

export default async function MarketsPage() {
  const marketData = await getMarketData();

  return (
    <>
      <PageHero
        eyebrow="Market board"
        title="Crypto Markets"
        description="Live crypto market data for major digital assets, with a static sample fallback if the market data provider is unavailable."
      />

      <div className="market-note">
        <span>Market data provided by CoinGecko.</span>
        <span>Updated every few minutes.</span>
        {!marketData.isLive ? <strong>Showing sample market data.</strong> : null}
      </div>

      <section className="table-card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Asset</th>
              <th>Price</th>
              <th>24h</th>
              <th>7d</th>
              <th>Market Cap</th>
              <th>Volume</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {marketData.assets.map((coin, index) => (
              <tr key={coin.symbol}>
                <td>{coin.marketCapRank || index + 1}</td>
                <td>
                  <div className="market-asset-cell">
                    {coin.image ? <img src={coin.image} alt="" /> : null}
                    <div>
                      <strong>{coin.name}</strong>
                      <span>{coin.symbol}</span>
                    </div>
                  </div>
                </td>
                <td>{coin.formattedPrice}</td>
                <td className={getChangeClass(coin.priceChangePercentage24h)}>
                  {coin.formattedChange24h}
                </td>
                <td className={getChangeClass(coin.priceChangePercentage7d)}>
                  {coin.formattedChange7d}
                </td>
                <td>{coin.formattedMarketCap}</td>
                <td>{coin.formattedVolume}</td>
                <td>{coin.formattedLastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
