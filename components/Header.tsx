import Link from "next/link";
import Logo from "./Logo";
import MarketTicker from "./MarketTicker";
import { getMarketTickerAssets } from "../lib/marketTicker";

const navigationLinks = [
  { label: "News", href: "/news" },
  { label: "Markets", href: "/markets" },
  { label: "Rankings", href: "/rankings" },
  { label: "Projects", href: "/projects" },
  { label: "Marketing", href: "/marketing" },
  { label: "Advertise", href: "/advertise" },
];

export default async function Header() {
  const tickerData = await getMarketTickerAssets();

  return (
    <>
      <header className="site-header">
        <Link className="logo" href="/" aria-label="ChainBrief home">
          <Logo />
        </Link>

        <nav className="main-nav" aria-label="Primary navigation">
          {navigationLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <MarketTicker assets={tickerData.assets} isLive={tickerData.isLive} />
    </>
  );
}
