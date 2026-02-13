"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Collection } from "@/types/news";
import {
  getCollectionById,
  removeArticleFromCollection,
  generateShareUrl,
  updateCollection,
} from "@/lib/collections";

interface CollectionDetailClientProps {
  collectionId: string;
}

export default function CollectionDetailClient({
  collectionId,
}: CollectionDetailClientProps) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const t = useTranslations("Collections");

  useEffect(() => {
    const col = getCollectionById(collectionId);
    setCollection(col);
    if (col) {
      setEditName(col.name);
      setEditDesc(col.description);
    }
  }, [collectionId]);

  const handleRemove = (url: string) => {
    removeArticleFromCollection(collectionId, url);
    setCollection(getCollectionById(collectionId));
  };

  const handleSave = () => {
    updateCollection(collectionId, {
      name: editName.trim(),
      description: editDesc.trim(),
    });
    setCollection(getCollectionById(collectionId));
    setEditing(false);
  };

  const handleShare = () => {
    if (!collection) return;
    const url = generateShareUrl(collection);
    setShareUrl(url);
    navigator.clipboard.writeText(url);
  };

  if (!collection) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">{t("notFound")}</p>
        <Link
          href="/collections"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          {t("backToCollections")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/collections"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        {t("backToCollections")}
      </Link>

      {/* Header */}
      <div className="mb-6">
        {editing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-bold outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                {t("save")}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:text-gray-300"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {collection.description}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                {collection.articles.length} {t("articles")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t("edit")}
              </button>
              <button
                onClick={handleShare}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t("share")}
              </button>
            </div>
          </div>
        )}
      </div>

      {shareUrl && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
          {t("shareCopied")}
        </div>
      )}

      {/* Articles grid */}
      {collection.articles.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("emptyCollection")}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collection.articles.map((article) => (
            <ArticleCard
              key={article.url}
              article={article}
              onRemove={() => handleRemove(article.url)}
              removeLabel={t("remove")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({
  article,
  onRemove,
  removeLabel,
}: {
  article: Collection["articles"][0];
  onRemove: () => void;
  removeLabel: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {article.urlToImage && !imgError ? (
          <div className="relative h-36 w-full overflow-hidden">
            <Image
              src={article.urlToImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center bg-gray-100 dark:bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="h-8 w-8 text-gray-300 dark:text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
              />
            </svg>
          </div>
        )}
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
            {article.title}
          </h3>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>{article.source}</span>
            <span>{new Date(article.savedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </a>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 rounded-full bg-white/80 p-1 text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:bg-gray-800/80"
        title={removeLabel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
