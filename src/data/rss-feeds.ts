import type { RSSFeedDef, CountryCode, Category } from "@/types/news";

export const RSS_FEEDS: RSSFeedDef[] = [
  // --- US ---
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", name: "New York Times", country: "us", category: "general", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml", name: "BBC US", country: "us", category: "general", language: "en" },
  { url: "https://feeds.reuters.com/reuters/topNews", name: "Reuters", country: "us", category: "general", language: "en" },
  { url: "https://rss.cnn.com/rss/edition.rss", name: "CNN", country: "us", category: "general", language: "en" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", name: "NYT Tech", country: "us", category: "technology", language: "en" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", name: "NYT Business", country: "us", category: "business", language: "en" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml", name: "NYT Sports", country: "us", category: "sports", language: "en" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml", name: "NYT Science", country: "us", category: "science", language: "en" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml", name: "NYT Health", country: "us", category: "health", language: "en" },

  // --- GB ---
  { url: "https://feeds.bbci.co.uk/news/rss.xml", name: "BBC News", country: "gb", category: "general", language: "en" },
  { url: "https://www.theguardian.com/world/rss", name: "The Guardian", country: "gb", category: "general", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", name: "BBC Tech", country: "gb", category: "technology", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/business/rss.xml", name: "BBC Business", country: "gb", category: "business", language: "en" },
  { url: "https://feeds.bbci.co.uk/sport/rss.xml", name: "BBC Sport", country: "gb", category: "sports", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", name: "BBC Science", country: "gb", category: "science", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/health/rss.xml", name: "BBC Health", country: "gb", category: "health", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml", name: "BBC Entertainment", country: "gb", category: "entertainment", language: "en" },

  // --- JP ---
  { url: "https://www3.nhk.or.jp/rss/news/cat0.xml", name: "NHK News", country: "jp", category: "general", language: "ja" },
  { url: "https://www.theguardian.com/world/japan/rss", name: "Guardian Japan", country: "jp", category: "general", language: "en" },

  // --- KR ---
  { url: "https://www.koreaherald.com/common/rss_xml.php?ct=102", name: "Korea Herald", country: "kr", category: "general", language: "en" },
  { url: "http://feeds.feedburner.com/koaborea", name: "Korea Observer", country: "kr", category: "general", language: "en" },

  // --- FR ---
  { url: "https://www.france24.com/en/rss", name: "France 24", country: "fr", category: "general", language: "en" },
  { url: "https://www.theguardian.com/world/france/rss", name: "Guardian France", country: "fr", category: "general", language: "en" },

  // --- DE ---
  { url: "https://www.dw.com/rss/en/top-stories/s-9097", name: "DW News", country: "de", category: "general", language: "en" },
  { url: "https://www.theguardian.com/world/germany/rss", name: "Guardian Germany", country: "de", category: "general", language: "en" },

  // --- CN ---
  { url: "https://www.scmp.com/rss/91/feed", name: "SCMP", country: "cn", category: "general", language: "en" },
  { url: "https://www.theguardian.com/world/china/rss", name: "Guardian China", country: "cn", category: "general", language: "en" },

  // --- IN ---
  { url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms", name: "Times of India", country: "in", category: "general", language: "en" },
  { url: "https://www.theguardian.com/world/india/rss", name: "Guardian India", country: "in", category: "general", language: "en" },

  // --- AU ---
  { url: "https://www.theguardian.com/australia-news/rss", name: "Guardian Australia", country: "au", category: "general", language: "en" },
  { url: "https://feeds.bbci.co.uk/news/world/australia/rss.xml", name: "BBC Australia", country: "au", category: "general", language: "en" },

  // --- CA ---
  { url: "https://www.cbc.ca/webfeed/rss/rss-topstories", name: "CBC News", country: "ca", category: "general", language: "en" },

  // --- BR ---
  { url: "https://rss.app/feeds/v1.1/tLfZ2cLgrCJaAsnq.xml", name: "Brazil News", country: "br", category: "general", language: "en" },
  { url: "https://www.theguardian.com/world/brazil/rss", name: "Guardian Brazil", country: "br", category: "general", language: "en" },

  // --- AE ---
  { url: "https://www.theguardian.com/world/middleeast/rss", name: "Guardian Middle East", country: "ae", category: "general", language: "en" },

  // --- SA ---
  { url: "https://www.arabnews.com/rss.xml", name: "Arab News", country: "sa", category: "general", language: "en" },

  // --- IL ---
  { url: "https://www.timesofisrael.com/feed/", name: "Times of Israel", country: "il", category: "general", language: "en" },

  // --- RU ---
  { url: "https://www.theguardian.com/world/russia/rss", name: "Guardian Russia", country: "ru", category: "general", language: "en" },
];

export function getFeedsByCountry(country: CountryCode): RSSFeedDef[] {
  return RSS_FEEDS.filter((f) => f.country === country);
}

export function getFeedsByCategory(category: Category): RSSFeedDef[] {
  return RSS_FEEDS.filter((f) => f.category === category);
}

export function getFeedsByCountryAndCategory(
  country: CountryCode,
  category: Category
): RSSFeedDef[] {
  const exact = RSS_FEEDS.filter(
    (f) => f.country === country && f.category === category
  );
  if (exact.length > 0) return exact;
  // Fallback: return general feeds for this country
  return RSS_FEEDS.filter(
    (f) => f.country === country && f.category === "general"
  );
}
