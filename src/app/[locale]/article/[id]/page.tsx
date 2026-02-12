import type { Metadata } from "next";
import ArticleDetailClient from "./ArticleDetailClient";

export const metadata: Metadata = {
  title: "Article - GlobalNow",
  description: "Read the full article on GlobalNow",
  openGraph: {
    title: "GlobalNow - Article",
    description: "Stay updated with real-time global news",
    type: "article",
    siteName: "GlobalNow",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalNow - Article",
    description: "Stay updated with real-time global news",
  },
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;

  return <ArticleDetailClient articleId={id} />;
}
