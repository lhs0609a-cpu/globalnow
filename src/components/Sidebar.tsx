"use client";

import StockIndicesWidget from "./StockIndicesWidget";
import CryptoWidget from "./CryptoWidget";
import ExchangeRateWidget from "./ExchangeRateWidget";
import FearGreedWidget from "./FearGreedWidget";
import TrendingTopics from "./TrendingTopics";

interface SidebarProps {
  onTrendClick: (keyword: string) => void;
}

export default function Sidebar({ onTrendClick }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-4">
      <StockIndicesWidget />
      <CryptoWidget />
      <ExchangeRateWidget />
      <FearGreedWidget />
      <TrendingTopics onTopicClick={onTrendClick} />
    </aside>
  );
}
