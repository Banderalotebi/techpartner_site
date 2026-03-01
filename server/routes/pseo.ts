import { Router } from "express";
import { db } from "../db";
import { programmaticPages } from "../../shared/schema";
import { eq, and, sql } from "drizzle-orm";

export const pseoRouter = Router();

// Get a specific programmatic page by slug
pseoRouter.get("/:slug", async (req, res) => {
    try {
        const [page] = await db.select().from(programmaticPages).where(
            and(eq(programmaticPages.slug, req.params.slug), eq(programmaticPages.isPublished, true))
        );
        
        if (!page) {
            return res.status(404).json({ error: "Page not found" });
        }
        
        res.json(page);
    } catch (error) {
        console.error("Error fetching programmatic page:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// List all programmatic pages (public)
pseoRouter.get("/", async (req, res) => {
    try {
        const pages = await db.select({
            slug: programmaticPages.slug,
            targetKeyword: programmaticPages.targetKeyword,
            city: programmaticPages.city,
            industry: programmaticPages.industry,
            h1Title: programmaticPages.h1Title,
            createdAt: programmaticPages.createdAt
        }).from(programmaticPages).where(eq(programmaticPages.isPublished, true));
        
        res.json(pages);
    } catch (error) {
        console.error("Error fetching programmatic pages:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Search programmatic pages by keyword
pseoRouter.get("/search/:keyword", async (req, res) => {
    try {
        const searchTerm = req.params.keyword.toLowerCase();
        const pages = await db.select().from(programmaticPages)
            .where(
                and(
                    eq(programmaticPages.isPublished, true),
                    sql`LOWER(${programmaticPages.targetKeyword}) LIKE ${'%' + searchTerm + '%'}`
                )
            );
        
        res.json(pages);
    } catch (error) {
        console.error("Error searching programmatic pages:", error);
        res.status(500).json({ error: "Server error" });
    }
});
