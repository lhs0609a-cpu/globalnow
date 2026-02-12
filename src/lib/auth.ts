import type { User, BookmarkedArticle } from "@/types/auth";
import type { Article } from "@/types/news";
import { getArticleId } from "./article-cache";

const USERS_KEY = "globalnow_users";
const SESSION_KEY = "globalnow_session";
const BOOKMARKS_KEY = "globalnow_bookmarks";

// Simple hash function (NOT cryptographically secure - MVP only)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "globalnow_salt");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getUsers(): Record<string, User> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, User>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function signup(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const users = getUsers();
  if (users[email]) {
    return { success: false, error: "emailExists" };
  }

  const passwordHash = await hashPassword(password);
  users[email] = {
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  saveUsers(users);
  return { success: true };
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const users = getUsers();
  const user = users[email];
  if (!user) {
    return { success: false, error: "invalidCredentials" };
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return { success: false, error: "invalidCredentials" };
  }

  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
  return { success: true };
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSession(): { email: string } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Bookmarks
function getBookmarksMap(): Record<string, BookmarkedArticle[]> {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveBookmarksMap(map: Record<string, BookmarkedArticle[]>) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(map));
}

export function addBookmark(email: string, article: Article) {
  const map = getBookmarksMap();
  if (!map[email]) map[email] = [];

  const articleId = getArticleId(article);
  if (map[email].some((b) => b.articleId === articleId)) return;

  map[email].push({
    articleId,
    title: article.title,
    description: article.description,
    urlToImage: article.urlToImage,
    url: article.url,
    source: article.source.name,
    savedAt: new Date().toISOString(),
  });
  saveBookmarksMap(map);
}

export function removeBookmark(email: string, articleId: string) {
  const map = getBookmarksMap();
  if (!map[email]) return;
  map[email] = map[email].filter((b) => b.articleId !== articleId);
  saveBookmarksMap(map);
}

export function getBookmarks(email: string): BookmarkedArticle[] {
  const map = getBookmarksMap();
  return map[email] || [];
}

export function isBookmarked(email: string, articleId: string): boolean {
  const bookmarks = getBookmarks(email);
  return bookmarks.some((b) => b.articleId === articleId);
}
