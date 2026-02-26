import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface SEOProps {
  en: {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
  };
  ar: {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
  };
  path?: string; // e.g. '/about'
  ogType?: 'website' | 'article';
}

const BASE_URL = 'https://techpartner.sa';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string, extra?: Record<string, string>) {
  // For hreflang, use a unique selector
  const selector = extra?.hreflang
    ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
    }
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSEO({ en, ar, path = '', ogType = 'website' }: SEOProps) {
  const { language } = useLanguage();

  useEffect(() => {
    const seo = language === 'ar' ? ar : en;
    const locale = language === 'ar' ? 'ar_SA' : 'en_US';
    const canonicalUrl = `${BASE_URL}${path}`;
    const ogImage = seo.ogImage || DEFAULT_OG_IMAGE;

    // ── Title ──────────────────────────────────────────────────────────────
    document.title = seo.title;

    // ── Basic meta ─────────────────────────────────────────────────────────
    setMeta('description', seo.description);
    if (seo.keywords) setMeta('keywords', seo.keywords);
    setMeta('robots', 'index, follow');
    setMeta('author', 'TechPartner');

    // ── Open Graph ─────────────────────────────────────────────────────────
    setMeta('og:type', ogType, 'property');
    setMeta('og:title', seo.title, 'property');
    setMeta('og:description', seo.description, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:image:width', '1200', 'property');
    setMeta('og:image:height', '630', 'property');
    setMeta('og:locale', locale, 'property');
    setMeta('og:site_name', 'TechPartner', 'property');

    // ── Twitter Card ───────────────────────────────────────────────────────
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', seo.title);
    setMeta('twitter:description', seo.description);
    setMeta('twitter:image', ogImage);
    setMeta('twitter:site', '@TechPartnerSA');

    // ── Canonical ──────────────────────────────────────────────────────────
    setLink('canonical', canonicalUrl);

    // ── hreflang alternates ────────────────────────────────────────────────
    setLink('alternate', `${BASE_URL}${path}`, { hreflang: 'en' });
    setLink('alternate', `${BASE_URL}/ar${path}`, { hreflang: 'ar' });
    setLink('alternate', `${BASE_URL}${path}`, { hreflang: 'x-default' });

    // ── html lang attribute ────────────────────────────────────────────────
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language, en, ar, path, ogType]);
}
