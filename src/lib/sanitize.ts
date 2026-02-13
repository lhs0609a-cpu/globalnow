/**
 * HTML/XSS sanitization utilities for user-facing text content.
 * Strips dangerous patterns from RSS feeds, API responses, etc.
 */

// Dangerous event handler attributes (onclick, onerror, onload, etc.)
const EVENT_HANDLER_RE = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi;

// <script>...</script> and <script ... />
const SCRIPT_TAG_RE = /<script[\s>][\s\S]*?<\/script>/gi;
const SCRIPT_SELF_CLOSE_RE = /<script[^>]*\/>/gi;

// <iframe>, <object>, <embed>, <form>, <base>, <meta http-equiv>
const DANGEROUS_TAGS_RE =
  /<\/?(iframe|object|embed|form|base|meta|link|style|svg|math)[^>]*>/gi;

// javascript:, vbscript:, data: URIs (in href, src, action, etc.)
const DANGEROUS_URI_RE =
  /(?:href|src|action|formaction|poster|background)\s*=\s*(?:"(?:javascript|vbscript|data)\s*:[^"]*"|'(?:javascript|vbscript|data)\s*:[^']*')/gi;

// HTML comments that might contain conditional IE exploits: <!--[if ...]>
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g;

// Expression/eval patterns in attribute values
const EXPRESSION_RE = /expression\s*\(/gi;

/**
 * Sanitize a string that may contain HTML/XML from external sources.
 * Removes dangerous elements while preserving safe text content.
 * This is meant to be applied BEFORE decodeEntities / tag stripping.
 */
export function sanitizeHTML(input: string): string {
  if (!input) return input;

  let result = input;

  // 1. Remove HTML comments (may contain IE conditional exploits)
  result = result.replace(HTML_COMMENT_RE, "");

  // 2. Remove <script> tags and their content
  result = result.replace(SCRIPT_TAG_RE, "");
  result = result.replace(SCRIPT_SELF_CLOSE_RE, "");

  // 3. Remove dangerous tags (iframe, object, embed, form, etc.)
  result = result.replace(DANGEROUS_TAGS_RE, "");

  // 4. Remove event handler attributes (onclick, onerror, etc.)
  result = result.replace(EVENT_HANDLER_RE, "");

  // 5. Remove dangerous URI schemes in attributes
  result = result.replace(DANGEROUS_URI_RE, "");

  // 6. Remove CSS expression() calls
  result = result.replace(EXPRESSION_RE, "");

  return result;
}

/**
 * Sanitize plain text content (after HTML tags have been stripped).
 * Removes any remaining dangerous patterns that could be injected.
 */
export function sanitizeText(input: string): string {
  if (!input) return input;

  let result = input;

  // Remove any remaining HTML tags
  result = result.replace(/<[^>]+>/g, "");

  // Remove null bytes
  result = result.replace(/\0/g, "");

  // Trim excessive whitespace
  result = result.replace(/\s{10,}/g, " ");

  return result.trim();
}

/**
 * Sanitize a URL string. Returns empty string if the URL is dangerous.
 */
export function sanitizeURL(url: string): string {
  if (!url) return "";

  const trimmed = url.trim();

  // Block javascript:, vbscript:, data: URIs
  const lower = trimmed.toLowerCase().replace(/\s/g, "");
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:text/html")
  ) {
    return "";
  }

  // Only allow http, https, and protocol-relative URLs
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("//")
  ) {
    return trimmed;
  }

  // Relative URLs are OK for internal use
  if (trimmed.startsWith("/") || trimmed.startsWith("./")) {
    return trimmed;
  }

  // Block everything else (could be a disguised URI)
  if (trimmed.includes(":")) {
    return "";
  }

  return trimmed;
}
