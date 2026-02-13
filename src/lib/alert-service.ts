"use client";

import type { AlertSubscription, AlertNotification } from "@/types/news";
import { getItem, setItem, appendToArray } from "./storage";

const SUBS_KEY = "globalnow_alert_subs";
const NOTIFS_KEY = "globalnow_alert_notifs";
const SEEN_KEY = "globalnow_alert_seen";

// --- Subscriptions ---

export function getSubscriptions(): AlertSubscription[] {
  return getItem<AlertSubscription[]>(SUBS_KEY) || [];
}

export function addSubscription(
  keyword: string,
  country?: string
): AlertSubscription {
  const subs = getSubscriptions();
  const newSub: AlertSubscription = {
    id: crypto.randomUUID(),
    keyword,
    country: country as AlertSubscription["country"],
    enabled: true,
    createdAt: new Date().toISOString(),
  };
  subs.push(newSub);
  setItem(SUBS_KEY, subs);
  return newSub;
}

export function removeSubscription(id: string): void {
  const subs = getSubscriptions().filter((s) => s.id !== id);
  setItem(SUBS_KEY, subs);
}

export function toggleSubscription(id: string): void {
  const subs = getSubscriptions();
  const sub = subs.find((s) => s.id === id);
  if (sub) {
    sub.enabled = !sub.enabled;
    setItem(SUBS_KEY, subs);
  }
}

// --- Notifications ---

export function getNotifications(): AlertNotification[] {
  return getItem<AlertNotification[]>(NOTIFS_KEY) || [];
}

export function addNotification(
  subscriptionId: string,
  article: AlertNotification["article"]
): void {
  const notif: AlertNotification = {
    id: crypto.randomUUID(),
    subscriptionId,
    article,
    readAt: null,
    createdAt: new Date().toISOString(),
  };
  appendToArray(NOTIFS_KEY, notif, 100);
}

export function markAsRead(id: string): void {
  const notifs = getNotifications();
  const notif = notifs.find((n) => n.id === id);
  if (notif) {
    notif.readAt = new Date().toISOString();
    setItem(NOTIFS_KEY, notifs);
  }
}

export function markAllAsRead(): void {
  const notifs = getNotifications();
  const now = new Date().toISOString();
  for (const n of notifs) {
    if (!n.readAt) n.readAt = now;
  }
  setItem(NOTIFS_KEY, notifs);
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.readAt).length;
}

// --- Seen URLs (prevent duplicate alerts) ---

export function getSeenUrls(): Set<string> {
  const arr = getItem<string[]>(SEEN_KEY) || [];
  return new Set(arr);
}

export function addSeenUrls(urls: string[]): void {
  const arr = getItem<string[]>(SEEN_KEY) || [];
  const set = new Set(arr);
  for (const url of urls) set.add(url);
  // Keep only last 500
  const newArr = [...set].slice(-500);
  setItem(SEEN_KEY, newArr);
}

// --- Browser Notification ---

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function sendBrowserNotification(
  title: string,
  body: string,
  url?: string
): void {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;

  const notification = new Notification(title, {
    body,
    icon: "/favicon.ico",
    tag: "globalnow-alert",
  });

  if (url) {
    notification.onclick = () => {
      window.open(url, "_blank");
      notification.close();
    };
  }
}
