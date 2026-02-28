// Translation script using Ollama AI
// Run with: npx ts-node scripts/translate-content.ts

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL = 'qwen2.5:7b';

interface TranslationPair {
  en: string;
  ar: string;
}

// Common text content to translate
const contentToTranslate: { key: string; en: string }[] = [
  // Navigation
  { key: 'nav.home', en: 'Home' },
  { key: 'nav.about', en: 'About' },
  { key: 'nav.services', en: 'Services' },
  { key: 'nav.portfolio', en: 'Portfolio' },
  { key: 'nav.blog', en: 'Blog' },
  { key: 'nav.contact', en: 'Contact' },
  { key: 'nav.dashboard', en: 'Dashboard' },
  { key: 'nav.categories', en: 'Categories' },
  
  // Hero section
  { key: 'hero.title', en: 'Design personalized to fit your needs perfectly.' },
  { key: 'hero.subtitle', en: 'Get custom designs that perfectly match your vision. From logos to websites, our expert designers bring your ideas to life with creativity and precision.' },
  { key: 'hero.cta.primary', en: 'Start Your Project' },
  { key: 'hero.cta.secondary', en: 'View Portfolio' },
  
  // Services
  { key: 'services.title', en: 'Our Design and Development' },
  { key: 'services.subtitle', en: 'Professional design and development solutions for every business need' },
  
  // Development section
  { key: 'development.title', en: 'Custom Web Development' },
  { key: 'development.subtitle', en: 'Professional full-stack development solutions using modern technologies. From simple websites to complex web applications with complete technical requirements gathering.' },
  { key: 'development.feature1', en: 'Custom UI/UX Design' },
  { key: 'development.feature2', en: 'Full-Stack Development' },
  { key: 'development.feature3', en: 'CMS Integration & Backend' },
  { key: 'development.feature4', en: '8-Step Technical Assessment' },
  { key: 'development.cta', en: 'Start Development Project' },
  { key: 'development.pricing', en: 'Starting from' },
  { key: 'development.price', en: '25,000 SAR' },
  
  // Business section
  { key: 'business.title.part1', en: 'Your business' },
  { key: 'business.title.part2', en: 'exceptional design' },
  { key: 'business.description', en: 'Our trusted designer community specializes in logos, websites, packaging design, and more. We have assisted thousands of businesses in launching, growing, expanding, and rebranding with custom, professional design.' },
  { key: 'business.feature1', en: 'Expert designers with proven track records' },
  { key: 'business.feature2', en: 'Custom solutions tailored to your brand' },
  { key: 'business.feature3', en: 'Fast turnaround with unlimited revisions' },
  { key: 'business.cta', en: 'Start Your Brand' },
  
  // Logo section
  { key: 'logo.main.title', en: 'Everything begins with a logo.' },
  { key: 'logo.main.subtitle', en: 'Whether you are starting fresh or refining your brand, our solutions are tailored to suit your business and elevate your branding' },
  { key: 'logo.ai.title', en: 'Try Our AI Logo Maker' },
  { key: 'logo.ai.description', en: 'Easily craft your unique logo in just minutes with our intuitive, AI-powered tool. It is effortless and provides the ideal starting point or inspiration for our expert designers to elevate your branding journey to new heights.' },
  { key: 'logo.ai.cta', en: 'Create a logo, it is free' },
  { key: 'logo.contest.title', en: 'Start a logo contest.' },
  { key: 'logo.contest.description', en: 'Elevate your branding journey with a wide array of custom logo options from our talented community of freelancers. Experience next-level creative direction, unmatched expertise, and personalized solutions tailored to your unique business needs.' },
  { key: 'logo.contest.pricing', en: 'Logos from SAR1500' },
  
  // Portfolio
  { key: 'portfolio.title', en: 'Portfolio Highlights' },
  { key: 'portfolio.subtitle', en: 'See the exceptional work we have delivered for clients across various industries' },
  
  // Testimonials
  { key: 'testimonials.title', en: 'What Our Clients Say' },
  { key: 'testimonials.subtitle', en: 'Real feedback from satisfied customers' },
  
  // Team section
  { key: 'team.badge', en: 'Expert Development Team' },
  { key: 'team.title', en: 'Meet Your TechPartner Experts' },
  { key: 'team.description', en: 'Our skilled developers and designers bring years of experience in creating cutting-edge digital solutions. From complex web applications to stunning brand identities, we are your dedicated technology partners.' },
  { key: 'team.feature1.title', en: 'Certified Experts' },
  { key: 'team.feature1.description', en: 'Industry-certified professionals with proven track records' },
  { key: 'team.feature2.title', en: 'Fast Delivery' },
  { key: 'team.feature2.description', en: 'Quick turnaround times without compromising quality' },
  { key: 'team.feature3.title', en: 'Quality Assured' },
  { key: 'team.feature3.description', en: 'Rigorous testing and quality control processes' },
  { key: 'team.feature4.title', en: 'Client Focused' },
  { key: 'team.feature4.description', en: 'Dedicated support and personalized service approach' },
  
  // Process section
  { key: 'process.title', en: 'Our Service Categories and Process' },
  { key: 'process.subtitle', en: 'Comprehensive questionnaire flows designed to understand your exact needs and deliver perfect results' },
  
  // Stats
  { key: 'stats.projects', en: 'Projects Delivered' },
  { key: 'stats.clients', en: 'Happy Clients' },
  { key: 'stats.rating', en: 'Satisfaction Rate' },
  
  // CTA
  { key: 'cta.title', en: 'Ready to bring your vision to life?' },
  { key: 'cta.subtitle', en: 'Join thousands of satisfied clients who have transformed their brands with our design services.' },
  { key: 'cta.button', en: 'Get Started Today' },
  
  // Common UI
  { key: 'footer.rights', en: 'All rights reserved' },
  { key: 'footer.company', en: 'TechPartner' },
  { key: 'language.switch', en: 'Switch Language' },
  { key: 'loading', en: 'Loading...' },
  { key: 'error', en: 'Error' },
  { key: 'success', en: 'Success' },
  
  // About page
  { key: 'about.title', en: 'Meet Our Team' },
  { key: 'about.hero.title', en: 'About' },
  { key: 'about.hero.title.highlight', en: 'TechPartner' },
  { key: 'about.hero.subtitle', en: 'Your trusted partner for professional design and development solutions. We create exceptional digital experiences that help businesses grow and succeed.' },
  { key: 'about.hero.cta1', en: 'View Our Services' },
  { key: 'about.hero.cta2', en: 'Get In Touch' },
  
  // Contact page
  { key: 'contact.hero.title', en: 'Get In' },
  { key: 'contact.hero.title.highlight', en: 'Touch' },
  { key: 'contact.hero.subtitle', en: 'Ready to start your project? We would love to hear from you. Send us a message and we will respond within 24 hours.' },
  { key: 'contact.form.submit', en: 'Send Message' },
  
  // Service categories
  { key: 'service.logo.title', en: 'Logo and branding design' },
  { key: 'service.logo.description', en: 'Create a memorable brand identity that stands out' },
  { key: 'service.web.title', en: 'Website and app design' },
  { key: 'service.web.description', en: 'Modern, responsive designs for digital experiences' },
  { key: 'service.business.title', en: 'Business and advertising' },
  { key: 'service.business.description', en: 'Professional marketing materials that convert' },
  { key: 'service.art.title', en: 'Art and illustration' },
  { key: 'service.art.description', en: 'Custom artwork and illustrations for any project' },
  { key: 'service.packaging.title', en: 'Packaging and label' },
  { key: 'service.packaging.description', en: 'Product packaging that attracts and sells' },
  { key: 'service.development.title', en: 'Custom web and apps development' },
  { key: 'service.development.description', en: 'Professional custom development using modern full stack solutions' },
];

async function translateToArabic(text: string): Promise<string> {
  try {
    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
      model: MODEL,
      prompt: `Translate the following English text to Modern Standard Arabic (فصحى). Only respond with the translation, nothing else:\n\n${text}`,
      stream: false
    });
    
    return response.data.response.trim();
  } catch (error) {
    console.error(`Error translating "${text}":`, error.message);
    return text;
  }
}

async function generateTranslations() {
  console.log('Starting translation generation...');
  console.log(`Connecting to Ollama at: ${OLLAMA_HOST}`);
  
  const translations: Record<string, string> = {};
  
  for (const item of contentToTranslate) {
    console.log(`Translating: ${item.en}`);
    const arabic = await translateToArabic(item.en);
    translations[item.key] = arabic;
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\nGenerated Arabic translations:\n');
  console.log(JSON.stringify(translations, null, 2));
  
  const outputPath = path.join(__dirname, 'translations-output.json');
  fs.writeFileSync(outputPath, JSON.stringify(translations, null, 2));
  console.log(`\nTranslations saved to: ${outputPath}`);
  
  return translations;
}

generateTranslations().catch(console.error);
