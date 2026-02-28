// Language utilities for URL-based language routing

export type SupportedLanguage = 'en' | 'ar';

/**
 * Get language code from URL path
 * Returns 'ar' if path starts with /ar, otherwise 'en'
 */
export function getLanguageFromPath(path: string): SupportedLanguage {
  if (path.startsWith('/ar') || path.startsWith('/ar/')) {
    return 'ar';
  }
  return 'en';
}

/**
 * Get the base path without language prefix
 * e.g., /ar/categories/logo-and-identity -> /categories/logo-and-identity
 */
export function getBasePath(path: string): string {
  if (path.startsWith('/ar/')) {
    return path.slice(3); // Remove '/ar' prefix
  }
  if (path === '/ar') {
    return '/';
  }
  return path;
}

/**
 * Get localized path with language prefix
 * e.g., /categories/logo-and-identity -> /ar/categories/logo-and-identity (for Arabic)
 */
export function getLocalizedPath(path: string, language: SupportedLanguage): string {
  const basePath = getBasePath(path);
  
  if (language === 'ar') {
    return basePath === '/' ? '/ar' : `/ar${basePath}`;
  }
  
  return basePath;
}

/**
 * Check if URL is external (starts with http or https)
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
}

