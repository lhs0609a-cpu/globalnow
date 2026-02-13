"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { AlertSubscription, AlertNotification } from "@/types/news";
import {
  getSubscriptions,
  getNotifications,
  getUnreadCount,
  getSeenUrls,
  addSeenUrls,
  addNotification,
  sendBrowserNotification,
  markAllAsRead as markAllAsReadService,
} from "@/lib/alert-service";
import { fetchNews } from "@/lib/api";

interface AlertContextValue {
  subscriptions: AlertSubscription[];
  notifications: AlertNotification[];
  unreadCount: number;
  refreshSubscriptions: () => void;
  refreshNotifications: () => void;
  markAllAsRead: () => void;
}

const AlertContext = createContext<AlertContextValue>({
  subscriptions: [],
  notifications: [],
  unreadCount: 0,
  refreshSubscriptions: () => {},
  refreshNotifications: () => {},
  markAllAsRead: () => {},
});

export function useAlerts() {
  return useContext(AlertContext);
}

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<AlertSubscription[]>([]);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshSubscriptions = useCallback(() => {
    setSubscriptions(getSubscriptions());
  }, []);

  const refreshNotifications = useCallback(() => {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
  }, []);

  const markAllAsRead = useCallback(() => {
    markAllAsReadService();
    refreshNotifications();
  }, [refreshNotifications]);

  // Poll for new articles matching subscriptions
  const poll = useCallback(async () => {
    const subs = getSubscriptions().filter((s) => s.enabled);
    if (subs.length === 0) return;

    const seenUrls = getSeenUrls();
    const newUrls: string[] = [];

    for (const sub of subs) {
      try {
        const data = await fetchNews({
          q: sub.keyword,
          country: sub.country,
          pageSize: 5,
        });

        for (const article of data.articles) {
          if (article.title === "[Removed]") continue;
          if (seenUrls.has(article.url)) continue;

          newUrls.push(article.url);
          addNotification(sub.id, {
            title: article.title,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt,
          });

          sendBrowserNotification(
            `GlobalNow: "${sub.keyword}"`,
            article.title,
            article.url
          );
        }
      } catch {
        // Silently fail per subscription
      }
    }

    if (newUrls.length > 0) {
      addSeenUrls(newUrls);
      refreshNotifications();
    }
  }, [refreshNotifications]);

  // Initialize
  useEffect(() => {
    refreshSubscriptions();
    refreshNotifications();
  }, [refreshSubscriptions, refreshNotifications]);

  // Set up polling
  useEffect(() => {
    // Initial poll after 30 seconds
    const timeout = setTimeout(poll, 30000);

    intervalRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [poll]);

  return (
    <AlertContext.Provider
      value={{
        subscriptions,
        notifications,
        unreadCount,
        refreshSubscriptions,
        refreshNotifications,
        markAllAsRead,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}
