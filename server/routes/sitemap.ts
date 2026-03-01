import { Router } from "express";
import { db } from "../db";
import { programmaticPages } from "../../shared/schema";
import { eq } from "drizzle-orm";

export const sitemapRouter = Router();

sitemapRouter.get("/", async (req, res) => {
    try {
        const pages = await db.select({ slug: programmaticPages.slug }).from(programmaticPages).where(eq(programmaticPages.isPublished, true));
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        // Add main pages
        const mainPages = [
            { url: "https://techpartner.sa", changefreq: "daily" },
            { url: "https://techpartner.sa/about", changefreq: "weekly" },
            { url: "https://techpartner.sa/contact", changefreq: "weekly" },
            { url: "https://techpartner.sa/portfolio", changefreq: "weekly" },
            { url: "https://techpartner.sa/blog", changefreq: "daily" },
        ];
        
        mainPages.forEach(p => {
            xml += `  <url>\n    <loc>${p.url}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        });
        
        // Add programmatic pages
        pages.forEach(p => {
            xml += `  <url>\n    <loc>https://techpartner.sa/p/${p.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        });
        
        xml += `</urlset>`;
        
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).send("Error generating sitemap");
    }
});
