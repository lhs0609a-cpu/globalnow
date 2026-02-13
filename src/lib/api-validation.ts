/**
 * Shared input validation for API routes.
 * Validates and sanitizes query parameters to prevent injection and abuse.
 */

const VALID_CATEGORIES = new Set([
  "general",
  "business",
  "technology",
  "sports",
  "science",
  "health",
  "entertainment",
]);

const VALID_COUNTRIES = new Set([
  "kr", "us", "jp", "gb", "fr", "de", "cn",
  "in", "ae", "sa", "il", "au", "ca", "br", "ru",
]);

const MAX_QUERY_LENGTH = 200;
const MAX_PAGE_SIZE = 50;
const MAX_PAGE = 1000;

// Stock symbol: alphanumeric, dots, hyphens, up to 20 chars
const STOCK_SYMBOL_RE = /^[A-Za-z0-9.\-^=]{1,20}$/;

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCategory(value: string | null): {
  valid: boolean;
  value: string;
  error?: string;
} {
  const v = (value || "general").toLowerCase();
  if (!VALID_CATEGORIES.has(v)) {
    return {
      valid: false,
      value: "general",
      error: `Invalid category. Allowed: ${[...VALID_CATEGORIES].join(", ")}`,
    };
  }
  return { valid: true, value: v };
}

export function validateCountry(value: string | null): {
  valid: boolean;
  value: string;
  error?: string;
} {
  const v = (value || "us").toLowerCase();
  if (!VALID_COUNTRIES.has(v)) {
    return {
      valid: false,
      value: "us",
      error: `Invalid country. Allowed: ${[...VALID_COUNTRIES].join(", ")}`,
    };
  }
  return { valid: true, value: v };
}

export function validatePageSize(value: string | null): {
  valid: boolean;
  value: number;
  error?: string;
} {
  const raw = parseInt(value || "20", 10);
  if (isNaN(raw) || raw < 1) {
    return { valid: false, value: 20, error: "pageSize must be a positive integer" };
  }
  if (raw > MAX_PAGE_SIZE) {
    return { valid: false, value: MAX_PAGE_SIZE, error: `pageSize cannot exceed ${MAX_PAGE_SIZE}` };
  }
  return { valid: true, value: raw };
}

export function validatePage(value: string | null): {
  valid: boolean;
  value: number;
  error?: string;
} {
  const raw = parseInt(value || "1", 10);
  if (isNaN(raw) || raw < 1) {
    return { valid: false, value: 1, error: "page must be a positive integer" };
  }
  if (raw > MAX_PAGE) {
    return { valid: false, value: 1, error: `page cannot exceed ${MAX_PAGE}` };
  }
  return { valid: true, value: raw };
}

export function validateQuery(value: string | null): {
  valid: boolean;
  value: string;
  error?: string;
} {
  if (!value) return { valid: true, value: "" };

  const trimmed = value.trim();
  if (trimmed.length > MAX_QUERY_LENGTH) {
    return {
      valid: false,
      value: trimmed.slice(0, MAX_QUERY_LENGTH),
      error: `Query too long. Maximum ${MAX_QUERY_LENGTH} characters`,
    };
  }

  // Remove control characters and null bytes
  const sanitized = trimmed.replace(/[\x00-\x1f\x7f]/g, "");

  return { valid: true, value: sanitized };
}

export function validateStockSymbol(value: string | null): {
  valid: boolean;
  value: string;
  error?: string;
} {
  if (!value || !value.trim()) {
    return { valid: false, value: "", error: "Missing symbol parameter" };
  }

  const trimmed = value.trim().toUpperCase();
  if (!STOCK_SYMBOL_RE.test(trimmed)) {
    return { valid: false, value: "", error: "Invalid stock symbol format" };
  }

  return { valid: true, value: trimmed };
}
