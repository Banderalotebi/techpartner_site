import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

export type Language = 'en' | 'ar';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  translations: Record<string, string>;
  t: (key: string, fallback?: string) => string;
  translateText: (text: string) => Promise<string>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Default English translations (fallback)
const defaultTranslations: Record<string, string> = {
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
  
  // Testimonials
  'testimonials.title': 'What Our Clients Say',
  'testimonials.subtitle': 'Real feedback from satisfied customers',
  
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

// Arabic translations (will be populated from server)
const arabicTranslations: Record<string, string> = {
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
  'success': 'نجاح',
  'ai.assistant': 'المساعد الذكي',
  'ai.chat': 'دردشة',
  'ai.code': 'كود',
  'ai.content': 'محتوى',
  'ai.marketing': 'تسويق',
  'ai.thinking': 'جاري التفكير...',
  'ai.placeholder': 'اسألني أي شيء عن تطوير الويب، التصميم، أو التكنولوجيا...',
  
  // Homepage content
  'hero.title': 'تصميم مخصص يناسب احتياجاتك تماماً.',
  'hero.subtitle': 'احصل على تصاميم مخصصة تتناسب تماماً مع رؤيتك. من الشعارات إلى المواقع، يقوم مصممونا الخبراء بتحويل أفكارك إلى واقع بإبداع ودقة.',
  'hero.cta.primary': 'ابدأ مشروعك',
  'hero.cta.secondary': 'عرض الأعمال',
  
  // Services
  'services.title': 'التصميم والتطوير لدينا',
  'services.subtitle': 'حلول تصميم وتطوير احترافية لكل احتياجات الأعمال',
  'service.logo.title': 'تصميم الشعارات والهوية',
  'service.logo.description': 'أنشئ هوية تجارية لا تُنسى تتميز عن الآخرين',
  'service.web.title': 'تصميم المواقع والتطبيقات',
  'service.web.description': 'تصاميم حديثة متجاوبة للتجارب الرقمية',
  'service.business.title': 'الأعمال والإعلانات',
  'service.business.description': 'مواد تسويقية احترافية تحقق التحويل',
  'service.art.title': 'الفن والرسوم التوضيحية',
  'service.art.description': 'أعمال فنية ورسوم توضيحية مخصصة لأي مشروع',
  'service.packaging.title': 'التغليف والملصقات',
  'service.packaging.description': 'تغليف منتجات يجذب ويبيع',
  'service.development.title': 'تطوير المواقع والتطبيقات المخصصة',
  'service.development.description': 'تطوير مخصص احترافي باستخدام حلول Full Stack الحديثة',
  
  // Development section
  'development.title': 'تطوير الويب المخصص',
  'development.subtitle': 'حلول تطوير Full Stack احترافية باستخدام التقنيات الحديثة. من المواقع البسيطة إلى تطبيقات الويب المعقدة مع جمع المتطلبات التقنية الكاملة.',
  'development.feature1': 'تصميم UI/UX مخصص',
  'development.feature2': 'تطوير Full Stack',
  'development.feature3': 'تكامل CMS والخلفية',
  'development.feature4': 'التقييم التقني بـ 8 خطوات',
  'development.cta': 'ابدأ مشروع التطوير',
  'development.pricing': 'يبدأ من',
  'development.price': '25,000 ريال',
  
  // Business section
  'business.title.part1': 'عملك',
  'business.title.part2': 'تصميم استثنائي',
  'business.description': 'يتخصص مجتمع المصممين الموثوق لدينا في الشعارات والمواقع وتصميم التغليف والمزيد. لقد ساعدنا آلاف الشركات في الإطلاق والنمو والتوسع وإعادة العلامة التجارية بتصميم مخصص واحترافي.',
  'business.feature1': 'مصممون خبراء بسجل حافل من الإنجازات',
  'business.feature2': 'حلول مخصصة مصممة خصيصاً لعلامتك التجارية',
  'business.feature3': 'تسليم سريع مع مراجعات غير محدودة',
  'business.cta': 'ابدأ علامتك التجارية',
  
  // Logo section
  'logo.main.title': 'كل شيء يبدأ بشعار.',
  'logo.main.subtitle': 'سواء كنت تبدأ من جديد أو تحسن علامتك التجارية، فإن حلولنا مصممة خصيصاً لتناسب عملك وترقي بعلامتك التجارية',
  'logo.ai.title': 'جرب صانع الشعارات بالذكاء الاصطناعي',
  'logo.ai.description': 'صمم شعارك الفريد بسهولة في دقائق معدودة باستخدام أداتنا سهلة الاستخدام المدعومة بالذكاء الاصطناعي. إنها سهلة وتوفر نقطة البداية المثالية أو الإلهام لمصممينا الخبراء لترقي برحلتك التجارية إلى آفاق جديدة.',
  'logo.ai.cta': 'أنشئ شعاراً، إنه مجاني',
  'logo.contest.title': 'ابدأ مسابقة شعار.',
  'logo.contest.description': 'ارتقِ برحلتك التجارية مع مجموعة واسعة من خيارات الشعارات المخصصة من مجتمعنا الموهوب من المستقلين. جرب مستوى جديداً من التوجيه الإبداعي والخبرة المتفردة والحلول المخصصة التي تناسب احتياجات عملك الفريدة.',
  'logo.contest.pricing': 'شعارات تبدأ من 1500 ريال',
  
  // Portfolio
  'portfolio.title': 'أبرز أعمالنا',
  'portfolio.subtitle': 'شاهد العمل الاستثنائي الذي قدمناه لعملاء في مختلف الصناعات',
  
  // Testimonials
  'testimonials.title': 'ماذا يقول عملاؤنا',
  'testimonials.subtitle': 'تعليقات حقيقية من عملاء راضين',
  
  // Team section
  'team.badge': 'فريق التطوير الخبير',
  'team.title': 'تعرف على خبراء تك بارتنر',
  'team.description': 'يجلب مطورونا ومصممونا المهرة سنوات من الخبرة في إنشاء حلول رقمية متطورة. من تطبيقات الويب المعقدة إلى الهويات التجارية المذهلة، نحن شركاؤك التقنيون المخلصون.',
  
  // Auth
  'auth.login': 'تسجيل الدخول',
  'auth.logout': 'تسجيل الخروج',
  'auth.register': 'إنشاء حساب',
  'auth.email': 'البريد الإلكتروني',
  'auth.password': 'كلمة المرور',
  'auth.forgotPassword': 'نسيت كلمة المرور؟',
  'auth.noAccount': 'ليس لديك حساب؟',
  'auth.hasAccount': 'لديك حساب بالفعل؟',
  
  // Profile
  'profile.edit': 'تعديل الملف الشخصي',
  'profile.save': 'حفظ التغييرات',
  'profile.cancel': 'إلغاء',
  'profile.firstName': 'الاسم الأول',
  'profile.lastName': 'الاسم الأخير',
  'profile.phone': 'الهاتف',
  'profile.address': 'العنوان',
  
  // Orders
  'orders.title': 'طلباتي',
  'orders.history': 'سجل الطلبات',
  'orders.noOrders': 'لا توجد طلبات بعد',
  'orders.status.pending': 'قيد الانتظار',
  'orders.status.completed': 'مكتمل',
  'orders.status.cancelled': 'ملغى',
  
  // Stats
  'stats.projects': 'مشاريع منجزة',
  'stats.clients': 'عملاء سعداء',
  'stats.rating': 'معدل الرضا',
  
  // CTA section
  'cta.title': 'هل أنت مستعد لتحقيق رؤيتك على أرض الواقع؟',
  'cta.subtitle': 'انضم إلى الآلاف من العملاء الراضين الذين حولوا علاماتهم التجارية بخدمات التصميم لدينا.',
  'cta.button': 'ابدأ اليوم',
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch translations from server
  const fetchTranslations = useCallback(async (lang: Language) => {
    if (lang === 'en') {
      setTranslations(defaultTranslations);
      return;
    }

    setIsLoading(true);
    try {
      // Try to fetch from server
      const response = await axios.get(`/api/i18n/translations/${lang}`);
      if (response.data && response.data.translations) {
        setTranslations(response.data.translations);
      } else {
        // Fallback to local Arabic translations
        setTranslations(arabicTranslations);
      }
    } catch (error) {
      console.warn('[LanguageContext] Failed to fetch translations, using local:', error);
      // Fallback to local Arabic translations
      setTranslations(arabicTranslations);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set language and fetch translations
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    fetchTranslations(lang);
  }, [fetchTranslations]);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
      fetchTranslations(savedLanguage);
    }
  }, [fetchTranslations]);

  // Set document direction for RTL support
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const isRTL = language === 'ar';

  const t = useCallback((key: string, fallback?: string) => {
    return translations[key] || fallback || key;
  }, [translations]);

  const translateText = useCallback(async (text: string): Promise<string> => {
    if (language === 'en') return text;
    
    try {
      const response = await axios.post('/api/i18n/translate', {
        text,
        sourceLang: 'en',
        targetLang: language
      });
      return response.data.translated || text;
    } catch (error) {
      console.warn('[LanguageContext] Translation failed:', error);
      return text;
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      isRTL, 
      translations, 
      t, 
      translateText,
      isLoading 
    }}>
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
