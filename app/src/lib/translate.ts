/**
 * LibreTranslate dynamic translation utility.
 * Used as a fallback for translating dynamic content (e.g. user-generated
 * service titles, descriptions, booking notes) that can't be covered by
 * static JSON files.
 *
 * Flow:
 *   1. Check in-memory cache → instant
 *   2. Check localStorage cache → instant (persists across refreshes)
 *   3. Call LibreTranslate API → cache result → return
 *
 * Free public instance: https://libretranslate.com
 * Self-hosted docs: https://github.com/LibreTranslate/LibreTranslate
 */

const LIBRE_URL =
  process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL || 'https://libretranslate.com';

// Language code map  (our app codes → LibreTranslate ISO-639 codes)
const LANG_MAP: Record<string, string> = {
  EN: 'en',
  AR: 'ar',
  TR: 'tr',
};

// ── In-memory cache (fast, session-scoped) ─────────────────────────────
const memoryCache = new Map<string, string>();

function cacheKey(text: string, target: string): string {
  return `lt_${target}_${text}`;
}

// ── localStorage helpers (survives page refreshes) ─────────────────────
function readLocalCache(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalCache(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage may be full – silently ignore
  }
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Translate a piece of dynamic text to the target language.
 *
 * @param text     The source text (assumed to be English)
 * @param target   Target language code: 'EN' | 'AR' | 'TR'
 * @returns        The translated string, or the original text if translation fails
 */
export async function translateDynamic(
  text: string,
  target: string,
): Promise<string> {
  // No translation needed if target is English (source language)
  if (!text || target === 'EN') return text;

  const key = cacheKey(text, target);

  // 1. Memory cache
  const mem = memoryCache.get(key);
  if (mem) return mem;

  // 2. localStorage cache
  const local = readLocalCache(key);
  if (local) {
    memoryCache.set(key, local);
    return local;
  }

  // 3. Call LibreTranslate
  const targetCode = LANG_MAP[target] || target.toLowerCase();
  try {
    const res = await fetch(`${LIBRE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetCode,
        format: 'text',
      }),
    });

    if (!res.ok) {
      console.warn('[LibreTranslate] API error:', res.status);
      return text;
    }

    const data = await res.json();
    const translated: string = data.translatedText || text;

    // Cache the result in both layers
    memoryCache.set(key, translated);
    writeLocalCache(key, translated);

    return translated;
  } catch (err) {
    console.warn('[LibreTranslate] Network error, returning original:', err);
    return text;
  }
}

/**
 * React hook helper – translates text and returns it via state.
 * Usage:
 *   const translated = useTranslatedText('Hello world', language);
 */
import { useState, useEffect } from 'react';

export function useTranslatedText(text: string, language: string): string {
  const [result, setResult] = useState(text);

  useEffect(() => {
    let cancelled = false;
    translateDynamic(text, language).then((t) => {
      if (!cancelled) setResult(t);
    });
    return () => {
      cancelled = true;
    };
  }, [text, language]);

  return result;
}

/**
 * Format a price with the correct currency symbol for the active language.
 *
 * @param price    Numeric price value
 * @param language Active language code: 'EN' | 'AR' | 'TR'
 * @returns        Formatted string like "$120", "120 ₺", or "120 ر.س"
 */
export function formatPrice(price: number | string | null | undefined, language: string, currency?: string): string {
  if (price === null || price === undefined || price === '') return '';
  const p = typeof price === 'string' ? price : price.toString();

  // If a specific currency is provided, format with it directly
  if (currency) {
    switch (currency.toUpperCase()) {
      case 'TRY': return `${p} ₺`;
      case 'SAR': return `${p} ر.س`;
      case 'USD': return `$${p}`;
      default: return `${p} ${currency}`;
    }
  }

  // Fallback to language-based currency format
  switch (language) {
    case 'TR':
      return `${p} ₺`;
    case 'AR':
      return `${p} ر.س`;
    default:
      return `$${p}`;
  }
}
