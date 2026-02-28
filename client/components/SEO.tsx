import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: Record<string, any>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  alternateLangs?: Array<{ lang: string; url: string }>;
}

export default function SEO({
  title,
  description,
  keywords = [],
  ogImage = 'https://techpartner.sa/og-image.jpg',
  ogType = 'website',
  canonical,
  noindex = false,
  structuredData,
  breadcrumbs,
  alternateLangs
}: SEOProps) {
  const { language } = useLanguage();
  const siteUrl = 'https://techpartner.sa';
  const fullTitle = `${title} | TechPartner - Premium Design & Development Agency Saudi Arabia`;
  
  useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Update meta tags
    const metaTags = {
      'description': description,
      'keywords': keywords.join(', '),
      'author': 'TechPartner',
      'robots': noindex ? 'noindex, nofollow' : 'index, follow',
      'viewport': 'width=device-width, initial-scale=1.0',
      // Open Graph
      'og:title': fullTitle,
      'og:description': description,
      'og:type': ogType,
      'og:url': canonical || siteUrl,
      'og:image': ogImage,
      'og:site_name': 'TechPartner',
      'og:locale': language === 'ar' ? 'ar_SA' : 'en_US',
      // Twitter
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': ogImage,
      // Additional SEO
      'theme-color': '#01A1C1',
      'msapplication-TileColor': '#01A1C1',
    };

    // Update or create meta tags
    Object.entries(metaTags).forEach(([name, content]) => {
      if (!content) return;
      
      let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || siteUrl);

    // Add alternate language links
    if (alternateLangs) {
      alternateLangs.forEach(({ lang, url }) => {
        let link = document.querySelector(`link[hreflang="${lang}"]`);
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', 'alternate');
          link.setAttribute('hreflang', lang);
          document.head.appendChild(link);
        }
        link.setAttribute('href', url);
      });
    }

    // Add x-default
    let xDefault = document.querySelector('link[hreflang="x-default"]');
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.setAttribute('rel', 'alternate');
      xDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(xDefault);
    }
    xDefault.setAttribute('href', canonical || siteUrl);

    // Inject structured data
    if (structuredData) {
      const scriptId = 'structured-data';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Optional: cleanup meta tags if needed
    };
  }, [title, description, keywords, ogImage, ogType, canonical, noindex, structuredData, language, fullTitle]);

  return null;
}

// Predefined structured data generators
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TechPartner',
  url: 'https://techpartner.sa',
  logo: 'https://techpartner.sa/logo.png',
  description: 'Premium SaaS design and development agency in Saudi Arabia',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SA',
    addressLocality: 'Riyadh',
    addressRegion: 'Riyadh Region'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+966-50-123-4567',
    contactType: 'customer service',
    availableLanguage: ['English', 'Arabic']
  },
  sameAs: [
    'https://linkedin.com/company/techpartner',
    'https://twitter.com/techpartner_sa',
    'https://instagram.com/techpartner.sa'
  ]
});

export const generateLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'TechPartner Design & Development Agency',
  image: 'https://techpartner.sa/og-image.jpg',
  '@id': 'https://techpartner.sa',
  url: 'https://techpartner.sa',
  telephone: '+966-50-123-4567',
  priceRange: '$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'King Fahd Road',
    addressLocality: 'Riyadh',
    addressRegion: 'Riyadh Region',
    postalCode: '11321',
    addressCountry: 'SA'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 24.7136,
    longitude: 46.6753
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '09:00',
    closes: '18:00'
  },
  serviceType: [
    'Web Design',
    'Logo Design',
    'Brand Identity',
    'Web Development',
    'Mobile App Development',
    'UI/UX Design'
  ]
});

export const generateServiceSchema = (service: {
  name: string;
  description: string;
  url: string;
  provider: string;
  areaServed?: string;
  priceRange?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: service.name,
  provider: {
    '@type': 'Organization',
    name: service.provider
  },
  description: service.description,
  url: service.url,
  areaServed: service.areaServed || 'Saudi Arabia',
  offers: {
    '@type': 'Offer',
    priceRange: service.priceRange || '$$$'
  }
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  category: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  image: article.image,
  url: article.url,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    '@type': 'Person',
    name: article.author
  },
  publisher: {
    '@type': 'Organization',
    name: 'TechPartner',
    logo: {
      '@type': 'ImageObject',
      url: 'https://techpartner.sa/logo.png'
    }
  },
  articleSection: article.category,
  inLanguage: 'en'
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});
