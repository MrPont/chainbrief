import PageHero from "../../components/PageHero";

const coins = [
  { rank: "1", asset: "Bitcoin", symbol: "BTC", price: "$108,420", change: "+2.8%", cap: "$2.13T" },
  { rank: "2", asset: "Ethereum", symbol: "ETH", price: "$5,860", change: "+1.9%", cap: "$706B" },
  { rank: "3", asset: "Solana", symbol: "SOL", price: "$284.10", change: "+5.4%", cap: "$132B" },
  { rank: "4", asset: "BNB", symbol: "BNB", price: "$812.35", change: "-0.7%", cap: "$119B" },
  { rank: "5", asset: "XRP", symbol: "XRP", price: "$2.42", change: "+0.6%", cap: "$137B" },
  { rank: "6", asset: "Cardano", symbol: "ADA", price: "$1.18", change: "-1.1%", cap: "$42B" },
  { rank: "7", asset: "Dogecoin", symbol: "DOGE", price: "$0.31", change: "+3.2%", cap: "$46B" },
  { rank: "8", asset: "Avalanche", symbol: "AVAX", price: "$64.80", change: "+2.1%", cap: "$27B" },
];

export default function MarketsPage() {
  return (
    <>
      <PageHero
        eyebrow="Market board"
        title="Crypto Markets"
        description="Sample market data for major crypto assets. Live pricing will be connected later when the data layer is ready."
      />

      <section className="table-card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Asset</th>
              <th>Price</th>
              <th>24h</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.symbol}>
                <td>{coin.rank}</td>
                <td>
                  <strong>{coin.asset}</strong>
                  <span>{coin.symbol}</span>
                </td>
                <td>{coin.price}</td>
                <td className={coin.change.startsWith("-") ? "negative" : "positive"}>
                  {coin.change}
                </td>
                <td>{coin.cap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
