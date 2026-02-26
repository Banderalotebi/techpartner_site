import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronRight, CreditCard } from "lucide-react";
import { ServicePackage } from "@shared/schema";

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

interface BrandDetails {
  companyName: string;
  industry: string;
  description: string;
  targetAudience: string;
  values: string;
}

interface StylePreferences {
  matureYouthful: number[];
  feminineMasculine: number[];
  luxuryEconomical: number[];
  playfulSerious: number[];
  boldMinimal: number[];
}

// Mock data for logo designs
const logoDesigns: LogoDesign[] = [
  {
    id: "industrial",
    name: "Industrial Design",
    image: "/assets/image_1751877014080.png",
    style: "Bold, modern, industrial"
  },
  {
    id: "moxie", 
    name: "Moxie Logo",
    image: "/assets/image_1751877076320.png",
    style: "Creative, dynamic, energetic"
  },
  {
    id: "sheep",
    name: "Sheep Design", 
    image: "/assets/image_1751877115110.png",
    style: "Friendly, approachable, organic"
  }
];

// Mock data for color palettes
const colorPalettes: ColorPalette[] = [
  {
    id: "blues",
    name: "Blues",
    image: "/assets/image_1751877789796.png",
    description: "Trust, stability, professional"
  },
  {
    id: "greens",
    name: "Greens", 
    image: "/assets/image_1751877805279.png",
    description: "Growth, nature, harmony"
  },
  {
    id: "purples",
    name: "Purples",
    image: "/assets/image_1751877814735.png", 
    description: "Luxury, creativity, mystery"
  }
];

const packageTiers = [
  {
    id: "basic",
    name: "Basic Package",
    price: "299 SAR",
    features: ["3 Logo Concepts", "2 Revisions", "Basic File Formats"]
  },
  {
    id: "standard", 
    name: "Standard Package",
    price: "599 SAR",
    features: ["5 Logo Concepts", "5 Revisions", "All File Formats", "Business Card Design"]
  },
  {
    id: "premium",
    name: "Premium Package", 
    price: "999 SAR",
    features: ["8 Logo Concepts", "Unlimited Revisions", "Complete Brand Package", "Social Media Kit"]
  }
];

const steps = [
  { id: 1, title: "Package Selection", description: "Choose your design package" },
  { id: 2, title: "Design Selection", description: "Choose your preferred logo styles" },
  { id: 3, title: "Brand Details", description: "Tell us about your brand" },
  { id: 4, title: "Style Preferences", description: "Define your brand personality" },
  { id: 5, title: "Color Selection", description: "Choose your color preferences" },
  { id: 6, title: "Review & Order", description: "Confirm your order details" },
  { id: 7, title: "Payment", description: "Complete your purchase" }
];

export function OrderFlowModal({ isOpen, onClose, servicePackage }: OrderFlowModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedLogos, setSelectedLogos] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [brandDetails, setBrandDetails] = useState<BrandDetails>({
    companyName: "",
    industry: "",
    description: "",
    targetAudience: "",
    values: ""
  });

  const [stylePreferences, setStylePreferences] = useState<StylePreferences>({
    matureYouthful: [3],
    feminineMasculine: [3], 
    luxuryEconomical: [3],
    playfulSerious: [3],
    boldMinimal: [3]
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  const updateStylePreference = (key: keyof StylePreferences, value: number[]) => {
    setStylePreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleLogoSelection = (logoId: string) => {
    setSelectedLogos(prev => 
      prev.includes(logoId) 
        ? prev.filter(id => id !== logoId)
        : [...prev, logoId]
    );
  };

  const toggleColorSelection = (colorId: string) => {
    setSelectedColors(prev =>
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId) 
        : [...prev, colorId]
    );
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedPackage !== "";
      case 2:
        return selectedLogos.length > 0;
      case 3:
        return brandDetails.companyName.trim() !== "";
      case 4:
        return true; // Style preferences have defaults
      case 5:
        return selectedColors.length > 0;
      case 6:
        return true; // Review & Order step
      case 7:
        return true; // Payment step
      default:
        return true;
    }
  };

  const getStyleLabel = (type: string, value: number) => {
    const labels: { [key: string]: string[] } = {
      matureYouthful: ["Very Youthful", "Youthful", "Somewhat Youthful", "Neutral", "Somewhat Mature", "Mature", "Very Mature"],
      feminineMasculine: ["Very Feminine", "Feminine", "Somewhat Feminine", "Neutral", "Somewhat Masculine", "Masculine", "Very Masculine"],
      luxuryEconomical: ["Very Economical", "Economical", "Somewhat Economical", "Neutral", "Somewhat Luxury", "Luxury", "Very Luxury"],
      playfulSerious: ["Very Playful", "Playful", "Somewhat Playful", "Neutral", "Somewhat Serious", "Serious", "Very Serious"],
      boldMinimal: ["Very Minimal", "Minimal", "Somewhat Minimal", "Neutral", "Somewhat Bold", "Bold", "Very Bold"]
    };
    return labels[type]?.[value] || "Neutral";
  };

  const currentStepInfo = steps.find(step => step.id === currentStep);
  const progress = (currentStep / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {servicePackage?.name || "Logo Design Service"}
          </DialogTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{currentStepInfo?.title}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </DialogHeader>

        <div className="mt-6">
          {/* Step 1: Package Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Choose Your Package</h3>
                <p className="text-gray-600 mb-6">Select the package that best fits your needs</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packageTiers.map((pkg) => (
                  <Card 
                    key={pkg.id}
                    className={`cursor-pointer transition-all ${
                      selectedPackage === pkg.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-center">{pkg.name}</CardTitle>
                      <div className="text-3xl font-bold text-center text-blue-600">{pkg.price}</div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {selectedPackage === pkg.id && (
                        <div className="mt-4 text-center">
                          <Check className="h-6 w-6 text-green-600 mx-auto" />
                          <span className="text-sm text-green-600">Selected</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Design Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Choose Design Styles</h3>
                <p className="text-gray-600 mb-6">Select logo styles that appeal to you (you can choose multiple)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {logoDesigns.map((logo) => (
                  <div
                    key={logo.id}
                    className={`relative cursor-pointer transition-all rounded-lg border-2 p-4 ${
                      selectedLogos.includes(logo.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleLogoSelection(logo.id)}
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-500">Logo Preview</span>
                    </div>
                    {selectedLogos.includes(logo.id) && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <h4 className="font-medium mb-1">{logo.name}</h4>
                    <p className="text-gray-600 text-sm">{logo.style}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Brand Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Tell Us About Your Brand</h3>
                <p className="text-gray-600 mb-6">Help us understand your business better</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name *</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={brandDetails.companyName}
                      onChange={(e) => setBrandDetails(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={brandDetails.industry}
                      onChange={(e) => setBrandDetails(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g., Technology, Healthcare, Food & Beverage"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={brandDetails.targetAudience}
                      onChange={(e) => setBrandDetails(prev => ({ ...prev, targetAudience: e.target.value }))}
                      placeholder="Who are your customers?"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Description</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                      value={brandDetails.description}
                      onChange={(e) => setBrandDetails(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Briefly describe what your company does"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Brand Values</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                      value={brandDetails.values}
                      onChange={(e) => setBrandDetails(prev => ({ ...prev, values: e.target.value }))}
                      placeholder="What values does your brand represent?"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Style Preferences */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Define Your Brand Personality</h3>
                <p className="text-gray-600 mb-6">Help us understand the style and feel you want for your brand</p>
              </div>

              <div className="space-y-8">
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

                {/* Luxury vs Economical */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-[70px] bg-gray-200 rounded-full relative mb-6">
                      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-700">Economical</div>
                      <div className="absolute -top-8 right-0 text-sm font-medium text-gray-700">Luxury</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Neutral</div>
                      
                      <Slider
                        value={stylePreferences.luxuryEconomical}
                        onValueChange={(value) => updateStylePreference('luxuryEconomical', value)}
                        max={6}
                        min={0}
                        step={1}
                        className="absolute top-1/2 transform -translate-y-1/2 w-full px-8"
                      />
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {getStyleLabel('luxuryEconomical', stylePreferences.luxuryEconomical[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Color Selection */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Choose Color Preferences</h3>
                <p className="text-gray-600 mb-6">Select color palettes that align with your brand (you can choose multiple)</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {colorPalettes.map((palette) => (
                  <div
                    key={palette.id}
                    className={`relative cursor-pointer transition-all rounded-lg border-2 p-3 ${
                      selectedColors.includes(palette.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleColorSelection(palette.id)}
                  >
                    <div className="w-full h-24 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-white text-xs font-medium text-center px-2">Color Preview</span>
                    </div>
                    {selectedColors.includes(palette.id) && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <h4 className="font-medium text-sm mb-1">{palette.name}</h4>
                    <p className="text-gray-600 text-xs">{palette.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Review & Order */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Review Your Order</h3>
                <p className="text-gray-600 mb-6">Please review your selections before proceeding to payment</p>
              </div>

              <div className="space-y-6">
                {/* Package Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Package: {servicePackage?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600">{servicePackage?.description}</p>
                        <div className="mt-2 space-y-1">
                          {servicePackage?.features?.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Check className="h-3 w-3 text-green-600" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">{servicePackage?.price} SAR</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Details Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Selections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">Selected Package:</h4>
                      <p className="text-gray-600">{packageTiers.find(pkg => pkg.id === selectedPackage)?.name || 'No package selected'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Selected Designs:</h4>
                      <p className="text-gray-600">{selectedLogos.length > 0 ? `${selectedLogos.length} designs selected` : 'No designs selected'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Brand Details:</h4>
                      <p className="text-gray-600">{brandDetails.companyName || 'Company name not provided'}</p>
                      <p className="text-gray-600">{brandDetails.industry || 'Industry not specified'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Color Preferences:</h4>
                      <p className="text-gray-600">{selectedColors.length > 0 ? `${selectedColors.length} colors selected` : 'No colors selected'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Total */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span>{packageTiers.find(pkg => pkg.id === selectedPackage)?.price || servicePackage?.price} SAR</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 7: Payment */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Payment</h3>
                <p className="text-gray-600 mb-6">Complete your order by making a secure payment</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Order Summary</h4>
                      <div className="flex justify-between text-blue-700">
                        <span>{packageTiers.find(pkg => pkg.id === selectedPackage)?.name || servicePackage?.name}</span>
                        <span>{packageTiers.find(pkg => pkg.id === selectedPackage)?.price || servicePackage?.price} SAR</span>
                      </div>
                    </div>
                    
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Click below to proceed to secure payment</p>
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                        Proceed to Payment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
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

export default OrderFlowModal;
