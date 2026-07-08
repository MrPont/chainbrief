import PageHero from "../../components/PageHero";
import { marketMovers } from "../../lib/siteData";

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
            {marketMovers.map((coin, index) => (
              <tr key={coin.symbol}>
                <td>{index + 1}</td>
                <td>
                  <strong>{coin.name}</strong>
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
