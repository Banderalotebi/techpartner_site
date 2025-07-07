import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

import ProjectQuestionnaireModal from "@/components/ProjectQuestionnaireModal";
import BrandQuizModal from "@/components/BrandQuizModal";
import OrderFlowModal from "@/components/OrderFlowModal";
import type { ServicePackage } from "@shared/schema";
import logoExampleImage from "@assets/image_1751895996149.png";

// Logo & Identity specific service packages matching Figma design
const logoIdentityServices = [
  {
    id: 1,
    title: "Logo & brand identity pack",
    description: "Get a logo that digital and print essentials to jump-start your brand",
    price: "3500",
    currency: "SAR",
    features: [
      "Logo",
      "Business card",
      "Letterhead & envelope",
      "Facebook cover"
    ],
    icon: "📦",
    category: "Premium Package"
  },
  {
    id: 2,
    title: "Logo design",
    description: "A versatile logo design tailored to your brand",
    price: "1500",
    currency: "SAR",
    features: [
      "Custom logo design",
      "Multiple concepts",
      "Unlimited revisions",
      "Vector files"
    ],
    icon: "🅰️",
    category: "Essential"
  },
  {
    id: 3,
    title: "Business card",
    description: "Professional business card design that builds credibility",
    price: "800",
    currency: "SAR",
    features: [
      "Custom design",
      "Print-ready files",
      "Both sides design",
      "Multiple formats"
    ],
    icon: "💼",
    category: "Print Design"
  },
  {
    id: 4,
    title: "Logo & brand guide",
    description: "Define your logo brand with a complete brand visual identity standards",
    price: "5000",
    currency: "SAR",
    features: [
      "Logo",
      "Color palette",
      "Typography",
      "Brand guide document"
    ],
    icon: "📋",
    category: "Complete Branding"
  },
  {
    id: 5,
    title: "Logo & business card",
    description: "Get a logo and business card design that importantly complements each other",
    price: "2200",
    currency: "SAR",
    features: [
      "Logo design",
      "Business card"
    ],
    icon: "💳",
    category: "Combo Package"
  },
  {
    id: 6,
    title: "Logo & website",
    description: "Receive a custom logo and fully website perfectly aligned with your brand",
    price: "8500",
    currency: "SAR",
    features: [
      "Logo",
      "Fully responsive custom-designed foundational website",
      "Perfect for an SEO"
    ],
    icon: "🌐",
    category: "Digital Package"
  },
  {
    id: 7,
    title: "Logo & social media pack",
    description: "Creative logo and social media cover images to make a lasting online impression",
    price: "2800",
    currency: "SAR",
    features: [
      "Logo",
      "Facebook cover",
      "Twitter header",
      "YouTube background"
    ],
    icon: "📱",
    category: "Social Media"
  }
];

const additionalServices = [
  {
    id: 8,
    title: "Brand guide",
    description: "Unlock a comprehensive style guide defining your brand's visual identity",
    price: "3200",
    currency: "SAR",
    icon: "📖"
  },
  {
    id: 9,
    title: "Stationery",
    description: "Professional letterhead and envelopes that convey your credibility",
    price: "1200",
    currency: "SAR",
    icon: "📄"
  },
  {
    id: 10,
    title: "Full-Service Brand Pack",
    description: "Get a strategically guided brand identity with your personal Creative Director from Tech Partner Studio",
    price: "15000",
    currency: "SAR",
    icon: "⭐"
  }
];

export default function LogoIdentityPage() {
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const handlePackageSelect = (service: any) => {
    // Convert service to ServicePackage format
    const servicePackage: ServicePackage = {
      id: service.id,
      categoryId: 1, // Logo & Identity category
      name: service.title,
      slug: service.title.toLowerCase().replace(/\s+/g, '-'),
      description: service.description,
      price: parseInt(service.price),
      features: service.features || [],
      isPopular: service.id === 1 // Make first package popular
    };
    
    setSelectedPackage(servicePackage);
    setIsOrderOpen(true);
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
        
        {/* Page Title Section - Matching Figma */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-8">
            Logo & Identity Design Services
          </h1>
        </div>

        {/* Main Services Layout - Matching Figma Design */}
        <div className="space-y-16">
          {/* First Row - Logo & brand identity pack */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-2xl font-bold text-black mb-4">Logo & brand identity pack</h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    Get a logo that digital and print essentials to jump-start your brand
                  </p>
                  <div className="mb-4">
                    <div className="text-lg text-gray-600 mb-2">from 3000 SAR</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Logo</li>
                      <li>• Business card</li>
                      <li>• Letterhead & envelope</li>
                      <li>• Facebook cover</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => handlePackageSelect({id: 1, title: "Logo & brand identity pack", price: "3000", description: "Complete brand identity package"})}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Order Now
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo design */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">🅰️</div>
                  <h3 className="text-xl font-bold text-black mb-3">Logo design</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    A versatile logo design tailored to your brand
                  </p>
                  <div className="text-lg text-gray-600 mb-4">from 1500 SAR</div>
                  <button 
                    onClick={() => handlePackageSelect({id: 2, title: "Logo design", price: "1500", description: "Custom logo design"})}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Order Now
                  </button>
                </div>

                {/* Business card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">💼</div>
                  <h3 className="text-xl font-bold text-black mb-3">Business card</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Professional business card design that builds credibility
                  </p>
                  <div className="text-lg text-gray-600 mb-4">from 800 SAR</div>
                  <button 
                    onClick={() => handlePackageSelect({id: 3, title: "Business card", price: "800", description: "Professional business card design"})}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Logo & brand guide and Logo & business card */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Logo & brand guide */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-black mb-4">Logo & brand guide</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Define your logo brand with a complete brand visual identity standards
                </p>
                <div className="mb-4">
                  <div className="text-lg text-gray-600 mb-2">from 2400 SAR</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Logo</li>
                    <li>• Color palette</li>
                    <li>• Typography</li>
                    <li>• Brand guide document</li>
                  </ul>
                </div>
                <button 
                  onClick={() => handlePackageSelect({id: 4, title: "Logo & brand guide", price: "2400", description: "Complete brand guide package"})}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Order Now
                </button>
              </div>

              {/* Logo & business card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-2xl font-bold text-black mb-4">Logo & business card</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Get a logo and business card design that importantly complements each other
                </p>
                <div className="mb-4">
                  <div className="text-lg text-gray-600 mb-2">from 2200 SAR</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Logo design</li>
                    <li>• Business card</li>
                  </ul>
                </div>
                <button 
                  onClick={() => handlePackageSelect({id: 5, title: "Logo & business card", price: "2200", description: "Logo and business card combo"})}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>

          {/* Logo Design Examples */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-black mb-4">Professional Logo Examples</h3>
              <p className="text-gray-600">See the quality and creativity of our logo designs</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <img 
                src={logoExampleImage} 
                alt="Professional logo design examples - Whistle Punk Ice Cream" 
                className="w-full max-w-2xl mx-auto rounded-lg"
              />
              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm italic">
                  Example of professional logo designs with modern typography and creative branding
                </p>
              </div>
            </div>
          </div>
          
          <hr className="border-gray-200 my-16 max-w-6xl mx-auto" />

          {/* Third Row - Logo & website */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-2xl font-bold text-black mb-4">Logo & website</h3>
              <p className="text-gray-600 mb-6">
                Receive a custom logo and fully website perfectly aligned with your brand
              </p>
              <div className="mb-6">
                <div className="text-lg text-gray-600 mb-2">from 6000 SAR</div>
                <ul className="text-sm text-gray-600 space-y-1 max-w-md mx-auto">
                  <li>• Logo</li>
                  <li>• Fully responsive custom-designed foundational website</li>
                  <li>• Perfect for an SEO</li>
                </ul>
              </div>
              <button 
                onClick={() => handlePackageSelect({id: 6, title: "Logo & website", price: "6000", description: "Logo and website package"})}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Order Now
              </button>
            </div>
          </div>

          {/* Fourth Row - Logo & social media pack */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-black mb-4">Logo & social media pack</h3>
              <p className="text-gray-600 mb-6">
                Creative logo and social media cover images to make a lasting online impression
              </p>
              <div className="mb-6">
                <div className="text-lg text-gray-600 mb-2">from 2800 SAR</div>
                <ul className="text-sm text-gray-600 space-y-1 max-w-md mx-auto">
                  <li>• Logo</li>
                  <li>• Facebook cover</li>
                  <li>• Twitter header</li>
                  <li>• YouTube background</li>
                </ul>
              </div>
              <button 
                onClick={() => handlePackageSelect({id: 7, title: "Logo & social media pack", price: "2800", description: "Logo and social media package"})}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-300 mb-16"></div>

        {/* Additional Services - Matching Figma Bottom Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Brand guide */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-black mb-3">Brand guide</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Unlock a comprehensive style guide defining your brand's visual identity
              </p>
              <div className="text-lg text-gray-600 mb-4">from 3200 SAR</div>
              <button 
                onClick={() => handlePackageSelect({id: 8, title: "Brand guide", price: "3200", description: "Comprehensive brand guide"})}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Order Now
              </button>
            </div>

            {/* Stationery */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-black mb-3">Stationery</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Professional letterhead and envelopes that convey your credibility
              </p>
              <div className="text-lg text-gray-600 mb-4">from 1200 SAR</div>
              <button 
                onClick={() => handlePackageSelect({id: 9, title: "Stationery", price: "1200", description: "Professional stationery design"})}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Order Now
              </button>
            </div>

            {/* Full-Service Brand Pack */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-black mb-3">Full-Service Brand Pack</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Get a strategically guided brand identity with your personal Creative Director from Tech Partner Studio
              </p>
              <div className="text-lg text-gray-600 mb-4">from 15000 SAR</div>
              <button 
                onClick={() => handlePackageSelect({id: 10, title: "Full-Service Brand Pack", price: "15000", description: "Complete brand service package"})}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-300 mb-12"></div>

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

      <OrderFlowModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        servicePackage={selectedPackage}
      />
    </div>
  );
}