import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://chainbrief.example"),
  title: {
    default: "ChainBrief - Crypto News, Markets & Project Rankings",
    template: "%s | ChainBrief",
  },
  description:
    "ChainBrief tracks crypto news, market signals, Web3 trends, project rankings and crypto marketing services.",
  icons: {
    icon: "/icon",
  },
  keywords: [
    "crypto news",
    "Bitcoin",
    "Ethereum",
    "DeFi",
    "Web3",
    "crypto markets",
    "project rankings",
  ],
  openGraph: {
    title: "ChainBrief - Crypto News, Markets & Project Rankings",
    description:
      "ChainBrief tracks crypto news, market signals, Web3 trends, project rankings and crypto marketing services.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainBrief - Crypto News, Markets & Project Rankings",
    description:
      "ChainBrief tracks crypto news, market signals, Web3 trends, project rankings and crypto marketing services.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="site-shell">
          <Header />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
