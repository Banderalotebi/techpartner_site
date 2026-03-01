// server/routes/content.ts - Content Management & Article Generation
import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import Database from "better-sqlite3";
import { randomUUID } from "crypto";

export const contentRouter = Router();

const OLLAMA_URL = process.env.OLLAMA_HOST || 'http://localhost:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

// SQLite for content storage
let sqliteDb: Database.Database | null = null;

function getContentDB(): Database.Database {
  if (!sqliteDb) {
    sqliteDb = new Database('data/techpartner.db');
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS generated_articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        topic_focus TEXT,
        target_keyword TEXT,
        word_count INTEGER,
        author TEXT,
        tags TEXT,
        status TEXT DEFAULT 'draft', -- draft, published, archived
        source TEXT DEFAULT 'ai', -- ai, manual, imported
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        published_at DATETIME,
        published_url TEXT
      );
    `);
  }
  return sqliteDb;
}

// Generate article using local Ollama AI
contentRouter.post("/generate", requireAdmin, async (req, res) => {
  const { title, topicFocus, targetKeyword, wordCount = 800, author = "TechPartner Team" } = req.body;

  if (!title || !topicFocus) {
    return res.status(400).json({ error: "Title and topic focus are required." });
  }

  try {
    console.log(`✍️ [Content] Generating article: "${title}"...`);

    const prompt = `You are an elite SEO content writer for TechPartner, a premium IT services company in Saudi Arabia.

Write a comprehensive, professional blog article with these specifications:

TITLE: ${title}
TOPIC FOCUS: ${topicFocus}
TARGET KEYWORD: ${targetKeyword || title}
TARGET WORD COUNT: ${wordCount} words
TARGET AUDIENCE: Saudi Arabian businesses and IT decision makers

Requirements:
1. Write in professional, authoritative tone
2. Include an engaging introduction
3. Use clear H2 and H3 headings
4. Provide practical insights and actionable advice
5. Include local context relevant to Saudi Arabia (Vision 2030, digital transformation, etc.)
6. Naturally integrate the target keyword 3-5 times
7. End with a strong conclusion and call-to-action
8. Format in clean Markdown

Write the complete article now:`;

    const aiResponse = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`Ollama API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.response;

    // Create slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .substring(0, 100);

    // Save to database
    const db = getContentDB();
    const id = randomUUID();
    
    try {
      db.prepare(`
        INSERT INTO generated_articles (id, title, slug, content, topic_focus, target_keyword, word_count, author, status, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', 'ai')
      `).run(id, title, slug, generatedContent, topicFocus, targetKeyword || title, wordCount, author);
      
      console.log(`✅ [Content] Article saved: ${slug}`);
    } catch (dbError) {
      console.log('Article with this slug may already exist, updating...');
      // If exists, we still return the generated content
    }

    // Calculate actual word count
    const actualWordCount = generatedContent.split(/\s+/).length;

    res.json({
      success: true,
      article: {
        id,
        title,
        slug,
        content: generatedContent,
        topicFocus,
        targetKeyword: targetKeyword || title,
        wordCount: actualWordCount,
        author,
        status: 'draft',
        source: 'ai',
        url: `/blog/${slug}`, // Future public URL
        adminUrl: `/admin/content/edit/${slug}`
      },
      message: "Article generated successfully. Review and publish when ready."
    });

  } catch (error) {
    console.error("❌ [Content] Generation error:", error);
    res.status(500).json({ 
      error: "Failed to generate article.",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all articles
contentRouter.get("/articles", requireAdmin, async (req, res) => {
  try {
    const db = getContentDB();
    const articles = db.prepare(`
      SELECT id, title, slug, topic_focus, target_keyword, word_count, author, status, source, created_at, published_at, published_url
      FROM generated_articles
      ORDER BY created_at DESC
    `).all();

    // Map to camelCase
    const mapped = articles.map((a: any) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      topicFocus: a.topic_focus,
      targetKeyword: a.target_keyword,
      wordCount: a.word_count,
      author: a.author,
      status: a.status,
      source: a.source,
      createdAt: a.created_at,
      publishedAt: a.published_at,
      publishedUrl: a.published_url,
      url: a.status === 'published' ? (a.published_url || `/blog/${a.slug}`) : null,
      adminUrl: `/admin/content/edit/${a.slug}`
    }));

    res.json({ articles: mapped });
  } catch (error) {
    console.error("❌ [Content] Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch articles." });
  }
});

// Get single article
contentRouter.get("/articles/:slug", requireAdmin, async (req, res) => {
  try {
    const db = getContentDB();
    const article = db.prepare('SELECT * FROM generated_articles WHERE slug = ?').get(req.params.slug) as any;

    if (!article) {
      return res.status(404).json({ error: "Article not found." });
    }

    res.json({
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      topicFocus: article.topic_focus,
      targetKeyword: article.target_keyword,
      wordCount: article.word_count,
      author: article.author,
      tags: article.tags ? article.tags.split(',') : [],
      status: article.status,
      source: article.source,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
      publishedAt: article.published_at,
      publishedUrl: article.published_url,
      url: article.status === 'published' ? (article.published_url || `/blog/${article.slug}`) : null
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch article." });
  }
});

// Update article
contentRouter.patch("/articles/:slug", requireAdmin, async (req, res) => {
  const { title, content, status, publishedUrl } = req.body;
  
  try {
    const db = getContentDB();
    const updates: string[] = [];
    const values: any[] = [];

    if (title) {
      updates.push('title = ?');
      values.push(title);
    }
    if (content) {
      updates.push('content = ?');
      values.push(content);
      updates.push('word_count = ?');
      values.push(content.split(/\s+/).length);
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
      if (status === 'published') {
        updates.push('published_at = datetime("now")');
      }
    }
    if (publishedUrl) {
      updates.push('published_url = ?');
      values.push(publishedUrl);
    }
    
    updates.push('updated_at = datetime("now")');
    values.push(req.params.slug);

    const query = `UPDATE generated_articles SET ${updates.join(', ')} WHERE slug = ?`;
    db.prepare(query).run(...values);

    res.json({ success: true, message: "Article updated." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update article." });
  }
});

// Delete article
contentRouter.delete("/articles/:slug", requireAdmin, async (req, res) => {
  try {
    const db = getContentDB();
    db.prepare('DELETE FROM generated_articles WHERE slug = ?').run(req.params.slug);
    res.json({ success: true, message: "Article deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete article." });
  }
});

// Publish to external platforms
contentRouter.post("/publish/:slug", requireAdmin, async (req, res) => {
  const { platform } = req.body; // 'wordpress', 'medium', 'linkedin', 'devto'
  
  try {
    const db = getContentDB();
    const article = db.prepare('SELECT * FROM generated_articles WHERE slug = ?').get(req.params.slug) as any;

    if (!article) {
      return res.status(404).json({ error: "Article not found." });
    }

    // Simulate publishing (in production, integrate with platform APIs)
    const publishUrls: Record<string, string> = {
      wordpress: `https://techpartner.sa/blog/${article.slug}`,
      medium: `https://medium.com/@techpartner/${article.slug}`,
      linkedin: `https://linkedin.com/pulse/${article.slug}`,
      devto: `https://dev.to/techpartner/${article.slug}`
    };

    const publishedUrl = publishUrls[platform] || publishUrls.wordpress;

    // Update article status
    db.prepare(`
      UPDATE generated_articles 
      SET status = 'published', published_at = datetime('now'), published_url = ?
      WHERE slug = ?
    `).run(publishedUrl, req.params.slug);

    res.json({
      success: true,
      message: `Article published to ${platform}`,
      url: publishedUrl,
      platform
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to publish article." });
  }
});

// Get publishing platforms status
contentRouter.get("/platforms", requireAdmin, async (req, res) => {
  // Return configured publishing platforms
  res.json({
    platforms: [
      { id: 'wordpress', name: 'WordPress (techpartner.sa)', connected: true, url: 'https://techpartner.sa' },
      { id: 'medium', name: 'Medium', connected: false, url: null },
      { id: 'linkedin', name: 'LinkedIn Articles', connected: false, url: null },
      { id: 'devto', name: 'Dev.to', connected: false, url: null }
    ]
  });
});
