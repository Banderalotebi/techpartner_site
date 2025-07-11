import { useState } from "react";
import { useLocation } from "wouter";

import ProjectQuestionnaireModal from "@/components/ProjectQuestionnaireModal";
import BrandQuizModal from "@/components/BrandQuizModal";
import OrderModal from "@/components/OrderModal";
import { WebDesignQuestionnaireModal } from "@/components/WebDesignQuestionnaireModal";
import { WebDevelopmentQuestionnaireModal } from "@/components/WebDevelopmentQuestionnaireModal";
import type { ServicePackage } from "@shared/schema";

// Web & App Design specific service packages matching Figma design
const websiteBuilderServices = [
  {
    id: 11,
    title: "Website Builders",
    subtitle: "Easily bring your website online so you can stay focused on running your business",
    price: "4500",
    currency: "SAR",
    icon: "🌐",
    category: "Website Builder"
  },
  {
    id: 12,
    title: "Web page design",
    subtitle: "Engaging custom web design and commerce platform",
    price: "3200",
    currency: "SAR",
    icon: "💻",
    category: "Custom Design"
  }
];

const webDesignServices = [
  {
    id: 13,
    title: "Website Redesign",
    description: "A refreshed website to make innovative and move faster",
    price: "5500",
    currency: "SAR",
    icon: "🔄",
    category: "Redesign"
  },
  {
    id: 14,
    title: "Blog",
    description: "Custom blog design to keep them reading",
    price: "2800",
    currency: "SAR",
    icon: "📝",
    category: "Content Platform"
  },
  {
    id: 15,
    title: "WordPress theme design",
    description: "A custom WordPress theme that does everything you need to launch your business",
    price: "4200",
    currency: "SAR",
    icon: "🎨",
    category: "WordPress"
  },
  {
    id: 16,
    title: "Landing page design",
    description: "Single page that gets your visitors to click",
    price: "2500",
    currency: "SAR",
    icon: "📄",
    category: "Landing Page"
  },
  {
    id: 17,
    title: "Icons or button design",
    description: "Professionally designed custom icons and functions for web & app",
    price: "800",
    currency: "SAR",
    icon: "🔲",
    category: "UI Elements"
  },
  {
    id: 18,
    title: "App icon",
    description: "A stunning app icon to complement your project and app store downloads",
    price: "1200",
    currency: "SAR",
    icon: "📱",
    category: "Mobile"
  }
];

const additionalWebServices = [
  {
    id: 19,
    title: "Website icon",
    description: "A website icon that users will recognize",
    price: "600",
    currency: "SAR",
    icon: "🏠"
  },
  {
    id: 20,
    title: "Form",
    description: "Form customized to collect the data you need",
    price: "900",
    currency: "SAR",
    icon: "📋"
  },
  {
    id: 21,
    title: "App design",
    description: "A user-friendly app that gets downloaded",
    price: "8500",
    currency: "SAR",
    icon: "📲"
  },
  {
    id: 22,
    title: "iOS app",
    description: "An iOS app design meant for the App Store of your era",
    price: "9500",
    currency: "SAR",
    icon: "🍎"
  },
  {
    id: 23,
    title: "Android App",
    description: "An app that looks great on any Android device",
    price: "8800",
    currency: "SAR",
    icon: "🤖"
  },
  {
    id: 24,
    title: "Facebook cover",
    description: "A professional social cover that represents your social media to have the look they expect",
    price: "450",
    currency: "SAR",
    icon: "📘"
  },
  {
    id: 25,
    title: "Social media page",
    description: "Social media background designs and cover pages for your followers",
    price: "750",
    currency: "SAR",
    icon: "📱"
  },
  {
    id: 26,
    title: "Twitter",
    description: "A Twitter header that complements your tweets",
    price: "400",
    currency: "SAR",
    icon: "🐦"
  }
];

// Custom Web Development Packages
const customWebDevelopmentPackages = [
  {
    id: 101,
    title: "Starter Site - Custom Development",
    subtitle: "Perfect for small businesses and startups with custom UI design",
    price: "25000",
    currency: "SAR",
    icon: "🚀",
    category: "Development Package",
    features: ["Custom UI design (Figma/Adobe XD)", "5 static pages", "Mobile responsive", "Contact form", "Hosting setup"]
  },
  {
    id: 102,
    title: "Business Pro - Full Development", 
    subtitle: "Comprehensive solution for growing companies with CMS integration",
    price: "35000",
    currency: "SAR",
    icon: "💼",
    category: "Development Package",
    features: ["Everything in Starter", "Up to 10 pages", "CMS integration", "Admin dashboard", "SEO optimization", "Custom animations"]
  },
  {
    id: 103,
    title: "Premium Build - Enterprise Solution",
    subtitle: "Advanced full-stack development for complex business requirements", 
    price: "45000",
    currency: "SAR",
    icon: "⭐",
    category: "Development Package",
    features: ["Everything in Business Pro", "Full-stack web app", "Custom backend", "Authentication", "Multi-language", "API integration"]
  }
];

export default function WebAppDesignPage() {
  const [location] = useLocation();
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isWebDesignQuestionnaireOpen, setIsWebDesignQuestionnaireOpen] = useState(false);
  const [isWebDevelopmentQuestionnaireOpen, setIsWebDevelopmentQuestionnaireOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  // Determine if this is a web development page
  const isWebDevelopment = location.includes('/web-development');

  const handlePackageSelect = (service: any) => {
    // Convert service to ServicePackage format
    const servicePackage: ServicePackage = {
      id: service.id,
      categoryId: 2, // Web & App Design category
      name: service.title,
      slug: service.title.toLowerCase().replace(/\s+/g, '-'),
      description: service.description || service.subtitle,
      price: parseInt(service.price),
      features: [],
      isPopular: service.id === 11 // Make Website Builders popular
    };
    
    setSelectedPackage(servicePackage);

    // Route to appropriate questionnaire based on current page and service type
    if (isWebDevelopment) {
      setIsWebDevelopmentQuestionnaireOpen(true);
    } else if (service.category === 'Development Package' || service.title.toLowerCase().includes('development')) {
      setIsWebDevelopmentQuestionnaireOpen(true);
    } else {
      setIsWebDesignQuestionnaireOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Home</span>
            <span>/</span>
            <span>categories</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            {isWebDevelopment ? 'Custom Web Development' : 'Web & App Design Services'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isWebDevelopment 
              ? 'Professional full-stack web development solutions using modern technologies'
              : 'Professional web design, app development, and digital solutions for your business'
            }
          </p>
        </div>

        {/* Website Builders Section - Show only for Web Design, not Web Development */}
        {!isWebDevelopment && (
          <>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-black mb-8 text-center">
                Website Builders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {websiteBuilderServices.map((service) => (
                  <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow text-center">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-2xl font-bold text-black mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.subtitle}
                    </p>
                    <div className="text-2xl font-bold text-primary mb-6">
                      {service.price} {service.currency}
                    </div>
                    <button 
                      onClick={() => handlePackageSelect(service)}
                      className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Order Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-300 mb-16"></div>
          </>
        )}

        {/* Custom Web Development Packages */}
        {isWebDevelopment && (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-2 text-center">
                Custom Web Development Packages
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Professional full-stack development solutions tailored to your business needs
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {customWebDevelopmentPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:shadow-xl transition-all duration-300 hover:border-[#01A1C1] relative">
                    {pkg.id === 102 && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-[#01A1C1] text-white px-4 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-4xl mb-4">{pkg.icon}</div>
                      <h3 className="text-2xl font-bold text-black mb-3">{pkg.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {pkg.subtitle}
                      </p>
                      <div className="text-3xl font-bold text-[#01A1C1] mb-6">
                        {pkg.price} {pkg.currency}
                      </div>
                      
                      <ul className="text-left space-y-2 mb-6 text-sm">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2 mt-1">✓</span>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <button 
                        onClick={() => handlePackageSelect(pkg)}
                        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                          pkg.id === 102 
                            ? 'bg-[#01A1C1] text-white hover:bg-[#01A1C1]/90' 
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        Start Development Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-300 mb-16"></div>
          </>
        )}

        {/* Web Design Services Grid - Show only for Web Design, not Web Development */}
        {!isWebDevelopment && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {webDesignServices.map((service) => (
            <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl mb-3">{service.icon}</div>
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
                  {service.price} {service.currency}
                </div>
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
        )}

        {/* Divider */}
        <div className="h-px bg-gray-300 mb-16"></div>

        {/* Additional Services */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Additional Digital Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalWebServices.map((service) => (
              <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow text-center">
                <div className="text-2xl mb-3">{service.icon}</div>
                <h3 className="text-lg font-bold text-black mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {service.description}
                </p>
                <div className="text-lg font-bold text-primary mb-3">
                  {service.price} {service.currency}
                </div>
                <button 
                  onClick={() => handlePackageSelect(service)}
                  className="w-full bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
                >
                  Order Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-300 mb-12"></div>

        {/* Call to Action - matching Logo Identity page */}
        <div className="text-center bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-black mb-4">
            Still haven't found what you're looking for? Send us an email now.
          </h2>
          <p className="text-gray-600 mb-6">
            Our web design experts will help you find the perfect digital solution for your business needs.
          </p>
          <button 
            onClick={() => setIsQuizOpen(true)}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium mr-4"
          >
            Start design quiz
          </button>
          <button 
            onClick={() => window.location.href = 'mailto:info@techpartner.studio'}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Email us now
          </button>
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

      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        servicePackage={selectedPackage}
      />
    </div>
  );
}