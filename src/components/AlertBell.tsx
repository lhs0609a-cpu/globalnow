"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAlerts } from "@/contexts/AlertContext";
import AlertSubscriptionManager from "./AlertSubscriptionManager";

export default function AlertBell() {
  const [open, setOpen] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const { notifications, unreadCount, markAllAsRead } = useAlerts();
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("Alerts");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowManager(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setShowManager(false);
      }
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

  const recentNotifs = notifications.slice(0, 10);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label={t("title")}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {t("title")}
            </h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                >
                  {t("markAllRead")}
                </button>
              )}
              <button
                onClick={() => setShowManager(!showManager)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showManager ? t("showNotifications") : t("manageSubscriptions")}
              </button>
            </div>
          </div>

          {/* Content */}
          {showManager ? (
            <AlertSubscriptionManager />
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {recentNotifs.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t("noNotifications")}
                  </p>
                  <button
                    onClick={() => setShowManager(true)}
                    className="mt-2 text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {t("addSubscription")}
                  </button>
                </div>
              ) : (
                recentNotifs.map((notif) => (
                  <a
                    key={notif.id}
                    href={notif.article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 ${
                      !notif.readAt
                        ? "bg-blue-50/50 dark:bg-blue-900/10"
                        : ""
                    }`}
                  >
                    <p className="line-clamp-2 text-sm text-gray-900 dark:text-gray-100">
                      {notif.article.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <span>{notif.article.source}</span>
                      <span>
                        {new Date(notif.createdAt).toLocaleTimeString(
                          undefined,
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </span>
                    </div>
                  </a>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
