import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

import ProjectQuestionnaireModal from "@/components/ProjectQuestionnaireModal";
import BrandQuizModal from "@/components/BrandQuizModal";
import OrderFlowModal from "@/components/OrderFlowModal";
import { AuthModal } from "@/components/AuthModal";
import type { ServicePackage } from "@shared/schema";
import logoExampleImage from "@/assets/main-logo-example.png";
import logo1 from "@assets/image_1751876446579.png";
import logo2 from "@assets/image_1751876469358.png";
import logo3 from "@assets/image_1751876489221.png";
import logo4 from "@assets/image_1751876524526.png";
import logo5 from "@assets/image_1751876541133.png";
import logo6 from "@assets/image_1751876548215.png";
import logo7 from "@assets/image_1751876556259.png";
import logo8 from "@assets/image_1751876562894.png";
import logo9 from "@assets/image_1751876573531.png";
import logo10 from "@assets/image_1751876584155.png";
import logo11 from "@assets/image_1751876592479.png";
import logo12 from "@assets/image_1751876600501.png";
import logo13 from "@assets/image_1751876647278.png";
import logo14 from "@assets/image_1751876653511.png";
import logo15 from "@assets/image_1751876660029.png";
import logo16 from "@assets/image_1751876666967.png";
import logo17 from "@assets/image_1751876676077.png";
import logo18 from "@assets/image_1751876683176.png";
import logo19 from "@assets/image_1751876693666.png";

// Logo & Identity specific service packages - 4-tier structure
const logoIdentityServices = [
  {
    id: 1,
    title: "Starter Identity",
    description: "Perfect for new businesses starting their brand journey with essential logo design",
    price: "2135",
    currency: "SAR",
    features: [
      "Logo & business card design",
      "Letterhead & envelope",
      "Facebook cover",
      "30 Design concepts",
      "Money back guarantee",
      "Junior designer"
    ],
    icon: "�",
    category: "Starter Package"
  },
  {
    id: 2,
    title: "Professional Edge",
    description: "Enhanced branding package with more design concepts and professional touch",
    price: "3222",
    currency: "SAR",
    features: [
      "Logo & business card design",
      "Letterhead & envelope", 
      "Facebook cover",
      "35 Design concepts",
      "Money back guarantee",
      "Professional designer"
    ],
    icon: "💼",
    category: "Professional Package"
  },
  {
    id: 3,
    title: "Executive Branding",
    description: "Premium branding solution for established businesses with extensive design options",
    price: "5997",
    currency: "SAR",
    features: [
      "Logo & business card design",
      "Letterhead & envelope",
      "Facebook cover", 
      "45 Design concepts",
      "Money back guarantee",
      "Senior designer"
    ],
    icon: "⭐",
    category: "Executive Package"
  },
  {
    id: 4,
    title: "Elite Identity",
    description: "Top-tier comprehensive branding package with maximum design concepts and expert designer",
    price: "8996",
    currency: "SAR",
    features: [
      "Logo & business card design",
      "Letterhead & envelope",
      "Facebook cover",
      "50 Design concepts", 
      "Money back guarantee",
      "Expert designer"
    ],
    icon: "�",
    category: "Elite Package"
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

// Logo gallery for showcasing examples
const logoGallery = [
  { id: 1, src: logo1, alt: "Professional logo design example 1", category: "Corporate" },
  { id: 2, src: logo2, alt: "Creative logo design example 2", category: "Creative" },
  { id: 3, src: logo3, alt: "Modern logo design example 3", category: "Modern" },
  { id: 4, src: logo4, alt: "Brand identity logo example 4", category: "Brand Identity" },
  { id: 5, src: logo5, alt: "Business logo design example 5", category: "Business" },
  { id: 6, src: logo6, alt: "Corporate logo design example 6", category: "Corporate" },
  { id: 7, src: logo7, alt: "Minimalist logo design example 7", category: "Minimalist" },
  { id: 8, src: logo8, alt: "Creative brand logo example 8", category: "Creative" },
  { id: 9, src: logo9, alt: "Professional brand identity example 9", category: "Professional" },
  { id: 10, src: logo10, alt: "Modern business logo example 10", category: "Modern" },
  { id: 11, src: logo11, alt: "Logo design portfolio example 11", category: "Portfolio" },
  { id: 12, src: logo12, alt: "Brand logo showcase example 12", category: "Brand" },
  { id: 13, src: logo13, alt: "Creative logo portfolio example 13", category: "Creative" },
  { id: 14, src: logo14, alt: "Professional logo gallery example 14", category: "Professional" },
  { id: 15, src: logo15, alt: "Business branding logo example 15", category: "Business" },
  { id: 16, src: logo16, alt: "Logo design showcase example 16", category: "Showcase" },
  { id: 17, src: logo17, alt: "Creative brand identity example 17", category: "Creative" },
  { id: 18, src: logo18, alt: "Modern logo design example 18", category: "Modern" },
  { id: 19, src: logo19, alt: "Professional business logo example 19", category: "Professional" }
];

export default function LogoIdentityPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingService, setPendingService] = useState<any>(null);
  const [selectedLogos, setSelectedLogos] = useState<number[]>([]);
  const [showLogoSelection, setShowLogoSelection] = useState(false);

  const handlePackageSelect = (service: any) => {
    // Check if user is authenticated
    if (!user && !isLoading) {
      // Store the pending service and show auth modal
      setPendingService(service);
      setIsAuthModalOpen(true);
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with your order.",
      });
      return;
    }

    // User is authenticated, proceed with order
    proceedWithOrder(service);
  };

  const proceedWithOrder = (service: any) => {
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

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    
    // If there was a pending service, proceed with it
    if (pendingService) {
      proceedWithOrder(pendingService);
      setPendingService(null);
      toast({
        title: "Welcome!",
        description: "You can now continue with your order.",
      });
    }
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    setPendingService(null);
  };

  const toggleLogoSelection = (logoId: number) => {
    setSelectedLogos(prev => {
      if (prev.includes(logoId)) {
        return prev.filter(id => id !== logoId);
      } else {
        return [...prev, logoId];
      }
    });
  };

  const handleLogoSelectionComplete = () => {
    if (selectedLogos.length === 0) {
      toast({
        title: "Please select logos",
        description: "Select at least one logo style you like to help us understand your preferences.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Logo preferences saved!",
      description: `You selected ${selectedLogos.length} logo styles. This will help our designers create something perfect for you.`,
    });
    
    setShowLogoSelection(false);
    // Here you could pass the selected logos to the order process
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎨 Premium Logo Design Packages</h2>
            <p className="text-gray-600 text-lg mb-6">
              Professional logo designs starting from <span className="font-bold text-blue-600">2,135 SAR</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-green-600 mb-2">✅ What's Included</div>
                <ul className="text-gray-600 space-y-1">
                  <li>• Logo & business card design</li>
                  <li>• Letterhead & envelope</li>
                  <li>• Facebook cover</li>
                  <li>• 30-50 design concepts</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-blue-600 mb-2">⚡ Professional Service</div>
                <ul className="text-gray-600 space-y-1">
                  <li>• Money back guarantee</li>
                  <li>• Professional designers</li>
                  <li>• Print-ready files</li>
                  <li>• Multiple revisions</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-purple-600 mb-2">🏆 Designer Levels</div>
                <ul className="text-gray-600 space-y-1">
                  <li>• Junior designers</li>
                  <li>• Professional level</li>
                  <li>• Senior designers</li>
                  <li>• Expert designers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main Services Layout - New 4-Tier Design */}
        <div className="space-y-16">
          {/* New 4-Tier Logo Design Packages */}
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">Choose Your Logo Design Package</h2>
              <p className="text-gray-600 text-lg">Professional logo design packages with money back guarantee</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Starter Identity Package */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-black mb-3">Starter Identity</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Perfect for new businesses starting their brand journey
                </p>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-blue-600 mb-2">2,135 SAR</div>
                  <div className="text-xs text-gray-500">Junior Designer</div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1 mb-4 text-left">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Logo & business card design</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Letterhead & envelope</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Facebook cover</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>30 Design concepts</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Money back guarantee</li>
                </ul>
                <button 
                  onClick={() => handlePackageSelect(logoIdentityServices[0])}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Order Now
                </button>
              </div>

              {/* Professional Edge Package */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-black mb-3">Professional Edge</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Enhanced branding package with professional touch
                </p>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-green-600 mb-2">3,222 SAR</div>
                  <div className="text-xs text-gray-500">Professional Designer</div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1 mb-4 text-left">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Logo & business card design</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Letterhead & envelope</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Facebook cover</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>35 Design concepts</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Money back guarantee</li>
                </ul>
                <button 
                  onClick={() => handlePackageSelect(logoIdentityServices[1])}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Order Now
                </button>
              </div>

              {/* Executive Branding Package - Popular */}
              <div className="bg-white border-2 border-purple-400 rounded-lg p-6 text-center hover:shadow-lg transition-shadow relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                  POPULAR
                </div>
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-black mb-3">Executive Branding</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Premium branding solution for established businesses
                </p>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-purple-600 mb-2">5,997 SAR</div>
                  <div className="text-xs text-gray-500">Senior Designer</div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1 mb-4 text-left">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Logo & business card design</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Letterhead & envelope</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Facebook cover</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>45 Design concepts</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Money back guarantee</li>
                </ul>
                <button 
                  onClick={() => handlePackageSelect(logoIdentityServices[2])}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Order Now
                </button>
              </div>

              {/* Elite Identity Package */}
              <div className="bg-white border-2 border-yellow-400 rounded-lg p-6 text-center hover:shadow-lg transition-shadow relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                  PREMIUM
                </div>
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-xl font-bold text-black mb-3">Elite Identity</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Top-tier comprehensive branding package
                </p>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">8,996 SAR</div>
                  <div className="text-xs text-gray-500">Expert Designer</div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1 mb-4 text-left">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Logo & business card design</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Letterhead & envelope</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Facebook cover</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>50 Design concepts</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Money back guarantee</li>
                </ul>
                <button 
                  onClick={() => handlePackageSelect(logoIdentityServices[3])}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>



          {/* Logo Design Examples */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-black mb-4">Professional Logo Portfolio</h3>
              <p className="text-gray-600">See the quality and creativity of our logo designs across various industries</p>
            </div>
            
            {/* Main featured example */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
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

            {/* Logo Gallery Grid */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-2xl font-bold">Our Logo Design Portfolio (19 Styles)</h4>
                <button
                  onClick={() => setShowLogoSelection(!showLogoSelection)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    showLogoSelection 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {showLogoSelection ? '✓ Selection Mode' : '🎯 Select Your Favorites'}
                </button>
              </div>

              {showLogoSelection && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-blue-800">Logo Style Selection</h5>
                      <p className="text-sm text-blue-600">
                        Click on logos you like to help our designers understand your style preferences
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-600">Selected: {selectedLogos.length}</div>
                      <button
                        onClick={handleLogoSelectionComplete}
                        className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                        disabled={selectedLogos.length === 0}
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {logoGallery.map((logo) => (
                  <div 
                    key={logo.id} 
                    className={`bg-gray-50 rounded-xl p-3 hover:shadow-md transition-all duration-300 group cursor-pointer ${
                      showLogoSelection ? 'hover:scale-105' : ''
                    } ${
                      selectedLogos.includes(logo.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => showLogoSelection && toggleLogoSelection(logo.id)}
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-white p-3 flex items-center justify-center relative">
                      {showLogoSelection && selectedLogos.includes(logo.id) && (
                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                      <img 
                        src={logo.src} 
                        alt={logo.alt}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-xs text-gray-500">Logo #{logo.id}</p>
                      <p className="text-xs text-blue-600 font-medium">{logo.category}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <p className="text-gray-600 text-sm">
                  ✨ Each logo is custom-designed to reflect your brand's unique identity and values
                </p>
                {!showLogoSelection && (
                  <p className="text-blue-600 text-sm mt-2">
                    💡 Tip: Use "Select Your Favorites" to help our designers understand your style preferences
                  </p>
                )}
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        onSuccess={handleAuthSuccess}
      />

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