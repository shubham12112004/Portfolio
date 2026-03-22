/**
 * Working Translation Service using Google Translate Widget
 * This approach uses the actual Google Translate widget that appears on the page
 */

export class GoogleTranslateService {
  private isReady = false;
  private readyPromise: Promise<void>;
  private readyResolve: (() => void) | null = null;
  private readonly scriptId = 'google-translate-script';
  private readonly mountId = 'google_translate_element_mount';
  private mountRetryTimer: number | null = null;
  private readonly listeners = new Set<(languageCode: string) => void>();
  private isElementCreated = false;
  private comboObserver: MutationObserver | null = null;

  constructor() {
    this.readyPromise = new Promise((resolve) => {
      this.readyResolve = resolve;
    });
    this.initializeGoogleTranslate();
  }

  private normalizeLanguage(languageCode: string) {
    return languageCode && languageCode !== 'en' ? languageCode : 'en';
  }

  private setGoogTransCookie(languageCode: string) {
    const target = this.normalizeLanguage(languageCode);
    const cookieValue = `/en/${target}`;
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
  }

  private getGoogTransLanguageFromCookie() {
    const raw = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith('googtrans='))
      ?.split('=')[1];

    if (!raw) return 'en';
    const parts = decodeURIComponent(raw).split('/');
    const lang = parts[2] || 'en';
    return this.normalizeLanguage(lang);
  }

  private emitLanguageChange(languageCode: string) {
    this.listeners.forEach((listener) => listener(languageCode));
  }

  onLanguageChange(listener: (languageCode: string) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private getComboElements() {
    return Array.from(document.querySelectorAll('.goog-te-combo')) as HTMLSelectElement[];
  }

  private clearMountRetryTimer() {
    if (this.mountRetryTimer !== null) {
      window.clearTimeout(this.mountRetryTimer);
      this.mountRetryTimer = null;
    }
  }

  private createTranslateElementIfPossible() {
    if (this.isElementCreated || !(window as any).google?.translate) return;

    const mount = document.getElementById(this.mountId);
    if (!mount) {
      this.clearMountRetryTimer();
      this.mountRetryTimer = window.setTimeout(() => {
        this.createTranslateElementIfPossible();
      }, 120);
      return;
    }

    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        autoDisplay: false,
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      this.mountId
    );

    this.isElementCreated = true;
    this.isReady = true;
    this.clearMountRetryTimer();
    if (this.readyResolve) {
      this.readyResolve();
      this.readyResolve = null;
    }

    this.bindComboListeners();
  }

  private bindComboListeners() {
    const combos = this.getComboElements();
    combos.forEach((combo) => {
      if (combo.dataset.portfolioBound === 'true') return;
      combo.dataset.portfolioBound = 'true';
      combo.addEventListener('change', () => {
        const selected = this.normalizeLanguage(combo.value || 'en');
        this.setGoogTransCookie(selected);
        this.emitLanguageChange(selected);
      });
    });

    if (!this.comboObserver) {
      this.comboObserver = new MutationObserver(() => {
        this.bindComboListeners();
      });
      this.comboObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  private initializeGoogleTranslate() {
    // Set up callback for when Google Translate loads
    (window as any).googleTranslateElementInit = () => {
      this.createTranslateElementIfPossible();
    };

    // Load the Google Translate script
    const existing = document.getElementById(this.scriptId) as HTMLScriptElement | null;
    if (!existing) {
      const script = document.createElement('script');
      script.id = this.scriptId;
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if ((window as any).google?.translate) {
      (window as any).googleTranslateElementInit();
    }
  }

  async waitForReady(): Promise<void> {
    return this.readyPromise;
  }

  async setLanguage(languageCode: string): Promise<void> {
    const targetLanguage = this.normalizeLanguage(languageCode);
    const currentLanguage = this.getGoogTransLanguageFromCookie();
    this.setGoogTransCookie(targetLanguage);

    if (currentLanguage !== targetLanguage) {
      const forceReloadKey = `gt-force-${targetLanguage}`;
      if (!window.sessionStorage.getItem(forceReloadKey)) {
        window.sessionStorage.setItem(forceReloadKey, '1');
        window.location.reload();
        return;
      }
      window.sessionStorage.removeItem(forceReloadKey);
    }

    // Wait for Google Translate to be ready
    await this.waitForReady();

    // Give it a moment to fully initialize
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Try multiple times to find and set the language
    let attempts = 0;
    const maxAttempts = 15;

    return new Promise((resolve) => {
      const trySetLanguage = () => {
        attempts++;
        
        const comboElements = this.getComboElements();

        if (comboElements.length > 0) {
          comboElements.forEach((comboElement) => {
            comboElement.value = targetLanguage === 'en' ? '' : targetLanguage;
            comboElement.dispatchEvent(new Event('change', { bubbles: true }));
            comboElement.dispatchEvent(new Event('input', { bubbles: true }));
          });

          this.emitLanguageChange(targetLanguage);
          window.sessionStorage.removeItem(`gt-reload-${targetLanguage}`);
          
          resolve();
          return;
        }

        // Retry if not found
        if (attempts < maxAttempts) {
          setTimeout(trySetLanguage, 150);
        } else {
          // Last-resort fallback: reload once so Google picks up googtrans cookie.
          const reloadKey = `gt-reload-${targetLanguage}`;
          if (!window.sessionStorage.getItem(reloadKey)) {
            window.sessionStorage.setItem(reloadKey, '1');
            window.location.reload();
            return;
          }

          console.warn(`Could not find Google Translate combo after ${maxAttempts} attempts`);
          resolve();
        }
      };

      trySetLanguage();
    });
  }

  isInitialized(): boolean {
    return this.isReady;
  }
}

export const googleTranslateService = new GoogleTranslateService();
