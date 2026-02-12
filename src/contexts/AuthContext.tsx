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

  useEffect(() => {
    setMounted(true);
    const session = getSession();
    if (session) {
      setUser(session);
      setBookmarks(getBookmarks(session.email));
    }
  }, []);

  const refreshBookmarks = useCallback(() => {
    if (user) {
      setBookmarks(getBookmarks(user.email));
    }
  }, [user]);

  const handleLogin = async (email: string, password: string) => {
    const result = await authLogin(email, password);
    if (result.success) {
      setUser({ email });
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
    setBookmarks([]);
  };

  const toggleBookmark = (article: Article) => {
    if (!user) return;
    const articleId = getArticleId(article);
    if (checkBookmarked(user.email, articleId)) {
      removeBookmark(user.email, articleId);
    } else {
      addBookmark(user.email, article);
    }
    refreshBookmarks();
  };

  const deleteBookmarkById = (articleId: string) => {
    if (!user) return;
    removeBookmark(user.email, articleId);
    refreshBookmarks();
  };

  const checkIsBookmarked = (article: Article) => {
    if (!user) return false;
    return checkBookmarked(user.email, getArticleId(article));
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
          toggleBookmark,
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
