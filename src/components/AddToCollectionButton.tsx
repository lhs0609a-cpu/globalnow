"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { Article } from "@/types/news";
import {
  getCollections,
  addArticleToCollection,
  createCollection,
} from "@/lib/collections";
import type { Collection } from "@/types/news";

interface AddToCollectionButtonProps {
  article: Article;
  compact?: boolean;
}

export default function AddToCollectionButton({
  article,
  compact = false,
}: AddToCollectionButtonProps) {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("Collections");

  useEffect(() => {
    if (open) {
      setCollections(getCollections());
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleAdd = (collectionId: string) => {
    addArticleToCollection(collectionId, {
      title: article.title,
      url: article.url,
      source: article.source.name,
      urlToImage: article.urlToImage,
      savedAt: new Date().toISOString(),
      description: article.description,
    });
    setAdded(collectionId);
    setTimeout(() => {
      setAdded(null);
      setOpen(false);
    }, 800);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const col = createCollection(newName.trim());
    handleAdd(col.id);
    setNewName("");
    setShowCreate(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className={compact
          ? "rounded-full p-1.5 transition-colors bg-white/80 text-gray-400 hover:text-blue-500 dark:bg-gray-800/80 dark:text-gray-500 dark:hover:text-blue-400"
          : "flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }
        aria-label={t("addTo")}
        aria-expanded={open}
        title={t("addTo")}
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
            d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
          />
        </svg>
        {!compact && t("addTo")}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
          <div className="max-h-48 overflow-y-auto p-2">
            {collections.length === 0 && !showCreate && (
              <p className="px-2 py-3 text-center text-xs text-gray-400 dark:text-gray-500">
                {t("noCollections")}
              </p>
            )}
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => handleAdd(col.id)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <span className="truncate">{col.name}</span>
                {added === col.id && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 p-2 dark:border-gray-600">
            {showCreate ? (
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder={t("newCollectionName")}
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  autoFocus
                />
                <button
                  onClick={handleCreate}
                  className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                >
                  {t("create")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCreate(true)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                {t("newCollection")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
