import axios from 'axios';

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

// All translation keys from the site
const allTranslations: Record<string, string> = {
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
  'footer.rights': 'All rights reserved',
  'footer.company': 'TechPartner',
  'language.switch': 'Switch Language',
  'loading': 'Loading...',
  'error': 'Error',
  'success': 'Success',
  'ai.assistant': 'AI Assistant',
  'ai.chat': 'Chat',
  'ai.code': 'Code',
  'ai.content': 'Content',
  'ai.marketing': 'Marketing',
  'ai.thinking': 'Thinking...',
  'ai.placeholder': 'Ask me anything about web development, design, or technology...',
  
  // Homepage content
  'hero.title': 'Design personalized to fit your needs perfectly.',
  'hero.subtitle': 'Get custom designs that perfectly match your vision. From logos to websites, our expert designers bring your ideas to life with creativity and precision.',
  'hero.cta.primary': 'Start Your Project',
  'hero.cta.secondary': 'View Portfolio',
  
  // Services
  'services.title': 'Our Design and Development',
  'services.subtitle': 'Professional design and development solutions for every business need',
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
  'business.description': 'Our trusted designer community specializes in logos, websites, packaging design, and more. We\'ve assisted thousands of businesses in launching, growing, expanding, and rebranding with custom, professional design.',
  'business.feature1': 'Expert designers with proven track records',
  'business.feature2': 'Custom solutions tailored to your brand',
  'business.feature3': 'Fast turnaround with unlimited revisions',
  'business.cta': 'Start Your Brand',
  
  // Logo section
  'logo.main.title': 'Everything begins with a logo.',
  'logo.main.subtitle': 'Whether you\'re starting fresh or refining your brand, our solutions are tailored to suit your business and elevate your branding',
  'logo.ai.title': 'Try Our AI Logo Maker',
  'logo.ai.description': 'Easily craft your unique logo in just minutes with our intuitive, AI-powered tool. It\'s effortless and provides the ideal starting point or inspiration for our expert designers to elevate your branding journey to new heights.',
  'logo.ai.cta': 'Create a logo, it\'s free',
  'logo.contest.title': 'Start a logo contest.',
  'logo.contest.description': 'Elevate your branding journey with a wide array of custom logo options from our talented community of freelancers. Experience next-level creative direction, unmatched expertise, and personalized solutions tailored to your unique business needs.',
  'logo.contest.pricing': 'Logos from SAR1500',
  
  // Portfolio
  'portfolio.title': 'Portfolio Highlights',
  'portfolio.subtitle': 'See the exceptional work we\'ve delivered for clients across various industries',
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
  'team.description': 'Our skilled developers and designers bring years of experience in creating cutting-edge digital solutions. From complex web applications to stunning brand identities, we\'re your dedicated technology partners.',
  
  // Auth
  'auth.login': 'Login',
  'auth.logout': 'Logout',
  'auth.register': 'Register',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.forgotPassword': 'Forgot Password?',
  'auth.noAccount': 'Don\'t have an account?',
  'auth.hasAccount': 'Already have an account?',
  
  // Profile
  'profile.edit': 'Edit Profile',
  'profile.save': 'Save Changes',
  'profile.cancel': 'Cancel',
  'profile.firstName': 'First Name',
  'profile.lastName': 'Last Name',
  'profile.phone': 'Phone',
  'profile.address': 'Address',
  
  // Orders
  'orders.title': 'My Orders',
  'orders.history': 'Order History',
  'orders.noOrders': 'No orders yet',
  'orders.status.pending': 'Pending',
  'orders.status.completed': 'Completed',
  'orders.status.cancelled': 'Cancelled',
  
  // Stats
  'stats.projects': 'Projects Delivered',
  'stats.clients': 'Happy Clients',
  'stats.rating': 'Satisfaction Rate',
  
  // CTA section
  'cta.title': 'Ready to bring your vision to life?',
  'cta.subtitle': 'Join thousands of satisfied clients who\'ve transformed their brands with our design services.',
  'cta.button': 'Get Started Today',
};

async function populateTranslations() {
  console.log('🚀 Starting translation population...\n');
  
  const keys = Object.keys(allTranslations);
  const total = keys.length;
  
  console.log(`📊 Total keys to translate: ${total}\n`);
  
  // Process in batches of 5 to avoid overwhelming the server
  const batchSize = 5;
  let completed = 0;
  let failed = 0;
  
  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(keys.length / batchSize);
    
    console.log(`\\n📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} keys)...`);
    
    try {
      // Use the auto-translate endpoint for batch processing
      const batchContent: Record<string, string> = {};
      batch.forEach(key => {
        batchContent[key] = allTranslations[key];
      });
      
      const response = await axios.post(`${API_BASE}/api/i18n/auto-translate`, {
        content: batchContent,
        targetLang: 'ar',
        sourceLang: 'en'
      });
      
      if (response.data && response.data.translated) {
        completed += batch.length;
        console.log(`  ✅ Batch ${batchNum} completed`);
        
        // Show a sample translation
        const sampleKey = batch[0];
        console.log(`     Sample: "${allTranslations[sampleKey]}" → "${response.data.translated[sampleKey]}"`);
      }
    } catch (error: any) {
      console.error(`  ❌ Batch ${batchNum} failed:`, error.message);
      failed += batch.length;
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\\n✨ Translation population complete!`);
  console.log(`   ✅ Successful: ${completed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Total: ${total}`);
  
  // Check cache stats
  try {
    const stats = await axios.get(`${API_BASE}/api/i18n/cache-stats`);
    console.log(`\\n📈 Server cache stats:`, stats.data);
  } catch (error) {
    console.warn('Could not fetch cache stats');
  }
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.includes(process.argv[1]);

if (isMainModule) {
  populateTranslations().catch(console.error);
}

export { populateTranslations, allTranslations };
