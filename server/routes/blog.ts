import { Router } from 'express';

const router = Router();

// Static blog posts (no blog table in DB — extend later with DB integration)
const blogPosts = [
  {
    id: 1,
    title: "How to Build a Strong Brand Identity",
    titleAr: "كيف تبني هوية علامة تجارية قوية",
    slug: "how-to-build-strong-brand-identity",
    excerpt: "A strong brand identity is more than just a logo. Learn the key elements that make your brand memorable and trustworthy.",
    excerptAr: "هوية العلامة التجارية القوية أكثر من مجرد شعار. تعرف على العناصر الرئيسية التي تجعل علامتك التجارية لا تُنسى وجديرة بالثقة.",
    content: "Building a strong brand identity requires consistency, clarity, and creativity. Start with your brand values, define your target audience, and create visual elements that reflect your personality.",
    category: "Branding",
    author: "TechPartner Team",
    publishedAt: "2025-01-15T10:00:00Z",
    imageUrl: "/assets/art-and-illustration.png",
    tags: ["branding", "logo", "identity", "design"],
    readTime: 5
  },
  {
    id: 2,
    title: "Top Web Design Trends in 2025",
    titleAr: "أبرز اتجاهات تصميم الويب في 2025",
    slug: "top-web-design-trends-2025",
    excerpt: "Discover the latest web design trends shaping the digital landscape in 2025, from AI-driven layouts to immersive experiences.",
    excerptAr: "اكتشف أحدث اتجاهات تصميم الويب التي تشكل المشهد الرقمي في 2025، من التخطيطات المدعومة بالذكاء الاصطناعي إلى التجارب الغامرة.",
    content: "2025 brings exciting new trends in web design including dark mode by default, micro-animations, AI-personalized content, and accessibility-first design principles.",
    category: "Web Design",
    author: "TechPartner Team",
    publishedAt: "2025-01-20T10:00:00Z",
    imageUrl: "/assets/web-and-app-design.png",
    tags: ["web design", "trends", "UI", "UX"],
    readTime: 7
  },
  {
    id: 3,
    title: "The Importance of Packaging Design for Your Product",
    titleAr: "أهمية تصميم التغليف لمنتجك",
    slug: "importance-of-packaging-design",
    excerpt: "Great packaging design can be the difference between a product that sells and one that sits on the shelf. Here's why it matters.",
    excerptAr: "يمكن أن يكون تصميم التغليف الرائع هو الفرق بين منتج يُباع ومنتج يبقى على الرف. إليك سبب أهميته.",
    content: "Packaging design communicates your brand values at the point of sale. It should be functional, attractive, and aligned with your overall brand identity.",
    category: "Packaging",
    author: "TechPartner Team",
    publishedAt: "2025-02-01T10:00:00Z",
    imageUrl: "/assets/packaging.png",
    tags: ["packaging", "product design", "branding"],
    readTime: 4
  },
  {
    id: 4,
    title: "Why Your Business Needs a Professional Logo",
    titleAr: "لماذا تحتاج شركتك إلى شعار احترافي",
    slug: "why-business-needs-professional-logo",
    excerpt: "Your logo is the face of your business. Investing in a professional logo design pays dividends in brand recognition and trust.",
    excerptAr: "شعارك هو وجه عملك. الاستثمار في تصميم شعار احترافي يعود بفوائد كبيرة في التعرف على العلامة التجارية والثقة.",
    content: "A professional logo establishes credibility, differentiates you from competitors, and creates a lasting first impression. It's the cornerstone of your visual identity.",
    category: "Logo Design",
    author: "TechPartner Team",
    publishedAt: "2025-02-10T10:00:00Z",
    imageUrl: "/assets/logo-and-branding-design.png",
    tags: ["logo", "branding", "business", "design"],
    readTime: 6
  }
];

// GET /api/blog — list all blog posts
router.get('/blog', (req, res) => {
  const { category, limit } = req.query;
  let posts = [...blogPosts];

  if (category) {
    posts = posts.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (limit) {
    posts = posts.slice(0, parseInt(String(limit), 10));
  }

  res.json(posts);
});

// GET /api/blog/:slug — get single blog post by slug
router.get('/blog/:slug', (req, res) => {
  const post = blogPosts.find(p => p.slug === req.params.slug);
  if (!post) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  res.json(post);
});

export default router;
