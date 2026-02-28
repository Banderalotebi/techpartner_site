import { Router, Request, Response } from 'express';
import { translationService } from '../translation-service';

const router = Router();

/**
 * GET /api/i18n/translations/:lang
 * Get all translations for a specific language
 */
router.get('/translations/:lang', async (req: Request, res: Response) => {
  try {
    const { lang } = req.params;
    const supportedLanguages = translationService.getSupportedLanguages();
    
    if (!supportedLanguages.includes(lang)) {
      return res.status(400).json({
        error: 'Unsupported language',
        supportedLanguages
      });
    }

    const translations = await translationService.getTranslationsForLanguage(lang);
    
    res.json({
      language: lang,
      translations,
      count: Object.keys(translations).length
    });
  } catch (error: any) {
    console.error('[i18n] Error fetching translations:', error);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

/**
 * POST /api/i18n/translate
 * Translate text on-demand
 */
router.post('/translate', async (req: Request, res: Response) => {
  try {
    const { text, sourceLang = 'en', targetLang, context } = req.body;
    
    if (!text || !targetLang) {
      return res.status(400).json({
        error: 'Missing required fields: text and targetLang'
      });
    }

    const supportedLanguages = translationService.getSupportedLanguages();
    if (!supportedLanguages.includes(targetLang)) {
      return res.status(400).json({
        error: 'Unsupported target language',
        supportedLanguages
      });
    }

    const translated = await translationService.translate({
      text,
      sourceLang,
      targetLang,
      context
    });

    res.json({
      original: text,
      translated,
      sourceLang,
      targetLang
    });
  } catch (error: any) {
    console.error('[i18n] Error translating:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

/**
 * POST /api/i18n/translate-batch
 * Translate multiple texts at once
 */
router.post('/translate-batch', async (req: Request, res: Response) => {
  try {
    const { texts, sourceLang = 'en', targetLang } = req.body;
    
    if (!Array.isArray(texts) || !targetLang) {
      return res.status(400).json({
        error: 'Missing required fields: texts (array) and targetLang'
      });
    }

    const translations = await translationService.translateBatch(
      texts,
      sourceLang,
      targetLang
    );

    res.json({
      translations,
      sourceLang,
      targetLang,
      count: translations.length
    });
  } catch (error: any) {
    console.error('[i18n] Error batch translating:', error);
    res.status(500).json({ error: 'Batch translation failed' });
  }
});

/**
 * GET /api/i18n/languages
 * Get list of supported languages
 */
router.get('/languages', (req: Request, res: Response) => {
  const languages = translationService.getSupportedLanguages();
  res.json({
    languages,
    defaultLanguage: 'en'
  });
});

/**
 * GET /api/i18n/cache-stats
 * Get translation cache statistics
 */
router.get('/cache-stats', (req: Request, res: Response) => {
  const stats = translationService.getCacheStats();
  res.json(stats);
});

/**
 * POST /api/i18n/clear-cache
 * Clear translation cache (admin only)
 */
router.post('/clear-cache', async (req: Request, res: Response) => {
  try {
    // TODO: Add admin authentication check
    translationService.clearCache();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error: any) {
    console.error('[i18n] Error clearing cache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

/**
 * POST /api/i18n/auto-translate
 * Auto-translate a content object
 */
router.post('/auto-translate', async (req: Request, res: Response) => {
  try {
    const { content, targetLang, sourceLang = 'en' } = req.body;
    
    if (!content || typeof content !== 'object' || !targetLang) {
      return res.status(400).json({
        error: 'Missing required fields: content (object) and targetLang'
      });
    }

    const translated = await translationService.autoTranslateContent(
      content,
      targetLang,
      sourceLang
    );

    res.json({
      original: content,
      translated,
      sourceLang,
      targetLang
    });
  } catch (error: any) {
    console.error('[i18n] Error auto-translating:', error);
    res.status(500).json({ error: 'Auto-translation failed' });
  }
});

/**
 * POST /api/i18n/reload
 * Reload translations from locale files
 */
router.post('/reload', (req: Request, res: Response) => {
  try {
    (translationService as any).reloadFromFiles();
    const stats = translationService.getCacheStats();
    res.json({ 
      message: 'Translations reloaded from files',
      stats
    });
  } catch (error: any) {
    console.error('[i18n] Error reloading translations:', error);
    res.status(500).json({ error: 'Failed to reload translations' });
  }
});

export default router;
