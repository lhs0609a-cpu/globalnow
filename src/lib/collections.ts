"use client";

import type { Collection, CollectionArticle } from "@/types/news";
import { getItem, setItem } from "./storage";

const STORAGE_KEY = "globalnow_collections";

export function getCollections(): Collection[] {
  return getItem<Collection[]>(STORAGE_KEY) || [];
}

function saveCollections(collections: Collection[]): void {
  setItem(STORAGE_KEY, collections);
}

export function createCollection(
  name: string,
  description: string = ""
): Collection {
  const collections = getCollections();
  const newCollection: Collection = {
    id: crypto.randomUUID(),
    name,
    description,
    articles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  collections.unshift(newCollection);
  saveCollections(collections);
  return newCollection;
}

export function deleteCollection(id: string): void {
  const collections = getCollections().filter((c) => c.id !== id);
  saveCollections(collections);
}

export function updateCollection(
  id: string,
  updates: Partial<Pick<Collection, "name" | "description">>
): Collection | null {
  const collections = getCollections();
  const idx = collections.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  Object.assign(collections[idx], updates, {
    updatedAt: new Date().toISOString(),
  });
  saveCollections(collections);
  return collections[idx];
}

export function addArticleToCollection(
  collectionId: string,
  article: CollectionArticle
): void {
  const collections = getCollections();
  const col = collections.find((c) => c.id === collectionId);
  if (!col) return;
  // Avoid duplicates
  if (col.articles.some((a) => a.url === article.url)) return;
  col.articles.unshift(article);
  col.updatedAt = new Date().toISOString();
  saveCollections(collections);
}

export function removeArticleFromCollection(
  collectionId: string,
  articleUrl: string
): void {
  const collections = getCollections();
  const col = collections.find((c) => c.id === collectionId);
  if (!col) return;
  col.articles = col.articles.filter((a) => a.url !== articleUrl);
  col.updatedAt = new Date().toISOString();
  saveCollections(collections);
}

export function getCollectionById(id: string): Collection | null {
  return getCollections().find((c) => c.id === id) || null;
}

export function generateShareUrl(collection: Collection): string {
  const data = {
    name: collection.name,
    description: collection.description,
    articles: collection.articles.slice(0, 20),
  };
  const encoded = btoa(
    encodeURIComponent(JSON.stringify(data))
  );
  return `${window.location.origin}${window.location.pathname.replace(/\/collections.*/, "/collections/shared")}?data=${encoded}`;
}

export function parseSharedCollection(
  data: string
): Omit<Collection, "id" | "createdAt" | "updatedAt"> | null {
  try {
    const decoded = JSON.parse(decodeURIComponent(atob(data)));
    return {
      name: decoded.name || "Shared Collection",
      description: decoded.description || "",
      articles: decoded.articles || [],
    };
  } catch {
    return null;
  }
}
