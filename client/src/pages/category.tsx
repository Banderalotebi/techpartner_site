import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import ProjectQuestionnaireModal from "@/components/ProjectQuestionnaireModal";
import BrandQuizModal from "@/components/BrandQuizModal";
import OrderModal from "@/components/OrderModal";
import OrderFlowModal from "@/components/OrderFlowModal";
import { WebDesignQuestionnaireModal } from "@/components/WebDesignQuestionnaireModal";
import { WebDevelopmentQuestionnaireModal } from "@/components/WebDevelopmentQuestionnaireModal";
import { GeneralProjectQuestionnaireModal } from "@/components/GeneralProjectQuestionnaireModal";
import { PlatformLogo } from "@/components/PlatformLogos";
import type { ServiceCategory, ServicePackage } from "@shared/schema";

// All category services data
const categoryServices = {
  "logo-identity": [
    {
      id: 1,
      title: "Logo & brand identity pack",
      description: "Get a logo that digital and print essentials to jump-start your brand",
      price: "3000",
      features: ["Logo", "Business card", "Letterhead & envelope", "Facebook cover"],
      icon: "📦"
    },
    {
      id: 2,
      title: "Logo design",
      description: "A versatile logo design tailored to your brand",
      price: "1500",
      features: ["Custom logo design", "Multiple concepts", "Vector files"],
      icon: "🅰️"
    },
    {
      id: 3,
      title: "Business card",
      description: "Professional business card design that builds credibility",
      price: "800",
      features: ["Custom design", "Print-ready files"],
      icon: "💼"
    },
    {
      id: 4,
      title: "Logo & brand guide",
      description: "Define your logo brand with a complete brand visual identity standards",
      price: "2400",
      features: ["Logo", "Color palette", "Typography", "Brand guide document"],
      icon: "📋"
    },
    {
      id: 5,
      title: "Logo & business card",
      description: "Get a logo and business card design that importantly complements each other",
      price: "2200",
      features: ["Logo design", "Business card"],
      icon: "💳"
    },
    {
      id: 6,
      title: "Logo & website",
      description: "Receive a custom logo and fully website perfectly aligned with your brand",
      price: "6000",
      features: ["Logo", "Fully responsive website", "SEO optimization"],
      icon: "🌐"
    }
  ],
  "web-app": [
    {
      id: 101,
      title: "Starter Site - Custom Development",
      description: "Perfect for small businesses and startups with custom UI design",
      price: "25000",
      features: ["Custom UI design (Figma/Adobe XD)", "5 static pages", "Mobile responsive", "Contact form", "Hosting setup"],
      icon: "🚀",
      isWebDevelopment: true
    },
    {
      id: 102,
      title: "Business Pro - Full Development",
      description: "Comprehensive solution for growing companies with CMS integration",
      price: "35000",
      features: ["Everything in Starter", "Up to 10 pages", "CMS integration", "Admin dashboard", "SEO optimization", "Custom animations"],
      icon: "💼",
      isWebDevelopment: true
    },
    {
      id: 103,
      title: "Premium Build - Enterprise Solution",
      description: "Advanced full-stack development for complex business requirements",
      price: "45000",
      features: ["Everything in Business Pro", "Full-stack web app", "Custom backend", "Authentication", "Multi-language", "API integration"],
      icon: "⭐",
      isWebDevelopment: true
    },
    {
      id: 11,
      title: "Website Builders",
      description: "Easily bring your website online so you can stay focused on running your business",
      price: "4500",
      features: ["Custom website", "Responsive design", "CMS integration"],
      icon: "🌐"
    },
    {
      id: 12,
      title: "Web page design",
      description: "Engaging custom web design and commerce platform",
      price: "3200",
      features: ["Custom design", "Mobile responsive", "E-commerce ready"],
      icon: "💻"
    },
    {
      id: 13,
      title: "Website Redesign",
      description: "A refreshed website to make innovative and move faster",
      price: "5500",
      features: ["Complete redesign", "Modern UI/UX", "Performance optimization"],
      icon: "🔄"
    },
    {
      id: 14,
      title: "Blog",
      description: "Custom blog design to keep them reading",
      price: "2800",
      features: ["Blog design", "Content management", "SEO optimized"],
      icon: "📝"
    },
    {
      id: 15,
      title: "App design",
      description: "A user-friendly app that gets downloaded",
      price: "8500",
      features: ["Mobile app design", "User experience", "Prototype"],
      icon: "📲"
    },
    {
      id: 16,
      title: "Landing page design",
      description: "Single page that gets your visitors to click",
      price: "2500",
      features: ["Conversion focused", "A/B testing ready", "Mobile optimized"],
      icon: "📄"
    },
    // Platform-Specific Customized Web Services
    {
      id: 117,
      title: "Wix website customization",
      description: "Professional Wix website design and customization for your business",
      price: "2800",
      features: ["Wix template customization", "Mobile optimization", "SEO setup", "Contact forms"],
      icon: "🎨",
      platform: "wix",
      category: "Platform Service"
    },
    {
      id: 118,
      title: "Sallah website design",
      description: "Custom website design using Sallah platform for Saudi businesses",
      price: "3200",
      features: ["Arabic language support", "RTL design", "Local payment integration", "Saudi compliance"],
      icon: "🕌",
      platform: "sallah",
      category: "Platform Service"
    },
    {
      id: 119,
      title: "Shopify store setup",
      description: "Complete Shopify e-commerce store design and configuration",
      price: "4500",
      features: ["Store setup", "Product catalog", "Payment integration", "Mobile responsive"],
      icon: "🛒",
      platform: "shopify",
      category: "Platform Service"
    },
    {
      id: 120,
      title: "WordPress customization",
      description: "Custom WordPress website design with professional themes",
      price: "3800",
      features: ["Custom theme", "Plugin integration", "SEO optimization", "Security setup"],
      icon: "📰",
      platform: "wordpress",
      category: "Platform Service"
    },
    {
      id: 121,
      title: "Squarespace design",
      description: "Beautiful Squarespace website design for creative professionals",
      price: "3000",
      features: ["Template customization", "Portfolio setup", "Gallery integration", "Mobile design"],
      icon: "⬛",
      platform: "squarespace",
      category: "Platform Service"
    },
    {
      id: 122,
      title: "Webflow development",
      description: "Advanced Webflow website with custom interactions and animations",
      price: "5200",
      features: ["Custom interactions", "CMS integration", "Responsive design", "Performance optimization"],
      icon: "🌊",
      platform: "webflow",
      category: "Platform Service"
    },
    {
      id: 123,
      title: "Figma to website",
      description: "Convert your Figma designs into fully functional responsive websites",
      price: "4800",
      features: ["Pixel-perfect conversion", "Responsive design", "Clean code", "Cross-browser compatibility"],
      icon: "🎯",
      platform: "figma",
      category: "Platform Service"
    },
    {
      id: 124,
      title: "GoDaddy website builder",
      description: "Professional website using GoDaddy's website builder platform",
      price: "2400",
      features: ["Domain integration", "Hosting setup", "Mobile optimization", "Basic SEO"],
      icon: "🌐",
      platform: "godaddy",
      category: "Platform Service"
    }
  ],
  "advertising": [
    {
      id: 21,
      title: "Poster",
      description: "Eye-catching posters that promote your business effectively",
      price: "800",
      features: ["Custom design", "Print ready", "Multiple sizes", "High resolution"],
      icon: "📋"
    },
    {
      id: 22,
      title: "Business card",
      description: "Professional business cards that make lasting first impressions",
      price: "600",
      features: ["Double-sided design", "Premium finishes", "Print ready files"],
      icon: "💼"
    },
    {
      id: 23,
      title: "Flyer",
      description: "Promotional flyers that drive action and engagement",
      price: "500",
      features: ["Compelling design", "Call-to-action focused", "Print optimization"],
      icon: "📄"
    },
    {
      id: 24,
      title: "Brochure",
      description: "Comprehensive brochures that showcase your services",
      price: "1200",
      features: ["Multi-page layout", "Professional content", "Tri-fold or bi-fold"],
      icon: "📖"
    },
    {
      id: 25,
      title: "Postcard",
      description: "Direct mail postcards that reach your target audience",
      price: "400",
      features: ["Compact design", "Mailing format", "Brand consistency"],
      icon: "📮"
    },
    {
      id: 26,
      title: "Banner",
      description: "Large format banners for events and storefronts",
      price: "900",
      features: ["Large format design", "Weather resistant", "Custom dimensions"],
      icon: "🎯"
    },
    {
      id: 27,
      title: "Advertisement",
      description: "Digital and print advertisements that convert",
      price: "700",
      features: ["Multi-platform design", "A/B test ready", "Performance focused"],
      icon: "📺"
    },
    {
      id: 28,
      title: "Menu",
      description: "Restaurant and cafe menus that enhance dining experience",
      price: "800",
      features: ["Food photography integration", "Easy to read layout", "Print ready"],
      icon: "🍽️"
    },
    {
      id: 29,
      title: "Catalog",
      description: "Product catalogs that drive sales and showcase inventory",
      price: "1500",
      features: ["Multi-page layout", "Product photography", "Professional binding"],
      icon: "📚"
    },
    {
      id: 30,
      title: "Trade show display",
      description: "Professional trade show displays that attract visitors",
      price: "2000",
      features: ["Large format design", "Portable setup", "Brand integration"],
      icon: "🏢"
    },
    {
      id: 31,
      title: "Signage",
      description: "Custom signage solutions for your business location",
      price: "1100",
      features: ["Indoor/outdoor options", "Weather resistant", "Custom materials"],
      icon: "🪧"
    },
    {
      id: 32,
      title: "Vehicle wrap",
      description: "Mobile advertising with custom vehicle wraps",
      price: "2500",
      features: ["Full vehicle coverage", "Durability tested", "Professional installation guide"],
      icon: "🚐"
    }
  ],
  "clothing": [
    {
      id: 33,
      title: "T-shirt",
      description: "Custom t-shirt designs that showcase your brand personality",
      price: "800",
      features: ["Custom graphics", "Multiple colors", "Size range", "Print ready"],
      icon: "👕"
    },
    {
      id: 34,
      title: "Hat",
      description: "Branded hats and caps for promotional campaigns",
      price: "600",
      features: ["Embroidery design", "Various styles", "Custom logos", "Color options"],
      icon: "🧢"
    },
    {
      id: 35,
      title: "Hoodie",
      description: "Comfortable hoodies with custom branding and designs",
      price: "1200",
      features: ["Premium materials", "Custom prints", "Size variety", "Brand integration"],
      icon: "🦘"
    },
    {
      id: 36,
      title: "Bag",
      description: "Custom bags for events, promotions, and retail",
      price: "900",
      features: ["Tote bags", "Shopping bags", "Custom handles", "Logo placement"],
      icon: "👜"
    },
    {
      id: 37,
      title: "Mug",
      description: "Branded mugs perfect for corporate gifts and promotions",
      price: "400",
      features: ["Ceramic quality", "Dishwasher safe", "Custom designs", "Bulk orders"],
      icon: "☕"
    },
    {
      id: 38,
      title: "Water bottle",
      description: "Custom water bottles for sports teams and corporate events",
      price: "700",
      features: ["BPA-free materials", "Custom colors", "Logo printing", "Leak-proof design"],
      icon: "💧"
    },
    {
      id: 39,
      title: "Pen",
      description: "Promotional pens with your brand for marketing campaigns",
      price: "200",
      features: ["Bulk quantities", "Logo engraving", "Multiple ink colors", "Corporate quality"],
      icon: "✒️"
    },
    {
      id: 40,
      title: "Keychain",
      description: "Custom keychains as memorable promotional items",
      price: "300",
      features: ["Metal or plastic", "Custom shapes", "Logo engraving", "Durable materials"],
      icon: "🗝️"
    },
    {
      id: 41,
      title: "Sticker",
      description: "High-quality stickers for branding and promotional use",
      price: "250",
      features: ["Weather resistant", "Custom shapes", "Vinyl material", "Bulk printing"],
      icon: "🏷️"
    },
    {
      id: 42,
      title: "Badge",
      description: "Professional badges for events, conferences, and identification",
      price: "500",
      features: ["Name tags", "Event badges", "Magnetic or pin", "Custom designs"],
      icon: "🎖️"
    },
    {
      id: 43,
      title: "Magnet",
      description: "Custom magnets for refrigerators and promotional displays",
      price: "350",
      features: ["Strong magnetic hold", "Custom shapes", "Full-color printing", "Weather resistant"],
      icon: "🧲"
    },
    {
      id: 44,
      title: "USB drive",
      description: "Branded USB drives for corporate gifts and data storage",
      price: "1000",
      features: ["Various capacities", "Custom casing", "Logo engraving", "Preloaded content"],
      icon: "💾"
    }
  ],
  "art": [
    {
      id: 45,
      title: "Illustration",
      description: "Custom illustrations that bring your ideas to life with artistic flair",
      price: "1500",
      features: ["Digital artwork", "Custom style", "High resolution", "Multiple formats"],
      icon: "🎨"
    },
    {
      id: 46,
      title: "Portrait",
      description: "Professional portrait illustrations for personal or business use",
      price: "1200",
      features: ["Realistic style", "Digital painting", "Custom background", "Print ready"],
      icon: "👤"
    },
    {
      id: 47,
      title: "Cartoon",
      description: "Fun cartoon illustrations perfect for children's content and branding",
      price: "1000",
      features: ["Character design", "Colorful style", "Custom poses", "Vector format"],
      icon: "😄"
    },
    {
      id: 48,
      title: "Caricature",
      description: "Humorous caricature illustrations that capture personality with exaggeration",
      price: "800",
      features: ["Exaggerated features", "Personal style", "Fun approach", "Digital artwork"],
      icon: "🤪"
    },
    {
      id: 49,
      title: "Tattoo design",
      description: "Custom tattoo designs created by professional illustrators",
      price: "900",
      features: ["Original design", "Multiple styles", "Sizing options", "Detailed artwork"],
      icon: "🖤"
    },
    {
      id: 50,
      title: "Pattern design",
      description: "Repeating patterns for textiles, wallpapers, and decorative use",
      price: "700",
      features: ["Seamless patterns", "Custom motifs", "Various scales", "Commercial use"],
      icon: "🔄"
    },
    {
      id: 51,
      title: "Character design",
      description: "Unique character designs for games, books, and brand mascots",
      price: "1800",
      features: ["Concept development", "Multiple views", "Color schemes", "Style guide"],
      icon: "👾"
    },
    {
      id: 52,
      title: "Mascot design",
      description: "Brand mascot characters that represent your company personality",
      price: "2000",
      features: ["Brand alignment", "Multiple poses", "Expression sheet", "Usage guidelines"],
      icon: "🦁"
    },
    {
      id: 53,
      title: "Icon design",
      description: "Custom icon illustrations for apps, websites, and user interfaces",
      price: "500",
      features: ["Vector format", "Multiple sizes", "Consistent style", "App ready"],
      icon: "⭐"
    },
    {
      id: 54,
      title: "Comic book art",
      description: "Professional comic book illustrations and sequential art",
      price: "2500",
      features: ["Page layouts", "Character consistency", "Action sequences", "Professional quality"],
      icon: "📖"
    },
    {
      id: 55,
      title: "Book illustration",
      description: "Beautiful illustrations for books, novels, and educational materials",
      price: "1600",
      features: ["Story alignment", "Age-appropriate", "Chapter illustrations", "Print quality"],
      icon: "📚"
    },
    {
      id: 56,
      title: "Concept art",
      description: "Creative concept art for games, films, and creative projects",
      price: "2200",
      features: ["Visual development", "Multiple concepts", "Mood exploration", "Professional quality"],
      icon: "🎬"
    }
  ],
  "packaging": [
    {
      id: 57,
      title: "Product packaging",
      description: "Professional packaging design that showcases your product beautifully",
      price: "1800",
      features: ["3D mockups", "Print specifications", "Material guidance", "Brand alignment"],
      icon: "📦"
    },
    {
      id: 58,
      title: "Label design",
      description: "Eye-catching labels that communicate your brand message effectively",
      price: "600",
      features: ["Custom shapes", "Compliance ready", "High resolution", "Multiple formats"],
      icon: "🏷️"
    },
    {
      id: 59,
      title: "Food packaging",
      description: "Appetizing food packaging that drives purchase decisions",
      price: "2000",
      features: ["Food photography", "Nutrition panels", "FDA compliance", "Shelf appeal"],
      icon: "🍽️"
    },
    {
      id: 60,
      title: "Beverage label",
      description: "Premium beverage labels that stand out on store shelves",
      price: "1200",
      features: ["Bottle mockups", "Waterproof materials", "Brand storytelling", "Regulatory compliance"],
      icon: "🍺"
    },
    {
      id: 61,
      title: "Cosmetic packaging",
      description: "Luxury cosmetic packaging that appeals to your target market",
      price: "2200",
      features: ["Premium finishes", "Color psychology", "Trend research", "Sustainability options"],
      icon: "💄"
    },
    {
      id: 62,
      title: "Supplement label",
      description: "Professional supplement labels that build trust and credibility",
      price: "1000",
      features: ["Health claims compliance", "Clear dosage info", "Professional layout", "Safety warnings"],
      icon: "💊"
    },
    {
      id: 63,
      title: "Box design",
      description: "Custom box designs for shipping, retail, and gift packaging",
      price: "1500",
      features: ["Structural design", "Die-cut templates", "Assembly instructions", "Cost optimization"],
      icon: "📋"
    },
    {
      id: 64,
      title: "Bag design",
      description: "Shopping bags and packaging bags that promote your brand",
      price: "800",
      features: ["Handle options", "Material selection", "Size variations", "Brand integration"],
      icon: "🛍️"
    },
    {
      id: 65,
      title: "Sticker design",
      description: "Custom stickers for products, promotions, and brand awareness",
      price: "400",
      features: ["Weather resistant", "Custom die-cuts", "Adhesive options", "Bulk printing"],
      icon: "✨"
    },
    {
      id: 66,
      title: "Wrapper design",
      description: "Product wrappers that protect and promote your merchandise",
      price: "700",
      features: ["Protective materials", "Easy opening", "Brand visibility", "Cost-effective"],
      icon: "🎁"
    },
    {
      id: 67,
      title: "Bottle label",
      description: "Custom bottle labels for various industries and products",
      price: "900",
      features: ["Curved application", "Moisture resistant", "Clear printing", "Multiple sizes"],
      icon: "🍾"
    },
    {
      id: 68,
      title: "Can label",
      description: "Professional can labels for beverages and food products",
      price: "1100",
      features: ["Cylindrical design", "High-speed application", "Color accuracy", "Durability tested"],
      icon: "🥤"
    }
  ],
  "book": [
    {
      id: 69,
      title: "Book cover",
      description: "Compelling book covers that attract readers and boost sales",
      price: "1200",
      features: ["Front and back cover", "Spine design", "Print ready", "Multiple formats"],
      icon: "📚"
    },
    {
      id: 70,
      title: "Magazine design",
      description: "Professional magazine layouts that engage and inform readers",
      price: "2500",
      features: ["Complete layout", "Typography system", "Photo integration", "Print specifications"],
      icon: "📰"
    },
    {
      id: 71,
      title: "Book layout",
      description: "Interior book design with professional typography and formatting",
      price: "1800",
      features: ["Chapter layouts", "Typography", "Page numbering", "Table of contents"],
      icon: "📖"
    },
    {
      id: 72,
      title: "Magazine cover",
      description: "Eye-catching magazine covers that stand out on newsstands",
      price: "800",
      features: ["Headline design", "Image integration", "Brand consistency", "Newsstand appeal"],
      icon: "🗞️"
    },
    {
      id: 73,
      title: "Cookbook design",
      description: "Beautiful cookbook layouts with recipe formatting and food photography",
      price: "2200",
      features: ["Recipe layouts", "Food photography", "Index design", "Cooking tips"],
      icon: "👨‍🍳"
    },
    {
      id: 74,
      title: "Children's book",
      description: "Colorful and engaging children's book design and illustration",
      price: "2800",
      features: ["Illustrations", "Age-appropriate design", "Interactive elements", "Story flow"],
      icon: "🧸"
    },
    {
      id: 75,
      title: "Textbook design",
      description: "Educational textbook layouts optimized for learning and comprehension",
      price: "3000",
      features: ["Chapter organization", "Diagram layouts", "Study aids", "Academic formatting"],
      icon: "🎓"
    },
    {
      id: 76,
      title: "Annual report",
      description: "Professional annual reports that communicate corporate achievements",
      price: "2600",
      features: ["Financial charts", "Infographics", "Professional layout", "Brand alignment"],
      icon: "📊"
    },
    {
      id: 77,
      title: "Brochure design",
      description: "Informative brochures that effectively communicate your message",
      price: "900",
      features: ["Tri-fold design", "Information hierarchy", "Visual appeal", "Print ready"],
      icon: "📄"
    },
    {
      id: 78,
      title: "Newsletter design",
      description: "Engaging newsletters that keep your audience informed and interested",
      price: "700",
      features: ["Template design", "Article layouts", "Email format", "Print version"],
      icon: "📮"
    },
    {
      id: 79,
      title: "Journal design",
      description: "Professional journal and diary layouts for personal or business use",
      price: "1000",
      features: ["Custom layouts", "Daily/weekly formats", "Goal tracking", "Personal touches"],
      icon: "✍️"
    },
    {
      id: 80,
      title: "E-book design",
      description: "Digital book formatting optimized for various e-reader devices",
      price: "1500",
      features: ["Multiple formats", "Interactive elements", "Device optimization", "Typography"],
      icon: "💻"
    }
  ],
  "social-media": [
    {
      id: 81,
      title: "Instagram post",
      description: "Eye-catching Instagram posts that boost engagement and followers",
      price: "300",
      features: ["Square format", "Story versions", "Carousel options", "Brand consistency"],
      icon: "📸"
    },
    {
      id: 82,
      title: "Facebook cover",
      description: "Professional Facebook cover photos that represent your brand perfectly",
      price: "500",
      features: ["Optimal dimensions", "Mobile responsive", "Brand elements", "Call-to-action"],
      icon: "📘"
    },
    {
      id: 83,
      title: "LinkedIn banner",
      description: "Professional LinkedIn banners that enhance your business presence",
      price: "600",
      features: ["Professional design", "Contact information", "Industry relevant", "High resolution"],
      icon: "💼"
    },
    {
      id: 84,
      title: "Twitter header",
      description: "Engaging Twitter headers that capture your brand personality",
      price: "400",
      features: ["Perfect dimensions", "Brand colors", "Typography", "Mobile optimized"],
      icon: "🐦"
    },
    {
      id: 85,
      title: "YouTube thumbnail",
      description: "Click-worthy YouTube thumbnails that increase video views",
      price: "350",
      features: ["High CTR design", "Text overlay", "Brand elements", "Multiple versions"],
      icon: "📺"
    },
    {
      id: 86,
      title: "Social media kit",
      description: "Complete social media design package for all platforms",
      price: "2000",
      features: ["All platform templates", "Brand guidelines", "Content calendar", "Story templates"],
      icon: "🎨"
    },
    {
      id: 87,
      title: "Instagram story",
      description: "Engaging Instagram story templates for consistent branding",
      price: "250",
      features: ["Multiple templates", "Interactive elements", "Brand colors", "Easy editing"],
      icon: "📱"
    },
    {
      id: 88,
      title: "TikTok video cover",
      description: "Trendy TikTok video covers that stand out in feeds",
      price: "300",
      features: ["Trend-aware design", "Bold graphics", "Text overlay", "Youth appeal"],
      icon: "🎵"
    },
    {
      id: 89,
      title: "Pinterest pin",
      description: "Pinterest-optimized pins that drive traffic and engagement",
      price: "280",
      features: ["Vertical format", "Text overlay", "SEO optimized", "Save-worthy design"],
      icon: "📌"
    },
    {
      id: 90,
      title: "Snapchat geofilter",
      description: "Custom Snapchat geofilters for events and locations",
      price: "800",
      features: ["Location specific", "Event branding", "Fun elements", "Approval guidelines"],
      icon: "👻"
    },
    {
      id: 91,
      title: "Social media ad",
      description: "High-converting social media ads for all major platforms",
      price: "700",
      features: ["Platform optimization", "A/B test versions", "Clear CTA", "Audience targeting"],
      icon: "🎯"
    },
    {
      id: 92,
      title: "Animated post",
      description: "Eye-catching animated social media posts that grab attention",
      price: "900",
      features: ["GIF format", "Smooth animation", "Brand elements", "Multiple sizes"],
      icon: "🎬"
    }
  ],
  "print-design": [
    {
      id: 93,
      title: "Business card",
      description: "Professional business cards that make lasting first impressions",
      price: "400",
      features: ["Premium cardstock", "Multiple finishes", "Double-sided design", "Print ready"],
      icon: "💼"
    },
    {
      id: 94,
      title: "Letterhead",
      description: "Corporate letterhead design for professional correspondence",
      price: "500",
      features: ["Company branding", "Multiple formats", "Watermark options", "Print specifications"],
      icon: "📄"
    },
    {
      id: 95,
      title: "Brochure",
      description: "Tri-fold and bi-fold brochures for marketing and information",
      price: "900",
      features: ["Tri-fold design", "Information hierarchy", "Visual appeal", "Print ready"],
      icon: "📋"
    },
    {
      id: 96,
      title: "Flyer",
      description: "Eye-catching flyers for events and promotional campaigns",
      price: "350",
      features: ["Bold design", "Event details", "Call to action", "High resolution"],
      icon: "📃"
    },
    {
      id: 97,
      title: "Poster",
      description: "Large format posters for advertising and decoration",
      price: "1400",
      features: ["Large format", "High resolution", "Bold graphics", "Weather resistant options"],
      icon: "🎯"
    },
    {
      id: 98,
      title: "Banner",
      description: "Vinyl banners for outdoor advertising and events",
      price: "1200",
      features: ["Weather resistant", "Large format", "Grommets included", "Full color"],
      icon: "🏳️"
    },
    {
      id: 99,
      title: "Catalog",
      description: "Product catalogs with professional layout and photography",
      price: "2500",
      features: ["Product showcase", "Professional layout", "Binding options", "Bulk printing"],
      icon: "📖"
    },
    {
      id: 100,
      title: "Menu design",
      description: "Restaurant menus with appetizing layouts and typography",
      price: "800",
      features: ["Food photography", "Price formatting", "Laminated options", "Multiple sizes"],
      icon: "🍽️"
    },
    {
      id: 101,
      title: "Calendar",
      description: "Custom calendars for business or personal use",
      price: "1000",
      features: ["12-month design", "Custom photos", "Holiday marking", "Spiral binding"],
      icon: "📅"
    },
    {
      id: 102,
      title: "Sticker design",
      description: "Custom stickers for branding and promotional use",
      price: "400",
      features: ["Die-cut options", "Waterproof material", "Various sizes", "Bulk quantities"],
      icon: "🏷️"
    },
    {
      id: 103,
      title: "Envelope design",
      description: "Branded envelopes for corporate correspondence",
      price: "300",
      features: ["Standard sizes", "Window options", "Security features", "Bulk printing"],
      icon: "✉️"
    },
    {
      id: 104,
      title: "Invoice template",
      description: "Professional invoice templates for business use",
      price: "250",
      features: ["Business branding", "Tax calculations", "Payment terms", "Digital format"],
      icon: "🧾"
    }
  ],
  "default": [
    {
      id: 999,
      title: "Coming Soon",
      description: "This category will be available soon with exciting design services",
      price: "TBD",
      features: ["Professional design", "Custom solutions", "Expert consultation"],
      icon: "🚀"
    }
  ]
};

export default function CategoryPage() {
  const [location] = useLocation();
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isOrderFlowOpen, setIsOrderFlowOpen] = useState(false);
  const [isWebDesignQuestionnaireOpen, setIsWebDesignQuestionnaireOpen] = useState(false);
  const [isWebDevelopmentQuestionnaireOpen, setIsWebDevelopmentQuestionnaireOpen] = useState(false);
  const [isGeneralQuestionnaireOpen, setIsGeneralQuestionnaireOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("logo-identity");

  // Determine current category from URL
  const getCurrentCategoryFromRoute = () => {
    if (location.includes('/business-advertising')) return 'business-advertising';
    if (location.includes('/art-illustration')) return 'art-illustration';
    if (location.includes('/packaging-label')) return 'packaging-label';
    if (location.includes('/social-media')) return 'social-media';
    if (location.includes('/print-design')) return 'print-design';
    if (location.includes('/logo-and-identity')) return 'logo-identity';
    if (location.includes('/web-and-app-design')) return 'web-app';
    if (location.includes('/web-development')) return 'web-development';
    if (location === '/categories') return 'all-categories';
    return 'logo-identity';
  };

  const { data: categories } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  });

  const handlePackageSelect = (service: any) => {
    // Convert service to ServicePackage format
    const servicePackage: ServicePackage = {
      id: service.id,
      categoryId: categories?.find(cat => cat.slug === activeCategory)?.id || 1,
      name: service.title,
      slug: service.title.toLowerCase().replace(/\s+/g, '-'),
      description: service.description,
      price: parseInt(service.price) || 0,
      features: service.features || [],
      isPopular: service.id === 1
    };
    
    setSelectedPackage(servicePackage);
    
    // Route to appropriate questionnaire based on current route
    const currentCategory = getCurrentCategoryFromRoute();
    
    if (currentCategory === "logo-identity") {
      setIsOrderFlowOpen(true);
    } else if (currentCategory === "web-app") {
      setIsWebDesignQuestionnaireOpen(true);
    } else if (currentCategory === "web-development") {
      setIsWebDevelopmentQuestionnaireOpen(true);
    } else {
      // Use GeneralProjectQuestionnaireModal for business-advertising, art-illustration, packaging-label, etc.
      setIsGeneralQuestionnaireOpen(true);
    }
  };

  const handleQuizStart = () => {
    setIsQuizOpen(true);
  };

  const getCurrentServices = () => {
    const currentCategory = getCurrentCategoryFromRoute();
    
    // Map route categories to service data categories
    const categoryMap: { [key: string]: keyof typeof categoryServices } = {
      'logo-identity': 'logo-identity',
      'web-app': 'web-app',
      'web-development': 'web-app', // Use same services as web-app for development
      'business-advertising': 'advertising',
      'art-illustration': 'art',
      'packaging-label': 'packaging',
      'social-media': 'social-media',
      'print-design': 'print-design'
    };
    
    const mappedCategory = categoryMap[currentCategory] || 'default';
    return categoryServices[mappedCategory] || categoryServices.default;
  };

  const getCategoryTitle = () => {
    const currentCategory = getCurrentCategoryFromRoute();
    
    const titleMap: { [key: string]: string } = {
      'logo-identity': 'Logo & Identity Design Services',
      'web-app': 'Web & App Design Services', 
      'web-development': 'Custom Web & App Development Services',
      'business-advertising': 'Business & Advertising Design Services',
      'art-illustration': 'Art & Illustration Services',
      'packaging-label': 'Packaging & Label Design Services',
      'social-media': 'Social Media Design Services',
      'print-design': 'Print Design Services',
      'all-categories': 'All Design & Development Services'
    };
    
    return titleMap[currentCategory] || 'Design Services';
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Categories Header Section */}
      <div style={{ backgroundColor: '#F3F2F0' }} className="w-full">
        <div className="max-w-screen-xl mx-auto px-6 pt-8 pb-12">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <span>Home</span>
            <span>/</span>
            <span>categories</span>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">
              {getCategoryTitle()}
            </h1>
          </div>

          {/* Horizontal divider */}
          <div className="h-px bg-gray-400 w-full"></div>
        </div>
      </div>

      {/* Services Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* All Categories Overview */}
        {getCurrentCategoryFromRoute() === "all-categories" ? (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Choose from our comprehensive range of design and development services. Each category offers specialized solutions tailored to your business needs.
              </p>
            </div>
            
            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/categories/logo-and-identity">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600">Logo & Identity Design</h3>
                  <p className="text-gray-600 mb-4">Create memorable brand identities with custom logos, business cards, and complete brand packages.</p>
                  <div className="text-blue-600 font-medium">Starting from 800 SAR</div>
                </div>
              </Link>

              <Link to="/categories/web-and-app-design">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="text-4xl mb-4">💻</div>
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600">Web & App Design</h3>
                  <p className="text-gray-600 mb-4">Modern website designs, mobile apps, and platform customizations for all business needs.</p>
                  <div className="text-blue-600 font-medium">Starting from 2400 SAR</div>
                </div>
              </Link>

              <Link to="/categories/web-development">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600">Custom Web Development</h3>
                  <p className="text-gray-600 mb-4">Full-stack web applications with custom backend, authentication, and advanced features.</p>
                  <div className="text-blue-600 font-medium">Starting from 25,000 SAR</div>
                </div>
              </Link>

              <Link to="/categories/business-advertising">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="text-4xl mb-4">📢</div>
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600">Business & Advertising</h3>
                  <p className="text-gray-600 mb-4">Professional marketing materials, brochures, flyers, and promotional designs.</p>
                  <div className="text-blue-600 font-medium">Starting from 500 SAR</div>
                </div>
              </Link>

              <Link to="/categories/art-illustration">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="text-4xl mb-4">🎭</div>
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600">Art & Illustration</h3>
                  <p className="text-gray-600 mb-4">Custom artwork, character design, concept art, and creative illustrations.</p>
                  <div className="text-blue-600 font-medium">Starting from 1200 SAR</div>
                </div>
              </Link>

              <Link to="/categories/packaging-label">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600">Packaging & Label Design</h3>
                  <p className="text-gray-600 mb-4">Product packaging, food labels, cosmetic packaging, and brand labeling solutions.</p>
                  <div className="text-blue-600 font-medium">Starting from 800 SAR</div>
                </div>
              </Link>

              <Link to="/categories/social-media">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600">Social Media Design</h3>
                  <p className="text-gray-600 mb-4">Instagram posts, Facebook covers, social media kits, and platform-specific designs.</p>
                  <div className="text-blue-600 font-medium">Starting from 250 SAR</div>
                </div>
              </Link>

              <Link to="/categories/print-design">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="text-4xl mb-4">🖨️</div>
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600">Print Design</h3>
                  <p className="text-gray-600 mb-4">Business cards, brochures, catalogs, posters, and all printable marketing materials.</p>
                  <div className="text-blue-600 font-medium">Starting from 400 SAR</div>
                </div>
              </Link>
            </div>

            {/* Featured Custom Web Development Section */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl p-8 text-white mt-12 mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    FEATURED
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Custom Web Development</h3>
                  <p className="text-purple-100 mb-6 text-lg">
                    Full-stack development solutions using modern technologies
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                      Project Information & Goals
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                      Project Idea & Concept Details
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                      Technology Stack Preferences
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
                      Features & Functionality Requirements
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">5</div>
                      Design Guidelines & References
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">6</div>
                      User Flows & Experience Design
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">7</div>
                      Budget & Timeline Planning
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">8</div>
                      Review & Technical Assessment
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Link to="/categories/web-development">
                      <button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors">
                        Start Development Project
                        <span className="ml-2">→</span>
                      </button>
                    </Link>
                    <div className="text-sm text-purple-100">
                      Starting from <span className="font-bold text-white">25,000 SAR</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-8xl mb-4">💻</div>
                  <div className="text-lg text-purple-100">
                    8-Step Technical Assessment Process
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-blue-50 rounded-lg p-8 mt-12">
              <h2 className="text-2xl font-bold text-black mb-4">
                Need help choosing the right service?
              </h2>
              <p className="text-gray-600 mb-6">
                Take our brand discovery quiz to get personalized recommendations based on your business needs.
              </p>
              <button 
                onClick={() => setIsQuizOpen(true)}
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Start Discovery Quiz
              </button>
            </div>
            
            {/* Popular Services Showcase */}
            <div className="mt-16 bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">
                Popular Services Across Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="font-medium">Logo Design</div>
                  <div className="text-blue-600 text-sm">From 1500 SAR</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">💻</div>
                  <div className="font-medium">Website Design</div>
                  <div className="text-blue-600 text-sm">From 3200 SAR</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-medium">Social Media Kit</div>
                  <div className="text-blue-600 text-sm">From 2000 SAR</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="font-medium">Product Packaging</div>
                  <div className="text-blue-600 text-sm">From 1800 SAR</div>
                </div>
              </div>
            </div>
          </div>
        ) : getCurrentCategoryFromRoute() === "web-app" ? (
          <>
            {/* General Web Services */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-black mb-8">Web Design Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getCurrentServices().filter((service: any) => !service.platform).map((service) => (
                  <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl mb-3">{service.icon}</div>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Web Service
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-black mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-primary mb-2">
                        {service.price !== "TBD" ? `${service.price} SAR` : "TBD"}
                      </div>
                      
                      {service.features && (
                        <ul className="space-y-1">
                          {service.features.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handlePackageSelect(service)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      disabled={service.price === "TBD"}
                    >
                      {service.price === "TBD" ? "Coming Soon" : "Order Now"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform-Specific Services */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-black mb-4">Customized Web Services</h2>
              <p className="text-gray-600 mb-8">Professional website customization for popular platforms</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getCurrentServices().filter((service: any) => service.platform).map((service) => (
                  <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <PlatformLogo platform={service.platform} size={40} />
                        <div className="text-2xl">{service.icon}</div>
                      </div>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-black mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-primary mb-2">
                        {service.price} SAR
                      </div>
                      
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button 
                      onClick={() => handlePackageSelect(service)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Order Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Regular categories display */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {getCurrentServices().map((service) => (
              <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {activeCategory.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-black mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {service.price !== "TBD" ? `${service.price} SAR` : "TBD"}
                  </div>
                  
                  {service.features && (
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <button 
                  onClick={() => handlePackageSelect(service)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  disabled={service.price === "TBD"}
                >
                  {service.price === "TBD" ? "Coming Soon" : "Order Now"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-black mb-4">
            Discover your perfect brand solution today.
          </h2>
          <p className="text-gray-600 mb-6">
            Need more time thinking about your business, and our experts find the perfect solution for you.
          </p>
          <button 
            onClick={() => setIsQuizOpen(true)}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Start your branding quiz now
          </button>
          
          <div className="mt-6 text-sm text-blue-600">
            Get TechPartner.Studio while you're looking for? Send us an email now.
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectQuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        selectedPackage={selectedPackage}
      />

      <BrandQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        servicePackage={selectedPackage}
      />

      <OrderFlowModal 
        isOpen={isOrderFlowOpen}
        onClose={() => setIsOrderFlowOpen(false)}
        servicePackage={selectedPackage}
      />

      <WebDesignQuestionnaireModal
        isOpen={isWebDesignQuestionnaireOpen}
        onClose={() => setIsWebDesignQuestionnaireOpen(false)}
        servicePackage={selectedPackage}
      />

      <WebDevelopmentQuestionnaireModal
        isOpen={isWebDevelopmentQuestionnaireOpen}
        onClose={() => setIsWebDevelopmentQuestionnaireOpen(false)}
        servicePackage={selectedPackage}
      />

      <GeneralProjectQuestionnaireModal
        isOpen={isGeneralQuestionnaireOpen}
        onClose={() => setIsGeneralQuestionnaireOpen(false)}
        servicePackage={selectedPackage}
      />
    </div>
  );
}