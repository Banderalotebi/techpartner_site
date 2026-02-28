import { Route, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Award, Clock, Star, MessageCircle } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import AnimatedCounter from "@/components/AnimatedCounter";
import LoadingSpinner, { ServiceCardSkeleton } from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@assets/image_1751882806746_2.png";
import techPartnerDeveloper from "@assets/19362653-[Converted].png";
import logoDesignImage from "@assets/logo-and-branding-design.png";
import webDesignImage from "@assets/web-and-app-design.png";
import businessAdvertisingImage from "@assets/business-and-advertising.png";
import artIllustrationImage from "@assets/art-and-illustration.png";
import packagingImage from "@assets/packaging.png";
import startBrandImage from "@assets/logo-and-branding-design.png";
import fullStackImage from "@assets/web-and-app-design.png";
import packagingLabelImage from "@assets/packaging.png";

const HeroSVG = () => (
  <svg width="605" height="428" viewBox="0 0 605 428" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-lg">
    <path d="M15.026 5.215C19.688 5.215 23.762 6.118 27.248 7.924C30.776 9.688 33.485 12.25 35.375 15.61C37.307 18.928 38.273 22.813 38.273 27.265C38.273 31.717 37.307 35.581 35.375 38.857C33.485 42.133 30.776 44.653 27.248 46.417C23.762 48.139 19.688 49 15.026 49H0.725V5.215H15.026ZM15.026 43.141C20.15 43.141 24.077 41.755 26.807 38.983C29.537 36.211 30.902 32.305 30.902 27.265C30.902 22.183 29.537 18.214 26.807 15.358C24.077 12.502 20.15 11.074 15.026 11.074H7.907V43.141H15.026Z" fill="#1F2937"/>
  </svg>
);

const services = [
  {
    id: 1,
    titleKey: "service.logo.title",
    title: "Logo & branding design",
    image: logoDesignImage,
    descriptionKey: "service.logo.description",
    description: "Create a memorable brand identity that stands out"
  },
  {
    id: 2,
    titleKey: "service.web.title",
    title: "Website & app design",
    image: webDesignImage,
    descriptionKey: "service.web.description",
    description: "Modern, responsive designs for digital experiences"
  },
  {
    id: 3,
    titleKey: "service.business.title",
    title: "Business & advertising",
    image: businessAdvertisingImage,
    descriptionKey: "service.business.description",
    description: "Professional marketing materials that convert"
  },
  {
    id: 4,
    titleKey: "service.art.title",
    title: "Art & illustration",
    image: artIllustrationImage,
    descriptionKey: "service.art.description",
    description: "Custom artwork and illustrations for any project"
  },
  {
    id: 5,
    titleKey: "service.packaging.title",
    title: "Packaging & label",
    image: packagingLabelImage,
    descriptionKey: "service.packaging.description",
    description: "Product packaging that attracts and sells"
  },
  {
    id: 6,
    titleKey: "service.development.title",
    title: "Custom web and apps development",
    image: fullStackImage,
    descriptionKey: "service.development.description",
    description: "Professional custom development using modern full stack solutions"
  }
];

export default function Home() {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            <div className="relative flex-shrink-0">
              <img 
                src={heroImage} 
                alt="Design showcase" 
                className="w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] 2xl:w-[32rem] h-auto rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl"
              />
              <div className="absolute -top-3 -right-3 lg:-top-6 lg:-right-6 opacity-15 hidden lg:block">
                <HeroSVG />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  {t('hero.title', 'Design personalized to fit your needs perfectly.')}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {t('hero.subtitle', 'Get custom designs that perfectly match your vision. From logos to websites, our expert designers bring your ideas to life with creativity and precision.')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
                <Link to="/categories">
                  <Button size="sm" className="bg-[#01A1C1] hover:bg-[#0891B2] text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg w-full sm:w-auto">
                    {t('hero.cta.primary', 'Start Your Project')}
                    <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </Button>
                </Link>
                <Link to="/portfolio">
                  <Button variant="outline" size="sm" className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg border-gray-300 w-full sm:w-auto">
                    {t('hero.cta.secondary', 'View Portfolio')}
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="sm" className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg border-[#01A1C1] text-[#01A1C1] hover:bg-[#01A1C1] hover:text-white w-full sm:w-auto">
                    {t('nav.blog', 'Read Blog')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('services.title', 'Our Design and Development')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('services.subtitle', 'Professional design and development solutions for every business need')}
            </p>
          </div>

          {/* Custom Development Section */}
          <div className="mb-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">{t('development.title', 'Custom Web Development')}</h3>
                <p className="text-blue-100 mb-6 text-lg">
                  {t('development.subtitle', 'Professional full-stack development solutions using modern technologies. From simple websites to complex web applications with complete technical requirements gathering.')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    <span>{t('development.feature1', 'Custom UI/UX Design')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    <span>{t('development.feature2', 'Full-Stack Development')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    <span>{t('development.feature3', 'CMS Integration & Backend')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    <span>{t('development.feature4', '8-Step Technical Assessment')}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Link to="/categories/web-development">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                      {t('development.cta', 'Start Development Project')}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <div className="text-sm text-blue-100">
                    {t('development.pricing', 'Starting from')} <span className="font-bold text-white">{t('development.price', '25,000 SAR')}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src={fullStackImage} 
                  alt="Custom Web Development" 
                  className="rounded-lg shadow-xl max-w-sm w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {services.map((service) => {
              const getServiceRoute = (serviceId: number) => {
                switch (serviceId) {
                  case 1: return "/categories/logo-and-identity";
                  case 2: return "/categories/web-and-app-design";
                  case 3: return "/categories/business-advertising";
                  case 4: return "/categories/art-illustration";
                  case 5: return "/categories/packaging-label";
                  case 6: return "/categories/web-development";
                  default: return "/categories";
                }
              };

              return (
                <Link key={service.id} to={getServiceRoute(service.id)}>
                  <div className="group cursor-pointer">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#01A1C1]/20">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#01A1C1] transition-colors">
                          {t(service.titleKey, service.title)}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {t(service.descriptionKey, service.description)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Your Business Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {t('business.title.line1', 'Your business')},<br />
                <span className="text-[#01A1C1]">{t('business.title.line2', 'exceptional design')}.</span>
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('business.description', 'Our trusted designer community specializes in logos, websites, packaging design, and more. We\'ve assisted thousands of businesses in launching, growing, expanding, and rebranding with custom, professional design.')}
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#01A1C1] rounded-full"></div>
                  <span className="text-gray-700">{t('business.feature1', 'Expert designers with proven track records')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#01A1C1] rounded-full"></div>
                  <span className="text-gray-700">{t('business.feature2', 'Custom solutions tailored to your brand')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#01A1C1] rounded-full"></div>
                  <span className="text-gray-700">{t('business.feature3', 'Fast turnaround with unlimited revisions')}</span>
                </div>
              </div>

              <Link to="/categories">
                <Button size="lg" className="bg-[#01A1C1] hover:bg-[#0891B2] text-white px-8 py-4 text-lg mt-6">
                  {t('business.cta', 'Start Your Brand')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={startBrandImage} 
                  alt={t('business.image.alt', 'Start your brand')} 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#01A1C1]/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-200/30 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything Begins with a Logo Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-medium text-[#313030] mb-6">
              {t('logo.section.title', 'Everything begins with a logo.')}
            </h2>
            <p className="text-lg text-black max-w-4xl mx-auto leading-relaxed">
              {t('logo.section.subtitle', 'Whether you\'re starting fresh or refining your brand, our solutions are tailored to suit your business and elevate your branding')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
            {/* AI Logo Maker */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-8 mb-6">
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-6xl">🤖</div>
                </div>
              </div>
              <h3 className="text-2xl font-medium text-black mb-4">
                {t('logo.ai.title', 'Try Our AI Logo Maker')}
              </h3>
              <p className="text-[#313030] mb-6 leading-relaxed">
                {t('logo.ai.description', 'Easily craft your unique logo in just minutes with our intuitive, AI-powered tool. It\'s effortless and provides the ideal starting point or inspiration for our expert designers to elevate your branding journey to new heights.')}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg font-medium text-black">
                  {t('logo.ai.cta', 'Create a logo, it\'s free')}
                </span>
                <ArrowRight className="w-6 h-6 text-black" />
              </div>
            </div>

            {/* Logo Contest */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-8 mb-6">
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-6xl">🎨</div>
                </div>
              </div>
              <h3 className="text-2xl font-medium text-black mb-4">
                {t('logo.contest.title', 'Start a logo contest.')}
              </h3>
              <p className="text-[#313030] mb-6 leading-relaxed">
                {t('logo.contest.description', 'Elevate your branding journey with a wide array of custom logo options from our talented community of freelancers. Experience next-level creative direction, unmatched expertise, and personalized solutions tailored to your unique business needs.')}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg font-medium text-black">
                  {t('logo.contest.price', 'Logos from SAR1500')}
                </span>
                <ArrowRight className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('portfolio.title', 'Portfolio Highlights')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('portfolio.subtitle', 'See the exceptional work we\'ve delivered for clients across various industries')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-4">🏢</div>
                    <h3 className="text-xl font-bold">{t('portfolio.item1.title', 'Corporate Identity')}</h3>
                    <p className="text-blue-100">{t('portfolio.item1.subtitle', 'Complete brand package')}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('portfolio.item1.client', 'Tech Solutions Inc.')}</h4>
                  <p className="text-gray-600 text-sm">{t('portfolio.item1.description', 'Logo design, business cards, and brand guidelines')}</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-green-500 to-teal-600 p-8 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-4">🛍️</div>
                    <h3 className="text-xl font-bold">{t('portfolio.item2.title', 'E-commerce Platform')}</h3>
                    <p className="text-green-100">{t('portfolio.item2.subtitle', 'Full website design')}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('portfolio.item2.client', 'Boutique Fashion')}</h4>
                  <p className="text-gray-600 text-sm">{t('portfolio.item2.description', 'Modern e-commerce website with custom features')}</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-orange-500 to-red-600 p-8 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-4">📱</div>
                    <h3 className="text-xl font-bold">{t('portfolio.item3.title', 'Social Media Kit')}</h3>
                    <p className="text-orange-100">{t('portfolio.item3.subtitle', 'Complete branding')}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('portfolio.item3.client', 'Wellness Studio')}</h4>
                  <p className="text-gray-600 text-sm">{t('portfolio.item3.description', 'Instagram templates and brand consistency')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-gray-50 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('testimonials.title', 'What Our Clients Say')}</h3>
              <p className="text-gray-600">{t('testimonials.subtitle', 'Real feedback from satisfied customers')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{t('testimonial.1.text', 'Outstanding complete brand identity package. The 6-step logo design process made everything clear and professional.')}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    AS
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{t('testimonial.1.name', 'Ahmed Salem')}</div>
                    <div className="text-gray-600 text-sm">{t('testimonial.1.role', 'CEO, Saudi Tech Solutions')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{t('testimonial.2.text', 'The 8-step custom web development process was thorough. They built exactly the e-commerce platform we needed.')}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    LM
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{t('testimonial.2.name', 'Layla Mohammed')}</div>
                    <div className="text-gray-600 text-sm">{t('testimonial.2.role', 'Owner, Riyadh Fashion Boutique')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{t('testimonial.3.text', 'Comprehensive project questionnaire helped them understand our needs. Professional social media and print designs.')}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    MK
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{t('testimonial.3.name', 'Mohammed Khalid')}</div>
                    <div className="text-gray-600 text-sm">{t('testimonial.3.role', 'Director, Wellness Studio Jeddah')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TechPartner Expert Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 relative overflow-hidden">
                <img 
                  src={techPartnerDeveloper} 
                  alt={t('team.image.alt', 'TechPartner Expert Developer')} 
                  className="w-full h-auto relative z-10"
                />
                <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg p-3 animate-bounce">
                  <div className="w-6 h-6 bg-[#01A1C1] rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">TP</span>
                  </div>
                </div>
                <div className="absolute top-8 right-8 bg-white shadow-lg rounded-lg p-3 animate-pulse">
                  <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">⚡</span>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 bg-white shadow-lg rounded-lg p-3 animate-bounce delay-300">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-[#01A1C1]/10 rounded-full text-sm font-medium text-[#01A1C1] mb-4">
                  <Users className="mr-2" size={16} />
                  {t('team.badge', 'Expert Development Team')}
                </div>
                
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t('team.title.line1', 'Meet Your')}
                  <span className="block text-[#01A1C1]">{t('team.title.line2', 'TechPartner Experts')}</span>
                </h2>
                
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t('team.description', 'Our skilled developers and designers bring years of experience in creating cutting-edge digital solutions. From complex web applications to stunning brand identities, we\'re your dedicated technology partners.')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('team.feature1.title', 'Certified Experts')}</h3>
                    <p className="text-gray-600 text-sm">{t('team.feature1.description', 'Industry-certified professionals with proven track records')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('team.feature2.title', 'Fast Delivery')}</h3>
                    <p className="text-gray-600 text-sm">{t('team.feature2.description', 'Quick turnaround times without compromising quality')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('team.feature3.title', 'Quality Assured')}</h3>
                    <p className="text-gray-600 text-sm">{t('team.feature3.description', 'Rigorous testing and quality control processes')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#01A1C1]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="text-[#01A1C1]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('team.feature4.title', 'Client Focused')}</h3>
                    <p className="text-gray-600 text-sm">{t('team.feature4.description', 'Dedicated support and personalized service approach')}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 py-8 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-[#01A1C1] mb-2">
                    <AnimatedCounter end={500} duration={2000} />+
                  </div>
                  <div className="text-sm text-gray-600">{t('team.stat1', 'Projects Delivered')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-[#01A1C1] mb-2">
                    <AnimatedCounter end={150} duration={2000} />+
                  </div>
                  <div className="text-sm text-gray-600">{t('team.stat2', 'Happy Clients')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-[#01A1C1] mb-2">
                    <AnimatedCounter end={99} duration={2000} />%
                  </div>
                  <div className="text-sm text-gray-600">{t('team.stat3', 'Satisfaction Rate')}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/categories">
                  <Button size="lg" className="bg-[#01A1C1] hover:bg-[#0189A8] text-white font-semibold px-8 py-4 text-lg w-full sm:w-auto">
                    {t('team.cta.primary', 'Start Your Project')}
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="border-[#01A1C1] text-[#01A1C1] hover:bg-[#01A1C1] hover:text-white font-semibold px-8 py-4 text-lg w-full sm:w-auto">
                    {t('team.cta.secondary', 'Meet Our Team')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories & Questionnaire Steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('process.title', 'Our Service Categories & Process')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('process.subtitle', 'Comprehensive questionnaire flows designed to understand your exact needs and deliver perfect results')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Logo & Identity - 6 Steps */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('process.logo.title', 'Logo & Identity')}</h3>
                <p className="text-gray-600">{t('process.logo.subtitle', 'Complete brand identity design')}</p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                  {t('process.logo.step1', 'Package Selection & Pricing')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                  {t('process.logo.step2', 'Design Selection from Gallery')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                  {t('process.logo.step3', 'Brand Details & Information')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
                  {t('process.logo.step4', 'Style Preferences (7 Sliders)')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">5</div>
                  {t('process.logo.step5', 'Color Selection & Palette')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">6</div>
                  {t('process.logo.step6', 'Review & Order Confirmation')}
                </div>
              </div>
              
              <Link to="/categories/logo-and-identity">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {t('process.logo.cta', 'Start Logo Project')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Custom Web Development - 8 Steps */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('process.dev.title', 'Custom Web Development')}</h3>
                <p className="text-gray-600">{t('process.dev.subtitle', 'Full-stack development solutions')}</p>
                <div className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full mt-2">
                  {t('process.dev.featured', 'FEATURED')}
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                  {t('process.dev.step1', 'Project Information & Goals')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                  {t('process.dev.step2', 'Project Idea & Concept Details')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                  {t('process.dev.step3', 'Technology Stack Preferences')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
                  {t('process.dev.step4', 'Features & Functionality Requirements')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">5</div>
                  {t('process.dev.step5', 'Design Guidelines & References')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">6</div>
                  {t('process.dev.step6', 'User Flows & Experience Design')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">7</div>
                  {t('process.dev.step7', 'Budget & Timeline Planning')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">8</div>
                  {t('process.dev.step8', 'Review & Technical Assessment')}
                </div>
              </div>
              
              <Link to="/categories/web-development">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  {t('process.dev.cta', 'Start Development Project')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <div className="text-center mt-3 text-sm text-gray-600">
                {t('process.dev.pricing', 'Starting from')} <span className="font-bold text-purple-600">25,000 SAR</span>
              </div>
            </div>

            {/* Other Categories - General Process */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('process.other.title', 'All Other Services')}</h3>
                <p className="text-gray-600">{t('process.other.subtitle', 'Comprehensive project intake')}</p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                  {t('process.other.step1', 'Project Information & Contact')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                  {t('process.other.step2', 'Detailed Project Description')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                  {t('process.other.step3', 'Timeline & Urgency Assessment')}
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
                  {t('process.other.step4', 'File Uploads & References')}
                </div>
              </div>
              
              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <div>• {t('service.business.title', 'Business & Advertising')}</div>
                <div>• {t('service.art.title', 'Art & Illustration')}</div>
                <div>• {t('service.packaging.title', 'Packaging & Labels')}</div>
                <div>• {t('service.social.title', 'Social Media Design')}</div>
                <div>• {t('service.print.title', 'Print Design')}</div>
              </div>
              
              <Link to="/categories">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  {t('process.other.cta', 'View All Categories')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('blog.section.title', 'Latest from Our')} <span className="text-[#01A1C1]">{t('blog.section.highlight', 'Blog')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('blog.section.subtitle', 'Stay updated with the latest insights, tutorials, and industry trends from our expert team')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Featured Blog Post 1 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center relative">
                <div className="text-4xl mb-4 text-white">🎨</div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-medium text-white">{t('blog.post1.category', 'Brand Identity')}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                  <span>{t('blog.post1.date', 'Dec 15, 2024')}</span>
                  <span>{t('blog.post1.readTime', '8 min read')}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#01A1C1] transition-colors leading-tight">
                  {t('blog.post1.title', 'The Future of Logo Design in Saudi Arabia\'s Digital Transformation')}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {t('blog.post1.excerpt', 'Explore how Saudi Vision 2030 is reshaping brand identity requirements and what modern businesses need to know about effective logo design.')}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-[#01A1C1] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      AA
                    </div>
                    <span>{t('blog.post1.author', 'Ahmed Al-Rashid')}</span>
                  </div>
                  
                  <Link to="/blog">
                    <Button variant="outline" size="sm" className="group-hover:bg-[#01A1C1] group-hover:text-white group-hover:border-[#01A1C1] transition-colors">
                      {t('blog.readMore', 'Read More')}
                      <ArrowRight className="ml-1" size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>

            {/* Featured Blog Post 2 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 p-8 text-center relative">
                <div className="text-4xl mb-4 text-white">💻</div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-medium text-white">{t('blog.post2.category', 'Web Development')}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                  <span>{t('blog.post2.date', 'Dec 10, 2024')}</span>
                  <span>{t('blog.post2.readTime', '6 min read')}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#01A1C1] transition-colors leading-tight">
                  {t('blog.post2.title', 'E-commerce Web Development Trends for MENA Businesses')}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {t('blog.post2.excerpt', 'Discover the latest web development technologies and user experience patterns that drive successful e-commerce platforms in the Middle East.')}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-[#01A1C1] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      FA
                    </div>
                    <span>{t('blog.post2.author', 'Fatima Al-Zahra')}</span>
                  </div>
                  
                  <Link to="/blog">
                    <Button variant="outline" size="sm" className="group-hover:bg-[#01A1C1] group-hover:text-white group-hover:border-[#01A1C1] transition-colors">
                      {t('blog.readMore', 'Read More')}
                      <ArrowRight className="ml-1" size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>

            {/* Featured Blog Post 3 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-center relative">
                <div className="text-4xl mb-4 text-white">📱</div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-medium text-white">{t('blog.post3.category', 'Mobile Design')}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                  <span>{t('blog.post3.date', 'Nov 15, 2024')}</span>
                  <span>{t('blog.post3.readTime', '9 min read')}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#01A1C1] transition-colors leading-tight">
                  {t('blog.post3.title', 'Mobile-First Design Strategies for Saudi Market')}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {t('blog.post3.excerpt', 'With over 95% mobile penetration in Saudi Arabia, learn how to design mobile-first experiences that resonate with local users.')}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-[#01A1C1] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      KS
                    </div>
                    <span>{t('blog.post3.author', 'Khalid Al-Sudairi')}</span>
                  </div>
                  
                  <Link to="/blog">
                    <Button variant="outline" size="sm" className="group-hover:bg-[#01A1C1] group-hover:text-white group-hover:border-[#01A1C1] transition-colors">
                      {t('blog.readMore', 'Read More')}
                      <ArrowRight className="ml-1" size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          </div>

          <div className="text-center">
            <Link to="/blog">
              <Button size="lg" className="bg-[#01A1C1] hover:bg-[#0189A8] text-white px-8 py-4 text-lg">
                {t('blog.viewAll', 'View All Blog Posts')}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Chat with Agent Section */}
      <section className="py-20 bg-gradient-to-br from-[#01A1C1]/10 to-purple-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-[#01A1C1]/20 rounded-full text-sm font-medium text-[#01A1C1]">
                <MessageCircle className="mr-2" size={16} />
                {t('chat.badge', 'AI-Powered Support')}
              </div>
              
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                {t('chat.title.line1', 'Chat with Our')}
                <span className="block text-[#01A1C1]">{t('chat.title.line2', 'AI Agent')}</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('chat.description', 'Get instant answers about our services, pricing, and project ideas. Our AI assistant is available 24/7 to help you start your project journey.')}
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#01A1C1] rounded-full"></div>
                  <span className="text-gray-700">{t('chat.feature1', 'Instant responses to your questions')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#01A1C1] rounded-full"></div>
                  <span className="text-gray-700">{t('chat.feature2', 'Personalized project recommendations')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#01A1C1] rounded-full"></div>
                  <span className="text-gray-700">{t('chat.feature3', 'Get custom quotes in minutes')}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{t('chat.status', 'AI Agent Online')}</span>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
                <div className="bg-[#01A1C1] text-white p-4 rounded-xl mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">TechPartner AI</h3>
                    <p className="text-xs opacity-80">Online & Ready to help</p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none text-sm text-gray-800">
                    {t('chat.demo.message1', 'Hi! I\'m the TechPartner AI. How can I help you grow your business today?')}
                  </div>
                  <div className="bg-[#01A1C1] text-white p-3 rounded-lg rounded-br-none text-sm self-end ml-8">
                    {t('chat.demo.message2', 'I need a logo for my new restaurant')}
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none text-sm text-gray-800">
                    {t('chat.demo.message3', 'Great! I can help you create a stunning logo. What type of cuisine does your restaurant serve?')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-400">
                    {t('chat.demo.placeholder', 'Type your message...')}
                  </div>
                  <div className="w-8 h-8 bg-[#01A1C1] rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4">
                  {t('chat.demo.note', 'Click the chat button in the corner to start chatting!')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t('cta.title', 'Ready to bring your vision to life?')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('cta.subtitle', 'Join thousands of satisfied clients who\'ve transformed their brands with our design services.')}
          </p>
          <Link to="/categories">
            <Button size="lg" className="bg-[#01A1C1] hover:bg-[#0891B2] text-white px-8 py-4 text-lg">
              {t('cta.button', 'Get Started Today')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <AiChatWidget />
    </div>
  );
}
