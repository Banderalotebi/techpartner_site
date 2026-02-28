// Translation management script
// Run with: npx ts-node scripts/manage-translations.ts

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api/i18n';

interface TranslationContent {
  [key: string]: string;
}

// Complete translation content for the site
const siteContent: TranslationContent = {
  // Navigation
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.services': 'Services',
  'nav.portfolio': 'Portfolio',
  'nav.blog': 'Blog',
  'nav.contact': 'Contact',
  'nav.dashboard': 'Dashboard',
  'nav.categories': 'Categories',
  'nav.ai-studio': 'AI Studio',
  
  // Hero section
  'hero.title': 'Design personalized to fit your needs perfectly.',
  'hero.subtitle': 'Get custom designs that perfectly match your vision. From logos to websites, our expert designers bring your ideas to life with creativity and precision.',
  'hero.cta.primary': 'Start Your Project',
  'hero.cta.secondary': 'View Portfolio',
  'nav.blog': 'Read Blog',
  
  // Services
  'services.title': 'Our Design and Development',
  'services.subtitle': 'Professional design and development solutions for every business need',
  
  // Development section
  'development.title': 'Custom Web Development',
  'development.subtitle': 'Professional full-stack development solutions using modern technologies. From simple websites to complex web applications with complete technical requirements gathering.',
  'development.feature1': 'Custom UI/UX Design',
  'development.feature2': 'Full-Stack Development',
  'development.feature3': 'CMS Integration & Backend',
  'development.feature4': '8-Step Technical Assessment',
  'development.cta': 'Start Development Project',
  'development.pricing': 'Starting from',
  'development.price': '25,000 SAR',
  
  // Business section
  'business.title.part1': 'Your business',
  'business.title.part2': 'exceptional design',
  'business.description': 'Our trusted designer community specializes in logos, websites, packaging design, and more. We have assisted thousands of businesses in launching, growing, expanding, and rebranding with custom, professional design.',
  'business.feature1': 'Expert designers with proven track records',
  'business.feature2': 'Custom solutions tailored to your brand',
  'business.feature3': 'Fast turnaround with unlimited revisions',
  'business.cta': 'Start Your Brand',
  
  // Logo section
  'logo.main.title': 'Everything begins with a logo.',
  'logo.main.subtitle': 'Whether you are starting fresh or refining your brand, our solutions are tailored to suit your business and elevate your branding',
  'logo.ai.title': 'Try Our AI Logo Maker',
  'logo.ai.description': 'Easily craft your unique logo in just minutes with our intuitive, AI-powered tool. It is effortless and provides the ideal starting point or inspiration for our expert designers to elevate your branding journey to new heights.',
  'logo.ai.cta': 'Create a logo, it is free',
  'logo.contest.title': 'Start a logo contest.',
  'logo.contest.description': 'Elevate your branding journey with a wide array of custom logo options from our talented community of freelancers. Experience next-level creative direction, unmatched expertise, and personalized solutions tailored to your unique business needs.',
  'logo.contest.pricing': 'Logos from SAR1500',
  
  // Portfolio
  'portfolio.title': 'Portfolio Highlights',
  'portfolio.subtitle': 'See the exceptional work we have delivered for clients across various industries',
  'portfolio.example1.client': 'Tech Solutions Inc.',
  'portfolio.example1.description': 'Logo design, business cards, and brand guidelines',
  'portfolio.example2.client': 'Boutique Fashion',
  'portfolio.example2.description': 'Modern e-commerce website with custom features',
  'portfolio.example3.client': 'Wellness Studio',
  'portfolio.example3.description': 'Instagram templates and brand consistency',
  
  // Testimonials
  'testimonials.title': 'What Our Clients Say',
  'testimonials.subtitle': 'Real feedback from satisfied customers',
  'testimonials.review1.text': '"Outstanding complete brand identity package. The 6-step logo design process made everything clear and professional."',
  'testimonials.review1.name': 'Ahmed Salem',
  'testimonials.review1.title': 'CEO, Saudi Tech Solutions',
  'testimonials.review2.text': '"The 8-step custom web development process was thorough. They built exactly the e-commerce platform we needed."',
  'testimonials.review2.name': 'Layla Mohammed',
  'testimonials.review2.title': 'Owner, Riyadh Fashion Boutique',
  'testimonials.review3.text': '"Comprehensive project questionnaire helped them understand our needs. Professional social media and print designs."',
  'testimonials.review3.name': 'Mohammed Khalid',
  'testimonials.review3.title': 'Director, Wellness Studio Jeddah',
  
  // Team section
  'team.badge': 'Expert Development Team',
  'team.title': 'Meet Your TechPartner Experts',
  'team.description': 'Our skilled developers and designers bring years of experience in creating cutting-edge digital solutions. From complex web applications to stunning brand identities, we are your dedicated technology partners.',
  
  // Services
  'service.logo.title': 'Logo & branding design',
  'service.logo.description': 'Create a memorable brand identity that stands out',
  'service.web.title': 'Website & app design',
  'service.web.description': 'Modern, responsive designs for digital experiences',
  'service.business.title': 'Business & advertising',
  'service.business.description': 'Professional marketing materials that convert',
  'service.art.title': 'Art & illustration',
  'service.art.description': 'Custom artwork and illustrations for any project',
  'service.packaging.title': 'Packaging & label',
  'service.packaging.description': 'Product packaging that attracts and sells',
  'service.development.title': 'Custom web & apps development',
  'service.development.description': 'Professional custom development using modern full stack solutions',
  
  // Auth
  'auth.login': 'Login',
  'auth.logout': 'Logout',
  'auth.register': 'Register',
  
  // Profile
  'profile.edit': 'Edit Profile',
  'orders.history': 'Order History',
  
  // Stats
  'stats.projects': 'Projects Delivered',
  'stats.clients': 'Happy Clients',
  'stats.rating': 'Satisfaction Rate',
  
  // Footer
  'footer.rights': 'All rights reserved',
  'footer.company': 'TechPartner',
  
  // CTA
  'cta.title': 'Ready to bring your vision to life?',
  'cta.subtitle': 'Join thousands of satisfied clients who have transformed their brands with our design services.',
  'cta.button': 'Get Started Today',
  
  // Common
  'loading': 'Loading...',
  'error': 'Error',
  'success': 'Success',
};

async function generateAllTranslations() {
  console.log('🚀 Starting translation generation...\n');
  
  try {
    // Test server connection
    console.log('📡 Testing server connection...');
    const healthCheck = await axios.get(`${API_BASE_URL.replace('/i18n', '')}/health`);
    console.log('✅ Server is online:', healthCheck.data.status);
    
    // Get supported languages
    console.log('\n🌐 Fetching supported languages...');
    const languagesResponse = await axios.get(`${API_BASE_URL}/languages`);
    console.log('Supported languages:', languagesResponse.data.languages);
    
    // Auto-translate to Arabic
    console.log('\n🤖 Auto-translating content to Arabic...');
    const translateResponse = await axios.post(`${API_BASE_URL}/auto-translate`, {
      content: siteContent,
      targetLang: 'ar',
      sourceLang: 'en'
    });
    
    const arabicTranslations = translateResponse.data.translated;
    
    console.log('\n✅ Translation complete!');
    console.log(`📊 Translated ${Object.keys(arabicTranslations).length} keys`);
    
    // Save to file
    const outputDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'translations-ar.json');
    fs.writeFileSync(outputPath, JSON.stringify(arabicTranslations, null, 2));
    console.log(`\n💾 Translations saved to: ${outputPath}`);
    
    // Display sample translations
    console.log('\n📋 Sample translations:');
    const sampleKeys = ['nav.home', 'hero.title', 'services.title', 'cta.button'];
    sampleKeys.forEach(key => {
      console.log(`  ${key}:`);
      console.log(`    EN: ${siteContent[key]}`);
      console.log(`    AR: ${arabicTranslations[key]}`);
    });
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    process.exit(1);
  }
}

async function testTranslation() {
  console.log('🧪 Testing translation endpoint...\n');
  
  const testText = 'Hello, how are you today?';
  
  try {
    const response = await axios.post(`${API_BASE_URL}/translate`, {
      text: testText,
      sourceLang: 'en',
      targetLang: 'ar'
    });
    
    console.log('Original:', testText);
    console.log('Translated:', response.data.translated);
    console.log('Source:', response.data.sourceLang);
    console.log('Target:', response.data.targetLang);
    
  } catch (error: any) {
    console.error('❌ Translation test failed:', error.message);
  }
}

async function getCacheStats() {
  console.log('📊 Getting cache statistics...\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/cache-stats`);
    console.log('Cache stats:', response.data);
  } catch (error: any) {
    console.error('❌ Failed to get cache stats:', error.message);
  }
}

// Main command handler
const command = process.argv[2];

switch (command) {
  case 'generate':
    generateAllTranslations();
    break;
  case 'test':
    testTranslation();
    break;
  case 'stats':
    getCacheStats();
    break;
  default:
    console.log(`
Translation Management Script

Usage:
  npx ts-node scripts/manage-translations.ts [command]

Commands:
  generate  - Generate all Arabic translations using AI
  test      - Test translation endpoint with a sample text
  stats     - Get translation cache statistics

Examples:
  npx ts-node scripts/manage-translations.ts generate
  npx ts-node scripts/manage-translations.ts test
    `);
    process.exit(0);
}
