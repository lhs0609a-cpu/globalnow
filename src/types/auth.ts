export interface User {
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthState {
  user: { email: string } | null;
  isAuthenticated: boolean;
}

export interface BookmarkedArticle {
  articleId: string;
  title: string;
  description: string | null;
  urlToImage: string | null;
  url: string;
  source: string;
  savedAt: string;
}
