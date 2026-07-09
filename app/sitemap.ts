import type { MetadataRoute } from "next";
import { cryptoProjects, latestNews, SITE_URL } from "../lib/siteData";

export const dynamic = "force-static";

const staticRoutes = [
  "",
  "/about",
  "/advertise",
  "/brand",
  "/contact",
  "/disclaimer",
  "/marketing",
  "/markets",
  "/media-kit",
  "/news",
  "/privacy-policy",
  "/projects",
  "/rankings",
  "/sponsored",
  "/submit-project",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }));
  const newsEntries = latestNews.map((article) => ({
    url: `${SITE_URL}/news/${article.slug}`,
    lastModified: new Date(article.publishedDate),
  }));
  const projectEntries = cryptoProjects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...newsEntries, ...projectEntries];
}
