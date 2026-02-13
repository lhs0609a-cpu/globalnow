"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAlerts } from "@/contexts/AlertContext";
import {
  addSubscription,
  removeSubscription,
  toggleSubscription,
  requestNotificationPermission,
} from "@/lib/alert-service";

export default function AlertSubscriptionManager() {
  const [keyword, setKeyword] = useState("");
  const [permDenied, setPermDenied] = useState(false);
  const { subscriptions, refreshSubscriptions } = useAlerts();
  const t = useTranslations("Alerts");

  const handleAdd = async () => {
    if (!keyword.trim()) return;

    const granted = await requestNotificationPermission();
    if (!granted) {
      setPermDenied(true);
    }

    addSubscription(keyword.trim());
    refreshSubscriptions();
    setKeyword("");
  };

  const handleRemove = (id: string) => {
    removeSubscription(id);
    refreshSubscriptions();
  };

  const handleToggle = (id: string) => {
    toggleSubscription(id);
    refreshSubscriptions();
  };

  return (
    <div className="p-4">
      {permDenied && (
        <div className="mb-3 rounded-lg bg-yellow-50 p-2 text-xs text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">
          {t("permissionDenied")}
        </div>
      )}

      {/* Add subscription */}
      <div className="mb-3 flex gap-1.5">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={t("keywordPlaceholder")}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
        <button
          onClick={handleAdd}
          disabled={!keyword.trim()}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {t("add")}
        </button>
      </div>

      {/* Subscription list */}
      <div className="space-y-1.5">
        {subscriptions.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
            {t("noSubscriptions")}
          </p>
        ) : (
          subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700/50"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(sub.id)}
                  className={`h-4 w-4 rounded border transition-colors ${
                    sub.enabled
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {sub.enabled && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="white"
                      className="h-3 w-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  )}
                </button>
                <span
                  className={`text-sm ${
                    sub.enabled
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-gray-400 line-through dark:text-gray-500"
                  }`}
                >
                  {sub.keyword}
                </span>
              </div>
              <button
                onClick={() => handleRemove(sub.id)}
                className="rounded p-0.5 text-gray-400 hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
