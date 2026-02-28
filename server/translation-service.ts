import axios from 'axios';
import fs from 'fs';
import path from 'path';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

// Path to locale files - works in both dev and production (dist)
// In dev: __dirname is project/server, so ../../client/i18n/locales = project/client/i18n/locales
// In prod: __dirname is dist/server, so ../client/i18n/locales = dist/client/i18n/locales
const isProduction = process.env.NODE_ENV === 'production';
const LOCALES_DIR = isProduction 
  ? path.resolve(__dirname, '../client/i18n/locales')
  : path.resolve(__dirname, '../../client/i18n/locales');

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  context?: string;
}

export interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
  };
}

export class TranslationService {
  private static instance: TranslationService;
  private cache: TranslationCache = {};
  private supportedLanguages = ['en', 'ar'];
  private fileTranslationsLoaded = false;
  
  private constructor() {
    this.loadTranslationsFromFiles();
  }

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  /**
   * Load translations from JSON locale files
   */
  private loadTranslationsFromFiles(): void {
    if (this.fileTranslationsLoaded) return;
    
    try {
      // Load English translations
      const enPath = path.join(LOCALES_DIR, 'en.json');
      if (fs.existsSync(enPath)) {
        const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
        Object.entries(enData).forEach(([key, value]) => {
          this.cache[key] = { en: value as string };
        });
        console.log(`[i18n] Loaded ${Object.keys(enData).length} English translations from file`);
      }

      // Load Arabic translations
      const arPath = path.join(LOCALES_DIR, 'ar.json');
      if (fs.existsSync(arPath)) {
        const arData = JSON.parse(fs.readFileSync(arPath, 'utf-8'));
        Object.entries(arData).forEach(([key, value]) => {
          if (!this.cache[key]) {
            this.cache[key] = {};
          }
          this.cache[key].ar = value as string;
        });
        console.log(`[i18n] Loaded ${Object.keys(arData).length} Arabic translations from file`);
      }

      this.fileTranslationsLoaded = true;
    } catch (error) {
      console.error('[i18n] Error loading locale files:', error);
    }
  }

  /**
   * Reload translations from files (for admin to trigger refresh)
   */
  reloadFromFiles(): void {
    this.fileTranslationsLoaded = false;
    this.cache = {};
    this.loadTranslationsFromFiles();
  }

  /**
   * Translate text using Ollama AI
   */
  async translate(request: TranslationRequest): Promise<string> {
    const { text, sourceLang, targetLang, context } = request;
    
    // Check cache first
    const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
    if (this.cache[cacheKey]?.[targetLang]) {
      console.log(`[Translation] Cache hit for: "${text.substring(0, 50)}..."`);
      return this.cache[cacheKey][targetLang];
    }

    // If source and target are the same, return original
    if (sourceLang === targetLang) {
      return text;
    }

    try {
      console.log(`[Translation] Translating to ${targetLang}: "${text.substring(0, 50)}..."`);
      
      const translatedText = await this.translateWithOllama(text, sourceLang, targetLang, context);
      
      // Store in cache
      this.storeInCache(text, sourceLang, targetLang, translatedText);
      
      return translatedText;
    } catch (error: any) {
      console.error('[Translation] Error:', error.message);
      return text; // Fallback to original text
    }
  }

  /**
   * Translate using Ollama AI
   */
  private async translateWithOllama(
    text: string, 
    sourceLang: string, 
    targetLang: string,
    context?: string
  ): Promise<string> {
    const targetLangName = this.getLanguageName(targetLang);
    const sourceLangName = this.getLanguageName(sourceLang);
    
    // Build a strict prompt that demands only the translation
    let prompt = `You are a professional translator. Translate the following ${sourceLangName} text to ${targetLangName}.
    
IMPORTANT RULES:
- Return ONLY the translated text
- Do NOT add explanations, notes, or context
- Do NOT include the original text
- Do NOT add quotes around the translation
- Preserve any placeholders like {{variable}} or HTML tags
- Keep the same tone and style`;

    if (context) {
      prompt += `\nContext: ${context}`;
    }
    
    prompt += `\n\nText to translate:\n${text}\n\nTranslation (only the translated text, no explanations):`;

    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
      model: MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.1,
        num_predict: 1024,
        stop: ["\n\n", "Note:", "Explanation:", "Context:"]
      }
    });

    let translated = response.data.response.trim();
    
    // Clean up the response
    translated = translated
      .replace(/^["']|["']$/g, '')  // Remove surrounding quotes
      .replace(/^(Translation|Translated text|Arabic|English)[:.]?\s*/i, '')  // Remove prefixes
      .replace(/\n.*$/s, '')  // Remove anything after first newline
      .trim();
    
    return translated;
  }

  /**
   * Batch translate multiple texts
   */
  async translateBatch(
    texts: string[], 
    sourceLang: string, 
    targetLang: string
  ): Promise<string[]> {
    const promises = texts.map(text => 
      this.translate({ text, sourceLang, targetLang })
    );
    return Promise.all(promises);
  }

  /**
   * Get all translations for a language
   */
  async getTranslationsForLanguage(lang: string): Promise<Record<string, string>> {
    const translations: Record<string, string> = {};
    
    // Get all cached keys for this language
    Object.keys(this.cache).forEach(key => {
      if (this.cache[key][lang]) {
        translations[key] = this.cache[key][lang];
      }
    });
    
    return translations;
  }

  /**
   * Store translation in cache
   */
  private storeInCache(
    originalText: string, 
    sourceLang: string, 
    targetLang: string, 
    translatedText: string
  ): void {
    const cacheKey = this.getCacheKey(originalText, sourceLang, targetLang);
    
    if (!this.cache[cacheKey]) {
      this.cache[cacheKey] = {};
    }
    
    this.cache[cacheKey][targetLang] = translatedText;
    this.cache[cacheKey][sourceLang] = originalText;
    
    // Persist cache
    this.saveCacheToStorage();
  }

  /**
   * Generate cache key
   */
  private getCacheKey(text: string, sourceLang: string, targetLang: string): string {
    // Create a simple hash of the text
    const hash = this.simpleHash(text);
    return `${sourceLang}_${hash}`;
  }

  /**
   * Simple hash function
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get language name
   */
  private getLanguageName(lang: string): string {
    const names: Record<string, string> = {
      'en': 'English',
      'ar': 'Modern Standard Arabic (فصحى)',
      'fr': 'French',
      'es': 'Spanish',
      'de': 'German'
    };
    return names[lang] || lang;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  /**
   * Add custom translation
   */
  addCustomTranslation(key: string, lang: string, translation: string): void {
    if (!this.cache[key]) {
      this.cache[key] = {};
    }
    this.cache[key][lang] = translation;
    this.saveCacheToStorage();
  }

  /**
   * Load cache from storage
   */
  private loadCacheFromStorage(): void {
    try {
      // In a real implementation, this would load from a database or file
      // For now, we'll use a simple in-memory cache
      console.log('[Translation] Cache initialized');
    } catch (error) {
      console.error('[Translation] Error loading cache:', error);
    }
  }

  /**
   * Save cache to storage
   */
  private saveCacheToStorage(): void {
    try {
      // In a real implementation, this would save to a database or file
      // For now, we'll keep it in memory
    } catch (error) {
      console.error('[Translation] Error saving cache:', error);
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = {};
    console.log('[Translation] Cache cleared');
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { totalKeys: number; totalTranslations: number } {
    let totalTranslations = 0;
    const totalKeys = Object.keys(this.cache).length;
    
    Object.values(this.cache).forEach(langMap => {
      totalTranslations += Object.keys(langMap).length;
    });
    
    return { totalKeys, totalTranslations };
  }

  /**
   * Auto-translate content object
   */
  async autoTranslateContent(
    content: Record<string, string>,
    targetLang: string,
    sourceLang: string = 'en'
  ): Promise<Record<string, string>> {
    const translated: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(content)) {
      translated[key] = await this.translate({
        text: value,
        sourceLang,
        targetLang,
        context: `UI text for key: ${key}`
      });
    }
    
    return translated;
  }
}

export const translationService = TranslationService.getInstance();
