import type { Article } from "@/types/news";
import { sanitizeHTML, sanitizeText, sanitizeURL } from "@/lib/sanitize";

/**
 * Parse RSS 2.0 or Atom XML into Article[] without npm packages.
 * Uses regex-based extraction (server-side, no DOMParser available).
 */

function extractTag(xml: string, tag: string): string {
  // Try CDATA first
  const cdataRe = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
    "i"
  );
  const cdataMatch = xml.match(cdataRe);
  if (cdataMatch) return cdataMatch[1].trim();

  // Regular tag
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(re);
  return match ? match[1].trim() : "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i");
  const match = xml.match(re);
  return match ? match[1].trim() : "";
}

function decodeEntities(text: string): string {
  // Sanitize HTML first to remove dangerous elements before stripping tags
  const sanitized = sanitizeHTML(text);
  return sanitized
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<[^>]+>/g, ""); // Strip remaining HTML tags
}

function extractImageFromContent(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
  if (imgMatch) return sanitizeURL(imgMatch[1]);
  const mediaMatch = content.match(
    /<media:content[^>]+url="([^"]+)"/i
  );
  return mediaMatch ? sanitizeURL(mediaMatch[1]) : null;
}

function parseRSSItems(xml: string, sourceName: string): Article[] {
  const items: Article[] = [];
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = decodeEntities(extractTag(itemXml, "title"));
    if (!title || title === "[Removed]") continue;

    const link = extractTag(itemXml, "link") || extractTag(itemXml, "guid");
    const description = decodeEntities(
      extractTag(itemXml, "description")
    );
    const pubDate = extractTag(itemXml, "pubDate");
    const content =
      extractTag(itemXml, "content:encoded") ||
      extractTag(itemXml, "content");
    const creator =
      extractTag(itemXml, "dc:creator") ||
      extractTag(itemXml, "author");

    // Try to find an image
    let image: string | null =
      extractAttr(itemXml, "media:content", "url") ||
      extractAttr(itemXml, "media:thumbnail", "url") ||
      extractAttr(itemXml, "enclosure", "url") ||
      null;

    if (!image && content) {
      image = extractImageFromContent(content);
    }
    if (!image && description) {
      image = extractImageFromContent(description);
    }

    items.push({
      source: { id: null, name: sanitizeText(sourceName) },
      author: creator ? sanitizeText(decodeEntities(creator)) : null,
      title: sanitizeText(title),
      description: description ? sanitizeText(description) : null,
      url: sanitizeURL(link),
      urlToImage: image ? sanitizeURL(image) : null,
      publishedAt: pubDate
        ? new Date(pubDate).toISOString()
        : new Date().toISOString(),
      content: content ? sanitizeText(decodeEntities(content)).slice(0, 500) : null,
    });
  }

  return items;
}

function parseAtomEntries(xml: string, sourceName: string): Article[] {
  const items: Article[] = [];
  const entryRegex = /<entry[\s>]([\s\S]*?)<\/entry>/gi;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryXml = match[1];
    const title = decodeEntities(extractTag(entryXml, "title"));
    if (!title) continue;

    // Atom links are in <link href="..." /> or <link rel="alternate" href="..." />
    const linkMatch = entryXml.match(
      /<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i
    ) || entryXml.match(/<link[^>]*href="([^"]+)"/i);
    const link = linkMatch ? linkMatch[1] : "";

    const summary = decodeEntities(
      extractTag(entryXml, "summary") || extractTag(entryXml, "content")
    );
    const updated =
      extractTag(entryXml, "published") || extractTag(entryXml, "updated");
    const author = extractTag(entryXml, "name");

    let image: string | null =
      extractAttr(entryXml, "media:content", "url") ||
      extractAttr(entryXml, "media:thumbnail", "url") ||
      null;

    if (!image && summary) {
      image = extractImageFromContent(summary);
    }

    items.push({
      source: { id: null, name: sanitizeText(sourceName) },
      author: author ? sanitizeText(decodeEntities(author)) : null,
      title: sanitizeText(title),
      description: summary ? sanitizeText(summary) : null,
      url: sanitizeURL(link),
      urlToImage: image ? sanitizeURL(image) : null,
      publishedAt: updated
        ? new Date(updated).toISOString()
        : new Date().toISOString(),
      content: null,
    });
  }

  return items;
}

export function parseRSSXML(xml: string, sourceName: string): Article[] {
  // Detect Atom vs RSS
  if (xml.includes("<feed") && xml.includes("<entry")) {
    return parseAtomEntries(xml, sourceName);
  }
  return parseRSSItems(xml, sourceName);
}
