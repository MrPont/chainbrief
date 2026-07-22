import "server-only";
import { getMarketData, type MarketAsset } from "./marketData";

const TICKER_SYMBOL_ORDER = ["BTC", "ETH", "SOL", "XRP", "BNB", "DOGE", "USDC", "ADA"];

export type MarketTickerAsset = {
  id: string;
  symbol: string;
  name: string;
  formattedPrice: string;
  formattedChange24h: string;
  priceChangePercentage24h: number | null;
};

function toTickerAsset(asset: MarketAsset): MarketTickerAsset {
  return {
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    formattedPrice: asset.formattedPrice,
    formattedChange24h: asset.formattedChange24h,
    priceChangePercentage24h: asset.priceChangePercentage24h,
  };
}

export async function getMarketTickerAssets() {
  const marketData = await getMarketData();
  const tickerAssets = TICKER_SYMBOL_ORDER.map((symbol) =>
    marketData.assets.find((asset) => asset.symbol === symbol),
  )
    .filter((asset): asset is MarketAsset => Boolean(asset))
    .map(toTickerAsset);

  return {
    assets: tickerAssets,
    isLive: marketData.isLive,
  };
}
