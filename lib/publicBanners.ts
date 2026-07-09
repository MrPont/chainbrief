import { cache } from "react";
import { supabaseAdmin } from "./supabaseAdmin";

export type BannerPlacement =
  | "header"
  | "homepage_top"
  | "homepage_mid"
  | "article_inline"
  | "article_sidebar"
  | "sidebar"
  | "footer"
  | "leaderboard";

export type PublicBannerAd = {
  id: string;
  title: string;
  advertiserName: string;
  imageUrl: string;
  targetUrl: string;
  placement: BannerPlacement;
  startDate: string | null;
  endDate: string | null;
};

type BannerAdRow = {
  id: string;
  title: string;
  advertiser_name: string | null;
  image_url: string | null;
  target_url: string | null;
  placement: BannerPlacement;
  start_date: string | null;
  end_date: string | null;
};

function isInsideSchedule(banner: BannerAdRow, today: string) {
  const startsBeforeToday = !banner.start_date || banner.start_date <= today;
  const endsAfterToday = !banner.end_date || banner.end_date >= today;

  return startsBeforeToday && endsAfterToday;
}

function mapBannerAd(banner: BannerAdRow): PublicBannerAd {
  return {
    id: banner.id,
    title: banner.title,
    advertiserName: banner.advertiser_name || "ChainBrief advertiser",
    imageUrl: banner.image_url || "",
    targetUrl: banner.target_url || "",
    placement: banner.placement,
    startDate: banner.start_date,
    endDate: banner.end_date,
  };
}

export const fetchActiveBannerAd = cache(async (placement: BannerPlacement) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabaseAdmin
      .from("banner_ads")
      .select(
        "id,title,advertiser_name,image_url,target_url,placement,start_date,end_date,created_at",
      )
      .eq("placement", placement)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Failed to fetch banner placement "${placement}":`, error);
      return null;
    }

    const activeBanner = ((data ?? []) as BannerAdRow[]).find((banner) => {
      return banner.image_url && banner.target_url && isInsideSchedule(banner, today);
    });

    return activeBanner ? mapBannerAd(activeBanner) : null;
  } catch (error) {
    console.error(`Failed to fetch banner placement "${placement}":`, error);
    return null;
  }
});
