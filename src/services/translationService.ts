/**
 * Translation service using MyMemory API with caching
 * Provides reliable, cached translations for the portfolio
 */

interface TranslationCache {
  [key: string]: string;
}

interface LanguageCache {
  [lang: string]: TranslationCache;
}

class TranslationService {
  private cache: LanguageCache = {};
  private requestQueue: Array<{ text: string; lang: string; resolve: (text: string) => void; reject: (error: Error) => void }> = [];
  private isProcessing = false;
  private requestDelay = 100; // ms between requests to avoid rate limits

  constructor() {
    this.loadCacheFromStorage();
  }

  private loadCacheFromStorage() {
    try {
      const stored = window.localStorage.getItem('portfolio-translation-cache');
      if (stored) {
        this.cache = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load translation cache:', e);
    }
  }

  private saveCacheToStorage() {
    try {
      window.localStorage.setItem('portfolio-translation-cache', JSON.stringify(this.cache));
    } catch (e) {
      console.error('Failed to save translation cache:', e);
    }
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (!request) break;

      try {
        const translation = await this.fetchTranslation(request.text, request.lang);
        request.resolve(translation);
      } catch (error) {
        request.reject(error as Error);
      }

      // Delay between requests to avoid rate limiting
      if (this.requestQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.requestDelay));
      }
    }
    this.isProcessing = false;
  }

  private async fetchTranslation(text: string, targetLang: string): Promise<string> {
    // If text is empty or already cached, return immediately
    if (!text || !text.trim()) return text;

    if (!this.cache[targetLang]) {
      this.cache[targetLang] = {};
    }

    const cacheKey = text.toLowerCase();
    if (this.cache[targetLang][cacheKey]) {
      return this.cache[targetLang][cacheKey];
    }

    // Use MyMemory API for translation
    try {
      const encodedText = encodeURIComponent(text);
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLang}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Check for API status
      if (data.responseStatus === 429) {
        throw new Error('Rate limited, returning original text');
      }

      if (data.responseData && data.responseData.translatedText) {
        const translatedText = data.responseData.translatedText;
        this.cache[targetLang][cacheKey] = translatedText;
        this.saveCacheToStorage();
        return translatedText;
      }

      return text;
    } catch (error) {
      console.warn(`Translation failed for "${text}" to ${targetLang}:`, error);
      // Return original text if translation fails
      return text;
    }
  }

  async translate(text: string, targetLang: string): Promise<string> {
    // If target is English, no translation needed
    if (targetLang === 'en') {
      return text;
    }

    return new Promise((resolve, reject) => {
      this.requestQueue.push({ text, lang: targetLang, resolve, reject });
      this.processQueue();
    });
  }

  async translateMultiple(texts: string[], targetLang: string): Promise<string[]> {
    return Promise.all(texts.map(text => this.translate(text, targetLang)));
  }

  /**
   * Translates the entire page DOM by replacing text nodes
   */
  async translatePageDOM(targetLang: string): Promise<void> {
    if (targetLang === 'en') {
      // No translation needed for English
      return;
    }

    const replacements: Array<{ node: Node; original: string; translated: string }> = [];

    // Collect all text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (text && text.length > 0 && text.length < 200) {
        replacements.push({
          node,
          original: text,
          translated: text, // Placeholder, will be filled after translation
        });
      }
    }

    // Translate all unique strings
    const uniqueTexts = [...new Set(replacements.map((r) => r.original))];
    const translations = await Promise.all(
      uniqueTexts.map((text) => this.translate(text, targetLang))
    );

    // Create a map of original -> translated
    const translationMap = new Map<string, string>();
    uniqueTexts.forEach((text, index) => {
      translationMap.set(text, translations[index]);
    });

    // Update the DOM with translated text
    replacements.forEach((replacement) => {
      const translated = translationMap.get(replacement.original);
      if (translated && translated !== replacement.original) {
        const fullText = replacement.node.textContent || '';
        replacement.node.textContent = fullText.replace(
          replacement.original,
          translated
        );
      }
    });
  }

  clearCache() {
    this.cache = {};
    window.localStorage.removeItem('portfolio-translation-cache');
  }

  getCacheStats(): { languages: number; totalCached: number } {
    let totalCached = 0;
    Object.values(this.cache).forEach(langCache => {
      totalCached += Object.keys(langCache).length;
    });
    return {
      languages: Object.keys(this.cache).length,
      totalCached,
    };
  }
}

export const translationService = new TranslationService();
