import { Request, Response } from 'express';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SitemapGenerator {
  private baseUrl: string;

  constructor(baseUrl = 'https://techpartner.sa') {
    this.baseUrl = baseUrl;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private createUrl(path: string, lastmod: Date, changefreq: SitemapUrl['changefreq'], priority: number): SitemapUrl {
    return {
      loc: `${this.baseUrl}${path}`,
      lastmod: this.formatDate(lastmod),
      changefreq,
      priority
    };
  }

  async generateDynamicSitemap(): Promise<string> {
    const urls: SitemapUrl[] = [];
    const now = new Date();

    // Static pages
    const staticPages = [
      { path: '/', changefreq: 'weekly' as const, priority: 1.0 },
      { path: '/about', changefreq: 'monthly' as const, priority: 0.8 },
      { path: '/contact', changefreq: 'monthly' as const, priority: 0.8 },
      { path: '/services', changefreq: 'weekly' as const, priority: 0.9 },
      { path: '/services/logo-identity', changefreq: 'weekly' as const, priority: 0.9 },
      { path: '/services/web-app-design', changefreq: 'weekly' as const, priority: 0.9 },
      { path: '/services/web-development', changefreq: 'weekly' as const, priority: 0.9 },
      { path: '/services/ui-ux-design', changefreq: 'weekly' as const, priority: 0.9 },
      { path: '/services/mobile-app-development', changefreq: 'weekly' as const, priority: 0.9 },
      { path: '/services/branding-marketing', changefreq: 'weekly' as const, priority: 0.9 },
      { path: '/services/digital-marketing', changefreq: 'weekly' as const, priority: 0.9 },
      { path: '/services/content-creation', changefreq: 'weekly' as const, priority: 0.9 },
      { path: '/portfolio', changefreq: 'monthly' as const, priority: 0.8 },
      { path: '/case-studies', changefreq: 'monthly' as const, priority: 0.7 },
      { path: '/blog', changefreq: 'weekly' as const, priority: 0.7 },
      { path: '/privacy-policy', changefreq: 'yearly' as const, priority: 0.4 },
      { path: '/terms-of-service', changefreq: 'yearly' as const, priority: 0.4 },
      { path: '/refund-policy', changefreq: 'yearly' as const, priority: 0.4 },
    ];

    staticPages.forEach(page => {
      urls.push(this.createUrl(page.path, now, page.changefreq, page.priority));
    });

    // Multilingual pages (Arabic)
    const arabicPages = [
      { path: '/ar', changefreq: 'weekly' as const, priority: 0.9 },
      { path: '/ar/services', changefreq: 'weekly' as const, priority: 0.9 },
      { path: '/ar/about', changefreq: 'monthly' as const, priority: 0.8 },
      { path: '/ar/contact', changefreq: 'monthly' as const, priority: 0.8 },
    ];

    arabicPages.forEach(page => {
      urls.push(this.createUrl(page.path, now, page.changefreq, page.priority));
    });

    // Dynamic content (if available)
    try {
      // Add blog posts if they exist
      // const blogPosts = await storage.getBlogPosts();
      // blogPosts.forEach(post => {
      //   urls.push(this.createUrl(
      //     `/blog/${post.slug}`,
      //     new Date(post.updatedAt || post.createdAt),
      //     'monthly',
      //     0.6
      //   ));
      // });

      // Add portfolio items if they exist
      // const portfolioItems = await storage.getPortfolioItems();
      // portfolioItems.forEach(item => {
      //   urls.push(this.createUrl(
      //     `/portfolio/${item.slug}`,
      //     new Date(item.updatedAt || item.createdAt),
      //     'monthly',
      //     0.7
      //   ));
      // });

    } catch (error) {
      console.log('Dynamic content not available for sitemap generation');
    }

    // Generate XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${url.loc}</loc>\n`;
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  async handleSitemapRequest(req: Request, res: Response): Promise<void> {
    try {
      const sitemap = await this.generateDynamicSitemap();
      res.setHeader('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  }
}

// Export a singleton instance
export const sitemapGenerator = new SitemapGenerator();
