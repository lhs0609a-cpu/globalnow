"use client";

import { useEffect } from "react";
import ArticleDetail from "@/components/ArticleDetail";
import { getCachedArticle } from "@/lib/article-cache";

interface Props {
  articleId: string;
}

export default function ArticleDetailClient({ articleId }: Props) {
  useEffect(() => {
    const article = getCachedArticle(articleId);
    if (article) {
      document.title = `${article.title} - GlobalNow`;
    }
  }, [articleId]);

  return <ArticleDetail articleId={articleId} />;
}
