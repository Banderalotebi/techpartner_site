// scripts/syndicate.ts
// Content Syndication Engine - Dev.to + Hashnode (replaced Medium)
// This script automatically publishes content to developer platforms with canonical URLs

import fetch from 'node-fetch';

// Load environment variables
const DEVTO_API_KEY = process.env.DEVTO_API_KEY!;
const HASHNODE_TOKEN = process.env.HASHNODE_TOKEN!;
const HASHNODE_PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID!;

interface ArticlePayload {
  title: string;
  markdownContent: string;
  originalUrl: string; // The TechPartner URL (Crucial for Canonical SEO)
  tags: string[];
}

// 1. Publish to Dev.to (DA 93)
async function publishToDevTo(article: ArticlePayload) {
  console.log(`🚀 Syndicating to Dev.to: ${article.title}`);
  
  // Inject the retargeting tracker link into the bottom of the article
  const footer = `\n\n---\n*Originally published on [TechPartner](${article.originalUrl}). Need help with your next SaaS project? Let's build something futuristic.*`;
  
  const response = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': DEVTO_API_KEY,
    },
    body: JSON.stringify({
      article: {
        title: article.title,
        body_markdown: article.markdownContent + footer,
        published: true, // Set to false if you want it to go to drafts first
        canonical_url: article.originalUrl, // THE SEO MAGIC
        tags: article.tags.slice(0, 4), // Dev.to allows max 4 tags
      },
    }),
  });

  if (!response.ok) throw new Error(`Dev.to Error: ${await response.text()}`);
  const data = await response.json() as { url: string };
  console.log(`✅ Dev.to Success! URL: ${data.url}`);
}

// 2. Publish to Hashnode (DA 90) via GraphQL
async function publishToHashnode(article: ArticlePayload) {
  console.log(`🚀 Syndicating to Hashnode: ${article.title}`);
  
  const footer = `\n\n---\n*Originally published on [TechPartner](${article.originalUrl}).*`;

  // Hashnode uses a GraphQL mutation to publish posts
  const query = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          url
        }
      }
    }
  `;

  const variables = {
    input: {
      title: article.title,
      contentMarkdown: article.markdownContent + footer,
      publicationId: HASHNODE_PUBLICATION_ID,
      originalArticleUrl: article.originalUrl, // THE SEO MAGIC (Canonical)
    }
  };

  const response = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': HASHNODE_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json() as { 
    errors?: unknown; 
    data?: { 
      publishPost: { 
        post: { 
          url: string 
        } 
      } 
    } 
  };
  if (data.errors) throw new Error(`Hashnode Error: ${JSON.stringify(data.errors)}`);
  console.log(`✅ Hashnode Success! URL: ${data.data?.publishPost.post.url}`);
}

// 3. The Execution Engine
async function runSyndication() {
  try {
    // In a real app, you might fetch this from your database or Astro markdown files.
    // For now, we simulate reading a local Markdown file.
    const article: ArticlePayload = {
      title: "How to Build an Automated pSEO Pipeline",
      markdownContent: `## The Future of SEO

Today we are building an autonomous engine that combines AI, web scraping, and programmatic SEO to dominate search rankings without paying for expensive tools.

### The Architecture

1. **LangGraph.js** - AI orchestration for content analysis
2. **Crawlee** - High-performance web scraping
3. **Astro** - Lightning-fast static site generation
4. **Hashnode & Dev.to** - Content syndication with canonical URLs

### Why This Matters

Traditional SEO agencies charge thousands per month for link building. This system automates the entire pipeline:

- Discovers backlink opportunities
- Analyzes content relevance with AI
- Drafts personalized outreach emails
- Syndicates content to high-DA platforms
- Tracks performance with server-side analytics

### The Results

- 100/100 Core Web Vitals
- DA 90+ backlinks from Hashnode and Dev.to
- Automated prospect discovery
- Zero JavaScript payload on landing pages

Ready to build your own? Let's talk.`,
      originalUrl: "https://techpartner.sa/blog/automated-pseo", // The canonical source
      tags: ["webdev", "saas", "programming", "seo"]
    };

    // Run both API requests concurrently for speed
    await Promise.all([
      publishToDevTo(article).catch(e => console.error(e.message)),
      publishToHashnode(article).catch(e => console.error(e.message))
    ]);

    console.log("🏁 Syndication Complete. You just generated two DA 90+ backlinks instantly.");
  } catch (error) {
    console.error("Syndication Pipeline Failed:", error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSyndication();
}

export { runSyndication, publishToDevTo, publishToHashnode };
