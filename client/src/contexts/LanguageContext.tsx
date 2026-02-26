import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ar';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  translations: Record<string, string>;
  t: (key: string, fallback?: string) => string;
  translateText: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Default translations for common UI elements
const defaultTranslations: Record<Language, Record<string, string>> = {
  en: {
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
    'service.development.title': 'Custom web and apps development',
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
    'portfolio.example1.title': 'Corporate Identity',
    'portfolio.example1.subtitle': 'Complete brand package',
    'portfolio.example1.client': 'Tech Solutions Inc.',
    'portfolio.example1.description': 'Logo design, business cards, and brand guidelines',
    'portfolio.example2.title': 'E-commerce Platform',
    'portfolio.example2.subtitle': 'Full website design',
    'portfolio.example2.client': 'Boutique Fashion',
    'portfolio.example2.description': 'Modern e-commerce website with custom features',
    'portfolio.example3.title': 'Social Media Kit',
    'portfolio.example3.subtitle': 'Complete branding',
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
    'team.feature1.title': 'Certified Experts',
    'team.feature1.description': 'Industry-certified professionals with proven track records',
    'team.feature2.title': 'Fast Delivery',
    'team.feature2.description': 'Quick turnaround times without compromising quality',
    'team.feature3.title': 'Quality Assured',
    'team.feature3.description': 'Rigorous testing and quality control processes',
    'team.feature4.title': 'Client Focused',
    'team.feature4.description': 'Dedicated support and personalized service approach',
    
    // Process section
    'process.title': 'Our Service Categories & Process',
    'process.subtitle': 'Comprehensive questionnaire flows designed to understand your exact needs and deliver perfect results',
    'process.logo.title': 'Logo & Identity',
    'process.logo.subtitle': 'Complete brand identity design',
    'process.logo.step1': 'Package Selection & Pricing',
    'process.logo.step2': 'Design Selection from Gallery',
    'process.logo.step3': 'Brand Details & Information',
    'process.logo.step4': 'Style Preferences (7 Sliders)',
    'process.logo.step5': 'Color Selection & Palette',
    'process.logo.step6': 'Review & Order Confirmation',
    'process.logo.cta': 'Start Logo Project',
    
    'process.development.title': 'Custom Web Development',
    'process.development.subtitle': 'Full-stack development solutions',
    'process.development.badge': 'FEATURED',
    'process.development.step1': 'Project Information & Goals',
    'process.development.step2': 'Project Idea & Concept Details',
    'process.development.step3': 'Technology Stack Preferences',
    'process.development.step4': 'Features & Functionality Requirements',
    'process.development.step5': 'Design Guidelines & References',
    'process.development.step6': 'User Flows & Experience Design',
    'process.development.step7': 'Budget & Timeline Planning',
    'process.development.step8': 'Review & Technical Assessment',
    'process.development.cta': 'Start Development Project',
    'process.development.pricing': 'Starting from',
    'process.development.price': '25,000 SAR',
    
    'process.other.title': 'All Other Services',
    'process.other.subtitle': 'Comprehensive project intake',
    'process.other.step1': 'Project Information & Contact',
    'process.other.step2': 'Detailed Project Description',
    'process.other.step3': 'Timeline & Urgency Assessment',
    'process.other.step4': 'File Uploads & References',
    'process.other.service1': 'Business & Advertising',
    'process.other.service2': 'Art & Illustration',
    'process.other.service3': 'Packaging & Labels',
    'process.other.service4': 'Social Media Design',
    'process.other.service5': 'Print Design',
    'process.other.cta': 'View All Categories',
    
    // Blog section
    'blog.title': 'Latest from Our',
    'blog.title.highlight': 'Blog',
    'blog.subtitle': 'Stay updated with the latest insights, tutorials, and industry trends from our expert team',
    'blog.post1.category': 'Brand Identity',
    'blog.post1.date': 'Dec 15, 2024',
    'blog.post1.read': '8 min read',
    'blog.post1.title': 'The Future of Logo Design in Saudi Arabia\'s Digital Transformation',
    'blog.post1.excerpt': 'Explore how Saudi Vision 2030 is reshaping brand identity requirements and what modern businesses need to know about effective logo design.',
    'blog.post1.author': 'Ahmed Al-Rashid',
    'blog.post2.category': 'Web Development',
    'blog.post2.date': 'Dec 10, 2024',
    'blog.post2.read': '6 min read',
    'blog.post2.title': 'E-commerce Web Development Trends for MENA Businesses',
    'blog.post2.excerpt': 'Discover the latest web development technologies and user experience patterns that drive successful e-commerce platforms in the Middle East.',
    'blog.post2.author': 'Fatima Al-Zahra',
    'blog.post3.category': 'Mobile Design',
    'blog.post3.date': 'Nov 15, 2024',
    'blog.post3.read': '9 min read',
    'blog.post3.title': 'Mobile-First Design Strategies for Saudi Market',
    'blog.post3.excerpt': 'With over 95% mobile penetration in Saudi Arabia, learn how to design mobile-first experiences that resonate with local users.',
    'blog.post3.author': 'Khalid Al-Sudairi',
    'blog.readmore': 'Read More',
    'blog.viewall': 'View All Blog Posts',
    
    // CTA section
    'cta.title': 'Ready to bring your vision to life?',
    'cta.subtitle': 'Join thousands of satisfied clients who\'ve transformed their brands with our design services.',
    'cta.button': 'Get Started Today',
    
    // Stats
    'stats.projects': 'Projects Delivered',
    'stats.clients': 'Happy Clients',
    'stats.rating': 'Satisfaction Rate',
    
    // About page
    'about.title': 'Meet Our Team',
    'about.hero.title': 'About',
    'about.hero.title.highlight': 'TechPartner',
    'about.hero.subtitle': 'Your trusted partner for professional design and development solutions. We create exceptional digital experiences that help businesses grow and succeed.',
    'about.hero.cta1': 'View Our Services',
    'about.hero.cta2': 'Get In Touch',
    
    'about.stats.projects': 'Projects Completed',
    'about.stats.clients': 'Happy Clients',
    'about.stats.categories': 'Service Categories',
    'about.stats.support': 'Support Available',
    
    'about.story.title': 'Our Story',
    'about.story.p1': 'TechPartner was founded with a simple mission: to provide exceptional design and development services that help businesses succeed in the digital age. We believe that great design is not just about aesthetics—it\'s about creating meaningful connections between brands and their audiences.',
    'about.story.p2': 'Over the years, we\'ve had the privilege of working with hundreds of clients across various industries, from startups to established corporations. Each project has taught us something new and helped us refine our approach to delivering outstanding results.',
    'about.story.p3': 'Today, we\'re proud to be recognized as a leading design and development agency in the region, known for our creativity, professionalism, and commitment to client satisfaction.',
    
    'about.features.expert.title': 'Expert Team',
    'about.features.expert.desc': 'Skilled designers and developers',
    'about.features.fast.title': 'Fast Delivery',
    'about.features.fast.desc': 'Quick turnaround times',
    'about.features.quality.title': 'Quality Focus',
    'about.features.quality.desc': 'Attention to every detail',
    'about.features.global.title': 'Global Reach',
    'about.features.global.desc': 'Serving clients worldwide',
    
    'about.services.title': 'Our Services',
    'about.services.subtitle': 'Comprehensive design and development solutions tailored to your business needs',
    'about.services.logo.title': 'Logo & Brand Identity',
    'about.services.logo.desc': 'Complete brand identity packages from concept to execution',
    'about.services.logo.price': 'Starting at 1,500 SAR',
    'about.services.logo.feature1': 'Custom logo design',
    'about.services.logo.feature2': 'Brand guidelines',
    'about.services.logo.feature3': 'Business cards',
    'about.services.logo.feature4': 'Letterhead',
    
    'about.services.web.title': 'Web Design & Development',
    'about.services.web.desc': 'Professional websites and web applications',
    'about.services.web.price': 'Starting at 5,000 SAR',
    'about.services.web.feature1': 'Responsive design',
    'about.services.web.feature2': 'E-commerce integration',
    'about.services.web.feature3': 'CMS setup',
    'about.services.web.feature4': 'SEO optimization',
    
    'about.services.custom.title': 'Custom Development',
    'about.services.custom.desc': 'Full-stack web applications and software solutions',
    'about.services.custom.price': 'Starting at 25,000 SAR',
    'about.services.custom.feature1': 'Custom web apps',
    'about.services.custom.feature2': 'API development',
    'about.services.custom.feature3': 'Database design',
    'about.services.custom.feature4': 'Cloud deployment',
    
    'about.services.print.title': 'Print & Packaging',
    'about.services.print.desc': 'Professional print design and packaging solutions',
    'about.services.print.price': 'Starting at 800 SAR',
    'about.services.print.feature1': 'Brochures & flyers',
    'about.services.print.feature2': 'Product packaging',
    'about.services.print.feature3': 'Business materials',
    'about.services.print.feature4': 'Marketing collateral',
    
    'about.portfolio.title': 'Recent Work',
    'about.portfolio.subtitle': 'A selection of our recent projects showcasing our diverse capabilities',
    'about.portfolio.tech.title': 'Tech Solutions Inc.',
    'about.portfolio.tech.category': 'Corporate Identity',
    'about.portfolio.tech.desc': 'Complete brand identity package including logo, business cards, and brand guidelines',
    'about.portfolio.retail.title': 'Arabian Retail Store',
    'about.portfolio.retail.category': 'E-commerce Website',
    'about.portfolio.retail.desc': 'Full e-commerce platform with Arabic language support and local payment integration',
    'about.portfolio.agency.title': 'Creative Agency Portfolio',
    'about.portfolio.agency.category': 'Web Development',
    'about.portfolio.agency.desc': 'Custom portfolio website with interactive galleries and content management',
    'about.portfolio.restaurant.title': 'Restaurant Chain',
    'about.portfolio.restaurant.category': 'Brand & Print',
    'about.portfolio.restaurant.desc': 'Complete rebrand with packaging design, menu design, and marketing materials',
    
    'about.cta.title': 'Ready to Start Your Project?',
    'about.cta.subtitle': 'Let\'s discuss how we can help bring your vision to life with our professional design and development services.',
    'about.cta.button1': 'Start Your Project',
    'about.cta.button2': 'Contact Us',
    
    // Contact page
    'contact.hero.title': 'Get In',
    'contact.hero.title.highlight': 'Touch',
    'contact.hero.subtitle': 'Ready to start your project? We\'d love to hear from you. Send us a message and we\'ll respond within 24 hours.',
    
    'contact.info.email.title': 'Email',
    'contact.info.email.details': 'info@techpartner.sa',
    'contact.info.email.desc': 'Send us an email anytime!',
    'contact.info.phone.title': 'Phone',
    'contact.info.phone.details': '+966 50 123 4567',
    'contact.info.phone.desc': 'Call us for urgent matters',
    'contact.info.location.title': 'Location',
    'contact.info.location.details': 'Riyadh, Saudi Arabia',
    'contact.info.location.desc': 'We\'re based in the heart of KSA',
    'contact.info.hours.title': 'Working Hours',
    'contact.info.hours.details': 'Sun - Thu: 9AM - 6PM',
    'contact.info.hours.desc': 'Saudi Arabian timezone',
    
    'contact.form.title': 'Send Us a Message',
    'contact.form.name': 'Full Name',
    'contact.form.name.placeholder': 'Your full name',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'your.email@example.com',
    'contact.form.phone': 'Phone Number',
    'contact.form.phone.placeholder': '+966 50 123 4567',
    'contact.form.company': 'Company Name',
    'contact.form.company.placeholder': 'Your company name',
    'contact.form.service': 'Service Needed',
    'contact.form.service.placeholder': 'Select a service',
    'contact.form.service.logo': 'Logo & Brand Identity',
    'contact.form.service.webdesign': 'Web Design',
    'contact.form.service.webdev': 'Web Development',
    'contact.form.service.business': 'Business & Advertising',
    'contact.form.service.art': 'Art & Illustration',
    'contact.form.service.packaging': 'Packaging & Label',
    'contact.form.service.print': 'Print Design',
    'contact.form.service.social': 'Social Media Design',
    'contact.form.service.other': 'Other',
    'contact.form.budget': 'Budget Range',
    'contact.form.budget.placeholder': 'Select budget range',
    'contact.form.budget.under5k': 'Under 5,000 SAR',
    'contact.form.budget.5k15k': '5,000 - 15,000 SAR',
    'contact.form.budget.15k30k': '15,000 - 30,000 SAR',
    'contact.form.budget.30k50k': '30,000 - 50,000 SAR',
    'contact.form.budget.over50k': 'Over 50,000 SAR',
    'contact.form.message': 'Project Details',
    'contact.form.message.placeholder': 'Tell us about your project, requirements, timeline, and any specific needs...',
    'contact.form.submit': 'Send Message',
    
    'contact.conversation.title': 'Let\'s Start a Conversation',
    'contact.conversation.desc': 'We\'re here to help you bring your ideas to life. Whether you have a specific project in mind or just want to explore possibilities, we\'d love to hear from you.',
    'contact.expect.title': 'What to expect:',
    'contact.expect.response': 'Response within 24 hours',
    'contact.expect.consultation': 'Free consultation call',
    'contact.expect.proposal': 'Detailed project proposal',
    'contact.expect.pricing': 'Transparent pricing',
    
    'contact.quick.title': 'Quick Response',
    'contact.quick.desc': 'Need immediate assistance? Use our questionnaire system to get started right away.',
    'contact.quick.button': 'Start Project Questionnaire',
    
    // Portfolio page (Arabic)
    'portfolio.hero.title': 'معرض',
    'portfolio.hero.title.highlight': 'أعمالنا',
    'portfolio.hero.subtitle': 'استكشف أعمالنا الحديثة وشاهد كيف ساعدنا الشركات في مختلف الصناعات لتحقيق أهدافها في التصميم والتطوير.',
    'portfolio.hero.start.project': 'ابدأ مشروعك',
    'portfolio.hero.discuss.ideas': 'ناقش أفكارك',
    
    'portfolio.categories.all': 'جميع المشاريع',
    'portfolio.categories.brand': 'الهوية التجارية',
    'portfolio.categories.web': 'تطوير الويب',
    'portfolio.categories.ecommerce': 'التجارة الإلكترونية',
    'portfolio.categories.print': 'تصميم الطباعة',
    'portfolio.categories.healthcare': 'الرعاية الصحية',
    'portfolio.categories.realestate': 'العقارات',
    'portfolio.categories.fashion': 'الأزياء',
    'portfolio.categories.education': 'التعليم',
    
    'portfolio.stats.title': 'نظرة عامة على المعرض',
    'portfolio.stats.projects': 'مشاريع مكتملة',
    'portfolio.stats.clients': 'عملاء راضون',
    'portfolio.stats.industries': 'صناعات خدمناها',
    'portfolio.stats.success': 'معدل النجاح',
    
    'portfolio.modal.duration': 'المدة',
    'portfolio.modal.price': 'الاستثمار',
    'portfolio.modal.year': 'السنة',
    'portfolio.modal.features': 'الميزات الرئيسية',
    'portfolio.modal.tags': 'التقنيات والمهارات',
    'portfolio.modal.view.project': 'عرض المشروع',
    'portfolio.modal.close': 'إغلاق',
    
    'portfolio.cta.title': 'هل أنت مستعد لبدء مشروعك؟',
    'portfolio.cta.subtitle': 'دعنا ننشئ شيئًا مذهلاً معًا. اتصل بنا اليوم لمناقشة متطلبات مشروعك.',
    'portfolio.cta.button': 'ابدأ اليوم',
    
    // Portfolio page additional keys (Arabic)
    'portfolio.stats.projects.count': '500+',
    'portfolio.stats.clients.count': '150+',
    'portfolio.stats.satisfaction.count': '99%',
    'portfolio.stats.support.count': '24/7',
    'portfolio.stats.projects.label': 'مشاريع مكتملة',
    'portfolio.stats.clients.label': 'عملاء راضون',
    'portfolio.stats.satisfaction.label': 'معدل الرضا',
    'portfolio.stats.support.label': 'دعم متاح',
    
    'portfolio.project.view.details': 'عرض التفاصيل',
    'portfolio.project.value': 'قيمة المشروع',
    'portfolio.project.description': 'وصف المشروع',
    'portfolio.project.services': 'الخدمات المتضمنة',
    'portfolio.project.technologies': 'التقنيات والمهارات',
    'portfolio.project.start.similar': 'ابدأ مشروع مشابه',
    'portfolio.project.discuss': 'ناقش المشروع',
    
    'portfolio.final.cta.title': 'هل أنت مستعد لإنشاء شيء مذهل؟',
    'portfolio.final.cta.subtitle': 'دعنا نحقق رؤيتك بخدمات التصميم والتطوير الاحترافية المصممة خصيصًا لاحتياجات عملك.',
    'portfolio.final.cta.start': 'ابدأ مشروعك',
    'portfolio.final.cta.learn': 'تعرف على المزيد عنا',
    
    // Blog page (Arabic)
    'blog.hero.title': 'مدونة',
    'blog.hero.title.highlight': 'تك بارتنر',
    'blog.hero.subtitle': 'رؤى ودروس واتجاهات الصناعة من فريق الخبراء لدينا. ابق مطلعًا على أحدث ما في التصميم والتطوير والتحول الرقمي.',
    'blog.search.placeholder': 'البحث في المقالات والمواضيع والتقنيات...',
    'blog.search.button': 'بحث',
    
    'blog.categories.all': 'جميع المنشورات',
    'blog.categories.brand': 'الهوية التجارية',
    'blog.categories.webdev': 'تطوير الويب',
    'blog.categories.design': 'التصميم',
    'blog.categories.development': 'التطوير',
    'blog.categories.strategy': 'استراتيجية العلامة التجارية',
    'blog.categories.mobile': 'تصميم الجوال',
    'blog.categories.technical': 'تقني',
    'blog.categories.marketing': 'التسويق الرقمي',
    
    'blog.featured.label': 'مقال مميز',
    'blog.post.readmore': 'اقرأ المقال كاملاً',
    'blog.post.readtime': 'دقيقة قراءة',
    'blog.post.by': 'بواسطة',
    'blog.post.close': 'إغلاق',
    'blog.post.share': 'شارك المقال',
    'blog.post.related': 'مقالات ذات صلة',
    
    'blog.stats.title': 'إحصائيات المدونة',
    'blog.stats.articles': 'مقالات منشورة',
    'blog.stats.topics': 'مواضيع مغطاة',
    'blog.stats.readers': 'قراء شهريًا',
    'blog.stats.expertise': 'سنوات من الخبرة',
    
    'blog.cta.title': 'هل أنت مستعد لبدء مشروعك؟',
    'blog.cta.subtitle': 'دع خبرتنا تعمل لصالحك. اتصل بنا اليوم لمناقشة احتياجات التصميم والتطوير الخاصة بك.',
    'blog.cta.button': 'ابدأ الآن',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.services': 'الخدمات',
    'nav.portfolio': 'أعمالنا',
    'nav.blog': 'المدونة',
    'nav.contact': 'اتصل بنا',
    'nav.dashboard': 'لوحة التحكم',
    'nav.categories': 'الفئات',
    'nav.ai-studio': 'استوديو الذكاء الاصطناعي',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.company': 'تك بارتنر',
    'language.switch': 'تغيير اللغة',
    'loading': 'جاري التحميل...',
    'error': 'خطأ',
    'success': 'نجح',
    'ai.assistant': 'مساعد الذكاء الاصطناعي',
    'ai.chat': 'محادثة',
    'ai.code': 'كود',
    'ai.content': 'محتوى',
    'ai.marketing': 'تسويق',
    'ai.thinking': 'جاري التفكير...',
    'ai.placeholder': 'اسألني أي شيء عن تطوير الويب أو التصميم أو التكنولوجيا...',
    
    // Homepage content
    'hero.title': 'تصميم مخصص ليناسب احتياجاتك بشكل مثالي.',
    'hero.subtitle': 'احصل على تصميمات مخصصة تتطابق تماماً مع رؤيتك. من الشعارات إلى المواقع الإلكترونية، مصممونا الخبراء يحولون أفكارك إلى واقع بإبداع ودقة.',
    'hero.cta.primary': 'ابدأ مشروعك',
    'hero.cta.secondary': 'عرض الأعمال',
    
    // Services
    'services.title': 'خدمات التصميم والتطوير',
    'services.subtitle': 'حلول تصميم وتطوير احترافية لكل احتياجات الأعمال',
    'service.logo.title': 'تصميم الشعار والهوية التجارية',
    'service.logo.description': 'إنشاء هوية تجارية لا تُنسى ومميزة',
    'service.web.title': 'تصميم المواقع والتطبيقات',
    'service.web.description': 'تصاميم حديثة ومتجاوبة للتجارب الرقمية',
    'service.business.title': 'الأعمال والإعلان',
    'service.business.description': 'مواد تسويقية احترافية تحقق النتائج',
    'service.art.title': 'الفن والرسوم التوضيحية',
    'service.art.description': 'أعمال فنية ورسوم توضيحية مخصصة لأي مشروع',
    'service.packaging.title': 'التغليف والملصقات',
    'service.packaging.description': 'تغليف المنتجات الذي يجذب ويبيع',
    'service.development.title': 'تطوير المواقع والتطبيقات المخصصة',
    'service.development.description': 'تطوير احترافي مخصص باستخدام حلول تقنية حديثة متكاملة',
    
    // Development section
    'development.title': 'تطوير المواقع المخصصة',
    'development.subtitle': 'حلول تطوير احترافية متكاملة باستخدام التقنيات الحديثة. من المواقع البسيطة إلى تطبيقات الويب المعقدة مع جمع المتطلبات التقنية الكاملة.',
    'development.feature1': 'تصميم واجهات مخصصة',
    'development.feature2': 'تطوير متكامل',
    'development.feature3': 'تكامل أنظمة الإدارة والخلفية',
    'development.feature4': 'تقييم تقني من 8 خطوات',
    'development.cta': 'ابدأ مشروع التطوير',
    'development.pricing': 'ابتداءً من',
    'development.price': '25,000 ريال سعودي',
    
    // Business section
    'business.title.part1': 'عملك',
    'business.title.part2': 'تصميم استثنائي',
    'business.description': 'مجتمع المصممين الموثوق لدينا متخصص في الشعارات والمواقع الإلكترونية وتصميم التغليف والمزيد. لقد ساعدنا آلاف الشركات في الإطلاق والنمو والتوسع وإعادة التسمية بتصميم مخصص واحترافي.',
    'business.feature1': 'مصممون خبراء ذوو سجل حافل مثبت',
    'business.feature2': 'حلول مخصصة مصممة خصيصاً لعلامتك التجارية',
    'business.feature3': 'تسليم سريع مع مراجعات غير محدودة',
    'business.cta': 'ابدأ علامتك التجارية',
    
    // Logo section
    'logo.main.title': 'كل شيء يبدأ بشعار.',
    'logo.main.subtitle': 'سواء كنت تبدأ من جديد أو تحسن علامتك التجارية، حلولنا مصممة خصيصاً لتناسب عملك وترفع من مستوى علامتك التجارية',
    'logo.ai.title': 'جرب صانع الشعارات بالذكاء الاصطناعي',
    'logo.ai.description': 'اصنع شعارك الفريد بسهولة في دقائق قليلة باستخدام أداتنا البديهية المدعومة بالذكاء الاصطناعي. إنها سهلة وتوفر نقطة البداية المثالية أو الإلهام لمصممينا الخبراء لرفع رحلة علامتك التجارية إلى آفاق جديدة.',
    'logo.ai.cta': 'إنشاء شعار، مجاناً',
    'logo.contest.title': 'ابدأ مسابقة شعار.',
    'logo.contest.description': 'ارفع رحلة علامتك التجارية مع مجموعة واسعة من خيارات الشعارات المخصصة من مجتمعنا الموهوب من المستقلين. اختبر التوجيه الإبداعي من المستوى التالي والخبرة المتميزة والحلول المخصصة المصممة خصيصاً لاحتياجات عملك الفريدة.',
    'logo.contest.pricing': 'شعارات من 1500 ريال سعودي',
    
    // Portfolio
    'portfolio.title': 'أبرز أعمالنا',
    'portfolio.subtitle': 'شاهد الأعمال الاستثنائية التي قدمناها للعملاء عبر مختلف الصناعات',
    'portfolio.example1.title': 'الهوية المؤسسية',
    'portfolio.example1.subtitle': 'حزمة علامة تجارية كاملة',
    'portfolio.example1.client': 'شركة تيك سوليوشنز',
    'portfolio.example1.description': 'تصميم شعار وبطاقات أعمال ودليل العلامة التجارية',
    'portfolio.example2.title': 'منصة التجارة الإلكترونية',
    'portfolio.example2.subtitle': 'تصميم موقع كامل',
    'portfolio.example2.client': 'بوتيك فاشن',
    'portfolio.example2.description': 'موقع تجارة إلكترونية عصري بميزات مخصصة',
    'portfolio.example3.title': 'كيت وسائل التواصل الاجتماعي',
    'portfolio.example3.subtitle': 'علامة تجارية كاملة',
    'portfolio.example3.client': 'استوديو العافية',
    'portfolio.example3.description': 'قوالب إنستغرام واتساق العلامة التجارية',
    
    // Testimonials
    'testimonials.title': 'ماذا يقول عملاؤنا',
    'testimonials.subtitle': 'تعليقات حقيقية من عملاء راضين',
    'testimonials.review1.text': '"حزمة هوية تجارية كاملة رائعة. عملية تصميم الشعار من 6 خطوات جعلت كل شيء واضح ومهني."',
    'testimonials.review1.name': 'أحمد سالم',
    'testimonials.review1.title': 'الرئيس التنفيذي، حلول التقنية السعودية',
    'testimonials.review2.text': '"عملية تطوير الويب المخصصة من 8 خطوات كانت شاملة. بنوا بالضبط منصة التجارة الإلكترونية التي احتجناها."',
    'testimonials.review2.name': 'ليلى محمد',
    'testimonials.review2.title': 'مالكة، بوتيك الرياض للأزياء',
    'testimonials.review3.text': '"استبيان المشروع الشامل ساعدهم على فهم احتياجاتنا. تصميمات وسائل التواصل الاجتماعي والطباعة احترافية."',
    'testimonials.review3.name': 'محمد خالد',
    'testimonials.review3.title': 'مدير، استوديو العافية جدة',
    
    // Team section
    'team.badge': 'فريق التطوير الخبير',
    'team.title': 'تعرف على خبراء تيك بارتنر',
    'team.description': 'مطورونا ومصممونا المهرة يجلبون سنوات من الخبرة في إنشاء حلول رقمية متطورة. من تطبيقات الويب المعقدة إلى الهويات التجارية المذهلة، نحن شركاؤك التقنيون المتفانون.',
    'team.feature1.title': 'خبراء معتمدون',
    'team.feature1.description': 'محترفون معتمدون في الصناعة مع سجل حافل مثبت',
    'team.feature2.title': 'تسليم سريع',
    'team.feature2.description': 'أوقات تسليم سريعة دون التنازل عن الجودة',
    'team.feature3.title': 'جودة مضمونة',
    'team.feature3.description': 'عمليات اختبار صارمة ومراقبة الجودة',
    'team.feature4.title': 'تركيز على العميل',
    'team.feature4.description': 'دعم متخصص ونهج خدمة مخصص',
    
    // Process section
    'process.title': 'فئات خدماتنا والعملية',
    'process.subtitle': 'تدفقات استبيان شاملة مصممة لفهم احتياجاتك الدقيقة وتقديم نتائج مثالية',
    'process.logo.step1': 'اختيار الحزمة والتسعير',
    'process.logo.step2': 'اختيار التصميم من المعرض',
    'process.logo.step3': 'تفاصيل ومعلومات العلامة التجارية',
    'process.logo.step4': 'تفضيلات النمط (7 منزلقات)',
    'process.logo.step5': 'اختيار الألوان واللوحة',
    'process.logo.step6': 'المراجعة وتأكيد الطلب',
    'process.logo.cta': 'ابدأ مشروع الشعار',
    
    'process.development.title': 'تطوير الويب المخصص',
    'process.development.subtitle': 'حلول تطوير متكاملة',
    'process.development.badge': 'مميز',
    'process.development.step1': 'معلومات المشروع والأهداف',
    'process.development.step2': 'فكرة المشروع وتفاصيل المفهوم',
    'process.development.step3': 'تفضيلات مجموعة التقنيات',
    'process.development.step4': 'متطلبات الميزات والوظائف',
    'process.development.step5': 'إرشادات التصميم والمراجع',
    'process.development.step6': 'تدفقات المستخدم وتصميم التجربة',
    'process.development.step7': 'تخطيط الميزانية والجدول الزمني',
    'process.development.step8': 'المراجعة والتقييم التقني',
    'process.development.cta': 'ابدأ مشروع التطوير',
    'process.development.pricing': 'ابتداءً من',
    'process.development.price': '25,000 ريال سعودي',
    
    'process.other.title': 'جميع الخدمات الأخرى',
    'process.other.subtitle': 'استقبال مشروع شامل',
    'process.other.step1': 'معلومات المشروع والاتصال',
    'process.other.step2': 'وصف مفصل للمشروع',
    'process.other.step3': 'تقييم الجدول الزمني والإلحاح',
    'process.other.step4': 'تحميل الملفات والمراجع',
    'process.other.service1': 'الأعمال والإعلان',
    'process.other.service2': 'الفن والرسوم التوضيحية',
    'process.other.service3': 'التغليف والملصقات',
    'process.other.service4': 'تصميم وسائل التواصل الاجتماعي',
    'process.other.service5': 'تصميم الطباعة',
    'process.other.cta': 'عرض جميع الفئات',
    
    // Blog section
    'blog.title': 'أحدث المقالات من',
    'blog.title.highlight': 'مدونتنا',
    'blog.subtitle': 'ابق على اطلاع بأحدث الرؤى والدروس واتجاهات الصناعة من فريق خبرائنا',
    'blog.post1.category': 'هوية العلامة التجارية',
    'blog.post1.date': '15 ديسمبر 2024',
    'blog.post1.read': '8 دقائق قراءة',
    'blog.post1.title': 'مستقبل تصميم الشعارات في التحول الرقمي للمملكة العربية السعودية',
    'blog.post1.excerpt': 'استكشف كيف تعيد رؤية السعودية 2030 تشكيل متطلبات هوية العلامة التجارية وما تحتاج الشركات الحديثة لمعرفته حول تصميم الشعارات الفعال.',
    'blog.post1.author': 'أحمد الراشد',
    'blog.post2.category': 'تطوير الويب',
    'blog.post2.date': '10 ديسمبر 2024',
    'blog.post2.read': '6 دقائق قراءة',
    'blog.post2.title': 'اتجاهات تطوير التجارة الإلكترونية للشركات في منطقة الشرق الأوسط وشمال أفريقيا',
    'blog.post2.excerpt': 'اكتشف أحدث تقنيات تطوير الويب وأنماط تجربة المستخدم التي تدفع منصات التجارة الإلكترونية الناجحة في الشرق الأوسط.',
    'blog.post2.author': 'فاطمة الزهراء',
    'blog.post3.category': 'تصميم الهاتف المحمول',
    'blog.post3.date': '15 نوفمبر 2024',
    'blog.post3.read': '9 دقائق قراءة',
    'blog.post3.title': 'استراتيجيات التصميم للهاتف المحمول أولاً في السوق السعودي',
    'blog.post3.excerpt': 'مع تجاوز نسبة انتشار الهواتف المحمولة 95% في السعودية، تعلم كيف تصمم تجارب موجهة نحو المحمول تتفاعل مع المستخدمين المحليين.',
    'blog.post3.author': 'خالد السديري',
    'blog.readmore': 'اقرأ المزيد',
    'blog.viewall': 'عرض جميع مقالات المدونة',
    
    // CTA section
    'cta.title': 'هل أنت مستعد لتحقيق رؤيتك على أرض الواقع؟',
    'cta.subtitle': 'انضم إلى الآلاف من العملاء الراضين الذين حولوا علاماتهم التجارية بخدمات التصميم لدينا.',
    'cta.button': 'ابدأ اليوم',
    
    // Portfolio page additional keys
    'portfolio.stats.projects.count': '500+',
    'portfolio.stats.clients.count': '150+',
    'portfolio.stats.satisfaction.count': '99%',
    'portfolio.stats.support.count': '24/7',
    'portfolio.stats.projects.label': 'مشاريع مكتملة',
    'portfolio.stats.clients.label': 'عملاء راضون',
    'portfolio.stats.satisfaction.label': 'معدل الرضا',
    'portfolio.stats.support.label': 'الدعم متاح',
    
    'portfolio.project.view.details': 'عرض التفاصيل',
    'portfolio.project.value': 'قيمة المشروع',
    'portfolio.project.description': 'وصف المشروع',
    'portfolio.project.services': 'الخدمات المتضمنة',
    'portfolio.project.technologies': 'التقنيات والمهارات',
    'portfolio.project.start.similar': 'بدء مشروع مشابه',
    'portfolio.project.discuss': 'مناقشة المشروع',
    
    'portfolio.final.cta.title': 'هل أنت مستعد لإنشاء شيء مذهل؟',
    'portfolio.final.cta.subtitle': 'دعنا نحول رؤيتك إلى واقع مع خدمات التصميم والتطوير الاحترافية المصممة خصيصًا لاحتياجات عملك.',
    'portfolio.final.cta.start': 'ابدأ مشروعك',
    'portfolio.final.cta.learn': 'تعرف على المزيد عنا',
  },
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations.en);

  useEffect(() => {
    setTranslations(defaultTranslations[language]);
    
    // Set document direction for RTL support
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const isRTL = language === 'ar';

  const t = (key: string, fallback?: string) => {
    return translations[key] || fallback || key;
  };

  const translateText = async (text: string) => {
    // Placeholder for translation logic
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, translations, t, translateText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
