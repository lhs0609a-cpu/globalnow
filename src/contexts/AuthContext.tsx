"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Article } from "@/types/news";
import {
  getSession,
  login as authLogin,
  logout as authLogout,
  signup as authSignup,
  addBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked as checkBookmarked,
  ANONYMOUS_KEY,
} from "@/lib/auth";
import { getArticleId } from "@/lib/article-cache";
import type { BookmarkedArticle } from "@/types/auth";

interface AuthContextType {
  user: { email: string } | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleBookmark: (article: Article) => void;
  isBookmarked: (article: Article) => boolean;
  bookmarks: BookmarkedArticle[];
  refreshBookmarks: () => void;
  deleteBookmark: (articleId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [mounted, setMounted] = useState(false);

  // The storage key: user email if logged in, anonymous key otherwise
  const storageKey = user?.email || ANONYMOUS_KEY;

  useEffect(() => {
    setMounted(true);
    const session = getSession();
    if (session) {
      setUser(session);
      setBookmarks(getBookmarks(session.email));
    } else {
      // Load anonymous bookmarks
      setBookmarks(getBookmarks(ANONYMOUS_KEY));
    }
  }, []);

  const refreshBookmarks = useCallback(() => {
    setBookmarks(getBookmarks(storageKey));
  }, [storageKey]);

  const handleLogin = async (email: string, password: string) => {
    const result = await authLogin(email, password);
    if (result.success) {
      setUser({ email });
      // After login, bookmarks are migrated from anonymous → email
      setBookmarks(getBookmarks(email));
    }
    return result;
  };

  const handleSignup = async (email: string, password: string) => {
    return authSignup(email, password);
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    // Back to anonymous bookmarks
    setBookmarks(getBookmarks(ANONYMOUS_KEY));
  };

  const toggleBookmark = (article: Article) => {
    const articleId = getArticleId(article);
    if (checkBookmarked(storageKey, articleId)) {
      removeBookmark(storageKey, articleId);
    } else {
      addBookmark(storageKey, article);
    }
    refreshBookmarks();
  };

  const deleteBookmarkById = (articleId: string) => {
    removeBookmark(storageKey, articleId);
    refreshBookmarks();
  };

  const checkIsBookmarked = (article: Article) => {
    return checkBookmarked(storageKey, getArticleId(article));
  };

  if (!mounted) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          isAuthenticated: false,
          login: handleLogin,
          signup: handleSignup,
          logout: handleLogout,
          toggleBookmark: () => {},
          isBookmarked: () => false,
          bookmarks: [],
          refreshBookmarks: () => {},
          deleteBookmark: () => {},
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        toggleBookmark,
        isBookmarked: checkIsBookmarked,
        bookmarks,
        refreshBookmarks,
        deleteBookmark: deleteBookmarkById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
