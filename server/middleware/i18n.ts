import { Request, Response, NextFunction } from 'express';
import { translationService } from '../translation-service';

// Extend Express Request to include language
declare global {
  namespace Express {
    interface Request {
      language?: string;
      translations?: Record<string, string>;
      t?: (key: string, fallback?: string) => string;
    }
  }
}

/**
 * Detect language from request
 * Priority: 1. Query param, 2. Header, 3. Cookie, 4. Default (en)
 */
export function detectLanguage(req: Request, res: Response, next: NextFunction): void {
  const supportedLanguages = translationService.getSupportedLanguages();
  const defaultLang = 'en';
  
  // Check query parameter first
  let lang = req.query.lang as string;
  
  // Then check Accept-Language header
  if (!lang && req.headers['accept-language']) {
    const acceptLang = req.headers['accept-language'].split(',')[0].trim().substring(0, 2);
    if (supportedLanguages.includes(acceptLang)) {
      lang = acceptLang;
    }
  }
  
  // Then check cookie
  if (!lang && req.cookies?.language) {
    lang = req.cookies.language;
  }
  
  // Validate and set language
  req.language = supportedLanguages.includes(lang) ? lang : defaultLang;
  
  // Set language cookie for future requests
  res.cookie('language', req.language, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: false,
    sameSite: 'lax'
  });
  
  next();
}

/**
 * Load translations for the detected language
 */
export async function loadTranslations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.language) {
      req.language = 'en';
    }
    
    // Load translations for the detected language
    req.translations = await translationService.getTranslationsForLanguage(req.language);
    
    // Create translation helper function
    req.t = (key: string, fallback?: string) => {
      return req.translations?.[key] || fallback || key;
    };
    
    next();
  } catch (error) {
    console.error('[i18n middleware] Error loading translations:', error);
    // Continue without translations
    req.translations = {};
    req.t = (key: string, fallback?: string) => fallback || key;
    next();
  }
}

/**
 * Set language from user preference (after auth)
 */
export function setUserLanguage(req: Request, res: Response, next: NextFunction): void {
  // If user is authenticated and has language preference, use it
  if (req.user?.language) {
    const supportedLanguages = translationService.getSupportedLanguages();
    if (supportedLanguages.includes(req.user.language)) {
      req.language = req.user.language;
      res.cookie('language', req.language, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: 'lax'
      });
    }
  }
  next();
}

/**
 * Middleware to translate response data
 * Use this for API responses that need translation
 */
export function translateResponse(req: Request, res: Response, next: NextFunction): void {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    // If language is not Arabic, return original data
    if (req.language !== 'ar') {
      return originalJson.call(this, data);
    }
    
    // If data has translatable fields, translate them
    if (data && typeof data === 'object') {
      data = translateObject(data, req.translations || {});
    }
    
    return originalJson.call(this, data);
  };
  
  next();
}

/**
 * Helper function to translate object values
 */
function translateObject(obj: any, translations: Record<string, string>): any {
  if (typeof obj === 'string') {
    // Check if this string has a translation
    return translations[obj] || obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item, translations));
  }
  
  if (obj && typeof obj === 'object') {
    const translated: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Try to find translation for this key
      const translationKey = `api.${key}`;
      translated[key] = translations[translationKey] 
        ? translateObject(value, translations)
        : translateObject(value, translations);
    }
    return translated;
  }
  
  return obj;
}

/**
 * Combined i18n middleware
 */
export const i18nMiddleware = [detectLanguage, loadTranslations];
