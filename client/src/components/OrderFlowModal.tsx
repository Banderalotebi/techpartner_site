import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Check, ChevronRight } from "lucide-react";
import { ServicePackage } from "@shared/schema";
import industrialLogoPath from "@assets/image_1751877014080.png";
import moxieLogoPath from "@assets/image_1751877076320.png";
import sheepLogoPath from "@assets/image_1751877115110.png";

// Import color palette images
import bluesImage from "@assets/image_1751877789796.png";
import aquasImage from "@assets/image_1751877797983.png";
import greensImage from "@assets/image_1751877805279.png";
import purplesImage from "@assets/image_1751877814735.png";
import pinksImage from "@assets/image_1751877827547.png";
import redsImage from "@assets/image_1751877837466.png";
import orangesImage from "@assets/image_1751877844515.png";
import yellowsImage from "@assets/image_1751877850567.png";
import lightNeutralsImage from "@assets/image_1751877855852.png";
import darkNeutralsImage from "@assets/image_1751877861445.png";

interface OrderFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicePackage: ServicePackage | null;
}

interface LogoDesign {
  id: string;
  name: string;
  image: string;
  style: string;
}

interface ColorPalette {
  id: string;
  name: string;
  image: string;
  description: string;
}

const logoDesigns: LogoDesign[] = [
  {
    id: "industrial",
    name: "Industrial Retro",
    image: industrialLogoPath,
    style: "Vintage industrial with factory elements"
  },
  {
    id: "moxie",
    name: "Moxie Script",
    image: moxieLogoPath,
    style: "Elegant script typography"
  },
  {
    id: "sheep",
    name: "Neon Sheep",
    image: sheepLogoPath,
    style: "Modern neon outline design"
  }
];

const colorPalettes: ColorPalette[] = [
  {
    id: "blues",
    name: "Blues",
    image: bluesImage,
    description: "Professional and trustworthy blue tones"
  },
  {
    id: "aquas",
    name: "Aquas",
    image: aquasImage,
    description: "Fresh and calming aqua shades"
  },
  {
    id: "greens",
    name: "Greens",
    image: greensImage,
    description: "Natural and growth-oriented greens"
  },
  {
    id: "purples",
    name: "Purples",
    image: purplesImage,
    description: "Creative and luxurious purple hues"
  },
  {
    id: "pinks",
    name: "Pinks",
    image: pinksImage,
    description: "Warm and approachable pink tones"
  },
  {
    id: "reds",
    name: "Reds",
    image: redsImage,
    description: "Bold and energetic red shades"
  },
  {
    id: "oranges",
    name: "Oranges",
    image: orangesImage,
    description: "Vibrant and friendly orange tones"
  },
  {
    id: "yellows",
    name: "Yellows",
    image: yellowsImage,
    description: "Optimistic and cheerful yellow hues"
  },
  {
    id: "light-neutrals",
    name: "Light Neutrals",
    image: lightNeutralsImage,
    description: "Clean and modern light neutral tones"
  },
  {
    id: "dark-neutrals",
    name: "Dark Neutrals",
    image: darkNeutralsImage,
    description: "Sophisticated and elegant dark neutrals"
  },
  {
    id: "designer-choice",
    name: "Let designers make suggestions",
    image: "",
    description: "Trust our designers to choose the perfect colors"
  }
];

const packageTiers = [
  {
    id: "bronze",
    name: "Bronze",
    subtitle: "Creative design on a budget",
    price: "2,135 SAR", // ~€569 converted to SAR
    features: [
      "Logo & business card",
      "Letterhead & envelope", 
      "Facebook cover"
    ],
    designs: "~30 designs",
    guarantee: "Money back guarantee",
    border: "#DAD9D7",
    recommended: false
  },
  {
    id: "silver", 
    name: "Silver",
    subtitle: "Greater variety",
    price: "3,222 SAR", // ~€859 converted to SAR
    features: [
      "Logo & business card",
      "Letterhead & envelope",
      "Facebook cover"
    ],
    designs: "~40 designs", 
    guarantee: "Money back guarantee",
    additionalFeature: "Larger designer prize",
    border: "#DAD9D7",
    recommended: false
  },
  {
    id: "gold",
    name: "Gold", 
    subtitle: "Work only with Mid and Top Level designers",
    price: "5,997 SAR", // ~€1,599 converted to SAR
    features: [
      "Logo & business card",
      "Letterhead & envelope",
      "Facebook cover"
    ],
    designs: "~50 designs",
    guarantee: "Money back guarantee", 
    additionalFeatures: ["Larger designer prize", "Mid and Top Level designers only"],
    border: "#A5823D",
    recommended: true
  },
  {
    id: "platinum",
    name: "Platinum",
    subtitle: "Work only with Top Level designers", 
    price: "8,996 SAR", // ~€2,399 converted to SAR
    features: [
      "Logo & business card",
      "Letterhead & envelope", 
      "Facebook cover"
    ],
    designs: "~40 premium designs",
    guarantee: "Money back guarantee",
    additionalFeatures: [
      "Larger designer prize", 
      "Top Level designers only",
      "Prioritized support",
      "Dedicated manager"
    ],
    border: "#757470",
    recommended: false
  }
];

const steps = [
  { id: 1, title: "Package Selection", description: "Choose your design package" },
  { id: 2, title: "Design Selection", description: "Choose your preferred logo styles" },
  { id: 3, title: "Brand Details", description: "Tell us about your brand" },
  { id: 4, title: "Style Preferences", description: "Define your brand personality" },
  { id: 5, title: "Color Selection", description: "Choose your color preferences" },
  { id: 6, title: "Review & Order", description: "Confirm and place your order" }
];

export default function OrderFlowModal({ isOpen, onClose, servicePackage }: OrderFlowModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedLogos, setSelectedLogos] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [brandDetails, setBrandDetails] = useState({
    companyName: "",
    industry: "",
    tagline: "",
    description: "",
    targetAudience: "",
    competitors: ""
  });
  const [stylePreferences, setStylePreferences] = useState({
    classicModern: [3],
    matureYouthful: [3],
    feminineMasculine: [3],
    playfulSophisticated: [3],
    economicalLuxurious: [3],
    geometricOrganic: [3],
    abstractLiteral: [3]
  });

  const handleLogoToggle = (logoId: string) => {
    setSelectedLogos(prev => 
      prev.includes(logoId) 
        ? prev.filter(id => id !== logoId)
        : [...prev, logoId]
    );
  };

  const handleColorToggle = (colorId: string) => {
    setSelectedColors(prev => 
      prev.includes(colorId) 
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    );
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleBrandDetailsChange = (field: string, value: string) => {
    setBrandDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return true; // Always allow proceeding from package selection
      case 2:
        return selectedLogos.length > 0; // Require at least one logo selection
      case 3:
        return brandDetails.companyName.trim() !== ""; // Require company name
      case 4:
        return true; // Style preferences have defaults
      case 5:
        return selectedColors.length > 0; // Require at least one color selection
      case 6:
        return true; // Review & Order step
      default:
        return true;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedPackage("");
    setSelectedLogos([]);
    setSelectedColors([]);
    setBrandDetails({
      companyName: "",
      industry: "",
      tagline: "",
      description: "",
      targetAudience: "",
      competitors: ""
    });
    setStylePreferences({
      classicModern: [3],
      matureYouthful: [3],
      feminineMasculine: [3],
      playfulSophisticated: [3],
      economicalLuxurious: [3],
      geometricOrganic: [3],
      abstractLiteral: [3]
    });
    onClose();
  };

  const updateStylePreference = (category: string, value: number[]) => {
    setStylePreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const getStyleLabel = (category: string, value: number) => {
    const labels = {
      classicModern: ["Modern", "Contemporary", "Balanced", "Neutral", "Traditional", "Classic", "Vintage"],
      matureYouthful: ["Youthful", "Fresh", "Vibrant", "Neutral", "Mature", "Established", "Timeless"],
      feminineMasculine: ["Feminine", "Soft", "Gentle", "Neutral", "Strong", "Bold", "Masculine"],
      playfulSophisticated: ["Playful", "Fun", "Creative", "Neutral", "Refined", "Elegant", "Sophisticated"],
      economicalLuxurious: ["Economical", "Affordable", "Value", "Neutral", "Premium", "High-end", "Luxurious"],
      geometricOrganic: ["Geometric", "Structured", "Angular", "Neutral", "Flowing", "Natural", "Organic"],
      abstractLiteral: ["Abstract", "Artistic", "Conceptual", "Neutral", "Clear", "Direct", "Literal"]
    };
    return labels[category as keyof typeof labels]?.[value] || "Neutral";
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Order Flow - {servicePackage?.name}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar and Steps */}
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
                {step.id < steps.length && (
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mt-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Which design package do you want?</h3>
                <p className="text-gray-600 mb-6">All logo & brand identity pack packages come with a 100% money-back guarantee and full copyright ownership of the final design.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packageTiers.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className={`relative rounded-lg p-6 cursor-pointer transition-all ${
                      selectedPackage === pkg.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-white border-2 hover:border-gray-300'
                    }`}
                    style={{ borderColor: selectedPackage === pkg.id ? '#3B82F6' : pkg.border }}
                    onClick={() => handlePackageSelect(pkg.id)}
                  >
                    {pkg.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-medium">
                        Recommended
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold mb-1">{pkg.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{pkg.subtitle}</p>
                      <div className="text-2xl font-bold text-gray-900 mb-4">{pkg.price}</div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">{pkg.designs}</div>
                    <div className="text-sm text-gray-600 mb-2">{pkg.guarantee}</div>
                    
                    {pkg.additionalFeature && (
                      <div className="text-sm text-gray-600 mb-2">{pkg.additionalFeature}</div>
                    )}
                    
                    {pkg.additionalFeatures && pkg.additionalFeatures.map((feature, index) => (
                      <div key={index} className="text-sm text-gray-600 mb-2">{feature}</div>
                    ))}
                    
                    {selectedPackage === pkg.id && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Which design styles do you like?</h3>
                <p className="text-gray-600 mb-6">Select multiple logo styles that appeal to you. This will help us understand your preferences.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {logoDesigns.map((logo) => (
                  <div 
                    key={logo.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedLogos.includes(logo.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleLogoToggle(logo.id)}
                  >
                    <div className="relative">
                      <img 
                        src={logo.image} 
                        alt={logo.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      {selectedLogos.includes(logo.id) && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{logo.name}</h4>
                    <p className="text-gray-600 text-sm">{logo.style}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Tell us about your brand</h3>
                <p className="text-gray-600 mb-6">Share some details about your business to help us create the perfect logo.</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name *</label>
                    <input 
                      type="text" 
                      value={brandDetails.companyName}
                      onChange={(e) => handleBrandDetailsChange('companyName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select 
                      value={brandDetails.industry}
                      onChange={(e) => handleBrandDetailsChange('industry', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select your industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Finance">Finance</option>
                      <option value="Retail">Retail</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tagline/Slogan (Optional)</label>
                  <input 
                    type="text" 
                    value={brandDetails.tagline}
                    onChange={(e) => handleBrandDetailsChange('tagline', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your company tagline or slogan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Description</label>
                  <textarea 
                    value={brandDetails.description}
                    onChange={(e) => handleBrandDetailsChange('description', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe what your business does, your mission, and key values..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <input 
                      type="text" 
                      value={brandDetails.targetAudience}
                      onChange={(e) => handleBrandDetailsChange('targetAudience', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Who are your ideal customers?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Key Competitors (Optional)</label>
                    <input 
                      type="text" 
                      value={brandDetails.competitors}
                      onChange={(e) => handleBrandDetailsChange('competitors', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="List 2-3 main competitors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Define your brand personality</h3>
                <p className="text-gray-600 mb-6">Use the sliders below to communicate your brand's style and personality.</p>
              </div>
              
              <div className="space-y-8">
                <div className="block text-lg font-semibold mb-4">Style Preferences</div>
                
                {/* Classic vs Modern */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Modern</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Classic</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.classicModern}
                        onValueChange={(value) => updateStylePreference('classicModern', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('classicModern', stylePreferences.classicModern[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mature vs Youthful */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Youthful</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Mature</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.matureYouthful}
                        onValueChange={(value) => updateStylePreference('matureYouthful', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('matureYouthful', stylePreferences.matureYouthful[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feminine vs Masculine */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Feminine</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Masculine</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.feminineMasculine}
                        onValueChange={(value) => updateStylePreference('feminineMasculine', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('feminineMasculine', stylePreferences.feminineMasculine[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Playful vs Sophisticated */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Playful</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Sophisticated</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.playfulSophisticated}
                        onValueChange={(value) => updateStylePreference('playfulSophisticated', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('playfulSophisticated', stylePreferences.playfulSophisticated[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Economical vs Luxurious */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Economical</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Luxurious</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.economicalLuxurious}
                        onValueChange={(value) => updateStylePreference('economicalLuxurious', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('economicalLuxurious', stylePreferences.economicalLuxurious[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Geometric vs Organic */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Geometric</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Organic</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.geometricOrganic}
                        onValueChange={(value) => updateStylePreference('geometricOrganic', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('geometricOrganic', stylePreferences.geometricOrganic[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Abstract vs Literal */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Abstract</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Literal</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.abstractLiteral}
                        onValueChange={(value) => updateStylePreference('abstractLiteral', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('abstractLiteral', stylePreferences.abstractLiteral[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Colors to explore</h3>
                <p className="text-gray-600 mb-6">Based on the designs you picked, here are the styles you'd like the designers to explore. Don't worry, you can change the styles after you start receiving designs.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {colorPalettes.map((palette) => (
                  <div 
                    key={palette.id}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      selectedColors.includes(palette.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleColorToggle(palette.id)}
                  >
                    <div className="relative">
                      {palette.image ? (
                        <img 
                          src={palette.image} 
                          alt={palette.name}
                          className="w-full h-24 object-cover rounded-lg mb-3"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-white text-xs font-medium text-center px-2">Designer Choice</span>
                        </div>
                      )}
                      {selectedColors.includes(palette.id) && (
                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{palette.name}</h4>
                    <p className="text-gray-600 text-xs">{palette.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Style Preferences</h3>
                <p className="text-gray-600 mb-6">Define your brand personality through these style dimensions.</p>
              </div>
              
              {/* Style Preference Sliders */}
              <div className="space-y-8">
                {/* Classic vs Modern */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Modern</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Classic</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.classicModern}
                        onValueChange={(value) => updateStylePreference('classicModern', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('classicModern', stylePreferences.classicModern[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mature vs Youthful */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Youthful</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Mature</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.matureYouthful}
                        onValueChange={(value) => updateStylePreference('matureYouthful', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('matureYouthful', stylePreferences.matureYouthful[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feminine vs Masculine */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Feminine</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Masculine</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.feminineMasculine}
                        onValueChange={(value) => updateStylePreference('feminineMasculine', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('feminineMasculine', stylePreferences.feminineMasculine[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Playful vs Sophisticated */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Playful</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Sophisticated</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.playfulSophisticated}
                        onValueChange={(value) => updateStylePreference('playfulSophisticated', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('playfulSophisticated', stylePreferences.playfulSophisticated[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Economical vs Luxurious */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Economical</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Luxurious</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.economicalLuxurious}
                        onValueChange={(value) => updateStylePreference('economicalLuxurious', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('economicalLuxurious', stylePreferences.economicalLuxurious[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Geometric vs Organic */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Geometric</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Organic</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.geometricOrganic}
                        onValueChange={(value) => updateStylePreference('geometricOrganic', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('geometricOrganic', stylePreferences.geometricOrganic[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Abstract vs Literal */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Abstract</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Literal</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.abstractLiteral}
                        onValueChange={(value) => updateStylePreference('abstractLiteral', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('abstractLiteral', stylePreferences.abstractLiteral[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Review & Order</h3>
                <p className="text-gray-600 mb-6">Review your selections and complete your order.</p>
              </div>
              
              {/* Order Summary */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{servicePackage?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <span className="font-medium">{packageTiers.find(pkg => pkg.id === selectedPackage)?.name || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company:</span>
                    <span className="font-medium">{brandDetails.companyName || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Industry:</span>
                    <span className="font-medium">{brandDetails.industry || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected Designs:</span>
                    <span className="font-medium">{selectedLogos.length} logo styles</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Color Palettes:</span>
                    <span className="font-medium">{selectedColors.length} selected</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Price:</span>
                      <span className="text-blue-600">{packageTiers.find(pkg => pkg.id === selectedPackage)?.price || '0 SAR'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4 text-blue-800">Payment & Delivery</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>✓ Secure payment processing</p>
                  <p>✓ Money-back guarantee</p>
                  <p>✓ Delivery: 3-5 business days</p>
                  <p>✓ Unlimited revisions included</p>
                  <p>✓ Final files in all formats (AI, PNG, JPG, PDF)</p>
                </div>
              </div>

              {/* Order Confirmation */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Ready to place your order
                    </p>
                    <p className="text-sm text-green-700">
                      Your logo design project will begin immediately after payment confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            
            {currentStep < steps.length ? (
              <Button 
                onClick={handleNext}
                disabled={!canProceedToNext()}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleClose}>
                Complete Order
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}