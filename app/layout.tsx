import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChainBrief - Crypto News, Markets & Project Rankings",
  description:
    "ChainBrief tracks crypto news, market signals, Web3 trends, and emerging digital asset projects.",
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
