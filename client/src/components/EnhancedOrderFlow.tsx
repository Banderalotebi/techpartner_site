import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Check, ChevronRight, ChevronLeft, Lock, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuthModal } from "./AuthModal";
import { PaymentModal } from "./PaymentModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { ServicePackage } from "@shared/schema";

// Import all the assets
import industrialLogoPath from "@assets/image_1751877014080.png";
import moxieLogoPath from "@assets/image_1751877076320.png";
import sheepLogoPath from "@assets/image_1751877115110.png";

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

interface EnhancedOrderFlowProps {
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
    name: "Modern Moxie",
    image: moxieLogoPath,
    style: "Clean, contemporary with bold typography"
  },
  {
    id: "sheep",
    name: "Organic Sheep",
    image: sheepLogoPath,
    style: "Natural, friendly with organic shapes"
  }
];

const colorPalettes: ColorPalette[] = [
  {
    id: "blues",
    name: "Blues",
    image: bluesImage,
    description: "Professional, trustworthy, calming"
  },
  {
    id: "aquas",
    name: "Aquas",
    image: aquasImage,
    description: "Fresh, clean, modern"
  },
  {
    id: "greens",
    name: "Greens",
    image: greensImage,
    description: "Natural, growth, harmony"
  },
  {
    id: "purples",
    name: "Purples",
    image: purplesImage,
    description: "Creative, luxury, innovation"
  },
  {
    id: "pinks",
    name: "Pinks",
    image: pinksImage,
    description: "Playful, feminine, approachable"
  },
  {
    id: "reds",
    name: "Reds",
    image: redsImage,
    description: "Bold, energetic, passionate"
  },
  {
    id: "oranges",
    name: "Oranges",
    image: orangesImage,
    description: "Warm, friendly, enthusiastic"
  },
  {
    id: "yellows",
    name: "Yellows",
    image: yellowsImage,
    description: "Optimistic, cheerful, attention-grabbing"
  },
  {
    id: "lightNeutrals",
    name: "Light Neutrals",
    image: lightNeutralsImage,
    description: "Clean, minimal, sophisticated"
  },
  {
    id: "darkNeutrals",
    name: "Dark Neutrals",
    image: darkNeutralsImage,
    description: "Premium, elegant, timeless"
  }
];

const steps = [
  { id: 1, title: "Package Selection", description: "Choose your design package" },
  { id: 2, title: "Design Selection", description: "Choose your preferred logo styles" },
  { id: 3, title: "Brand Details", description: "Tell us about your brand" },
  { id: 4, title: "Style Preferences", description: "Define your brand personality" },
  { id: 5, title: "Color Selection", description: "Choose your color preferences" },
  { id: 6, title: "Review & Order", description: "Confirm your order details" },
  { id: 7, title: "Authentication", description: "Sign in to continue" },
  { id: 8, title: "Payment", description: "Complete your purchase" }
];

export function EnhancedOrderFlow({ isOpen, onClose, servicePackage }: EnhancedOrderFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedLogos, setSelectedLogos] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

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

  // Set initial package when modal opens
  useEffect(() => {
    if (isOpen && servicePackage) {
      setSelectedPackage(servicePackage.name);
    }
  }, [isOpen, servicePackage]);

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

  const handleSliderChange = (preference: string, value: number[]) => {
    setStylePreferences(prev => ({
      ...prev,
      [preference]: value
    }));
  };

  const handleNext = () => {
    if (currentStep === 6) {
      // After step 6 (Review & Order), check authentication
      if (!user && !isLoading) {
        setCurrentStep(7); // Go to authentication step
      } else if (user) {
        setCurrentStep(8); // Skip to payment if already authenticated
      }
    } else if (currentStep === 7) {
      // After authentication step
      if (user) {
        setCurrentStep(8); // Go to payment
      } else {
        setAuthModalOpen(true); // Show auth modal
      }
    } else if (currentStep === 8) {
      // Payment step - open payment modal
      setPaymentModalOpen(true);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    if (currentStep === 8 && !user) {
      setCurrentStep(7); // Go back to auth step
    } else if (currentStep === 7) {
      setCurrentStep(6); // Go back to review
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setCurrentStep(8); // Go to payment after successful auth
    toast({
      title: "Welcome!",
      description: "You can now complete your order.",
    });
  };

  const handlePaymentComplete = () => {
    setPaymentModalOpen(false);
    onClose();
    // Reset form
    setCurrentStep(1);
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
    toast({
      title: "Order Complete!",
      description: "Your logo design project has been submitted successfully!",
    });
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return selectedPackage !== "";
      case 2: return selectedLogos.length > 0;
      case 3: return brandDetails.companyName.trim() !== "" && brandDetails.industry.trim() !== "";
      case 4: return true; // Style preferences are optional
      case 5: return selectedColors.length > 0;
      case 6: return true; // Review step
      case 7: return user !== null; // Authentication required
      case 8: return true; // Payment step
      default: return false;
    }
  };

  const collectOrderData = () => {
    return {
      servicePackage: servicePackage?.name,
      selectedPackage,
      selectedLogos: selectedLogos.map(id => logoDesigns.find(l => l.id === id)?.name).join(", "),
      selectedColors: selectedColors.map(id => colorPalettes.find(c => c.id === id)?.name).join(", "),
      brandDetails,
      stylePreferences
    };
  };

  if (!servicePackage) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {servicePackage.name}
              {currentStep >= 7 && <Lock className="h-4 w-4" />}
              {currentStep === 8 && <CreditCard className="h-4 w-4" />}
            </DialogTitle>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round((currentStep / steps.length) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="w-full" />
            
            {/* Step Indicators */}
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className={`flex flex-col items-center ${index < currentStep - 1 ? 'text-green-600' : index === currentStep - 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${index < currentStep - 1 ? 'bg-green-600 border-green-600 text-white' : index === currentStep - 1 ? 'border-blue-600 text-blue-600' : 'border-gray-300'}`}>
                    {index < currentStep - 1 ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="text-xs mt-1 text-center max-w-16">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {/* Step 1: Package Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Choose Your Package</h3>
                  <p className="text-gray-600 mb-6">You've selected the {servicePackage.name} package</p>
                </div>
                
                <Card className="border-2 border-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {servicePackage.name}
                      {servicePackage.isPopular && <Badge variant="secondary">Most Popular</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{servicePackage.description}</p>
                    <div className="space-y-2">
                      {servicePackage.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{servicePackage.price} KWD</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Design Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Choose Logo Styles You Like</h3>
                  <p className="text-gray-600 mb-6">Select one or more logo styles that appeal to you (you can select multiple)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {logoDesigns.map((logo) => (
                    <div
                      key={logo.id}
                      onClick={() => handleLogoToggle(logo.id)}
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                        selectedLogos.includes(logo.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={logo.image}
                        alt={logo.name}
                        className="w-full h-32 object-contain mb-4"
                      />
                      <h4 className="font-semibold text-center">{logo.name}</h4>
                      <p className="text-sm text-gray-600 text-center mt-2">{logo.style}</p>
                      {selectedLogos.includes(logo.id) && (
                        <div className="flex justify-center mt-3">
                          <Check className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
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
                  <p className="text-gray-600 mb-6">Help us understand your business to create the perfect logo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={brandDetails.companyName}
                      onChange={(e) => setBrandDetails(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Input
                      id="industry"
                      value={brandDetails.industry}
                      onChange={(e) => setBrandDetails(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g., Technology, Healthcare, Retail"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline (Optional)</Label>
                    <Input
                      id="tagline"
                      value={brandDetails.tagline}
                      onChange={(e) => setBrandDetails(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Your company tagline or slogan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      value={brandDetails.targetAudience}
                      onChange={(e) => setBrandDetails(prev => ({ ...prev, targetAudience: e.target.value }))}
                      placeholder="Who are your customers?"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={brandDetails.description}
                    onChange={(e) => setBrandDetails(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your business does, your mission, and what makes you unique"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitors">Competitors (Optional)</Label>
                  <Input
                    id="competitors"
                    value={brandDetails.competitors}
                    onChange={(e) => setBrandDetails(prev => ({ ...prev, competitors: e.target.value }))}
                    placeholder="List some of your main competitors"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Style Preferences */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Define Your Brand Personality</h3>
                  <p className="text-gray-600 mb-6">Use the sliders to show us where your brand fits on these scales</p>
                </div>

                <div className="space-y-8">
                  {[
                    { key: 'classicModern', left: 'Classic', right: 'Modern' },
                    { key: 'matureYouthful', left: 'Mature', right: 'Youthful' },
                    { key: 'feminineMasculine', left: 'Feminine', right: 'Masculine' },
                    { key: 'playfulSophisticated', left: 'Playful', right: 'Sophisticated' },
                    { key: 'economicalLuxurious', left: 'Economical', right: 'Luxurious' },
                    { key: 'geometricOrganic', left: 'Geometric', right: 'Organic' },
                    { key: 'abstractLiteral', left: 'Abstract', right: 'Literal' }
                  ].map((preference) => (
                    <div key={preference.key} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{preference.left}</span>
                        <span className="font-medium">{preference.right}</span>
                      </div>
                      <Slider
                        value={stylePreferences[preference.key as keyof typeof stylePreferences]}
                        onValueChange={(value) => handleSliderChange(preference.key, value)}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Color Selection */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Choose Your Color Palette</h3>
                  <p className="text-gray-600 mb-6">Select color palettes that reflect your brand (you can select multiple)</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {colorPalettes.map((palette) => (
                    <div
                      key={palette.id}
                      onClick={() => handleColorToggle(palette.id)}
                      className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                        selectedColors.includes(palette.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={palette.image}
                        alt={palette.name}
                        className="w-full h-16 object-cover rounded mb-2"
                      />
                      <h4 className="font-medium text-sm text-center">{palette.name}</h4>
                      <p className="text-xs text-gray-600 text-center mt-1">{palette.description}</p>
                      {selectedColors.includes(palette.id) && (
                        <div className="flex justify-center mt-2">
                          <Check className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
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
                  <p className="text-gray-600 mb-6">Please review your selections before proceeding to checkout</p>
                </div>

                <div className="space-y-6">
                  {/* Package Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Package: {servicePackage.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-600">{servicePackage.description}</p>
                          <div className="mt-2 space-y-1">
                            {servicePackage.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Check className="h-3 w-3 text-green-600" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">{servicePackage.price} KWD</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Selections Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Selected Logos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedLogos.length > 0 ? (
                          <div className="space-y-2">
                            {selectedLogos.map(logoId => {
                              const logo = logoDesigns.find(l => l.id === logoId);
                              return logo ? (
                                <div key={logoId} className="flex items-center gap-2">
                                  <Check className="h-4 w-4 text-green-600" />
                                  <span>{logo.name}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-500">No logos selected</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Selected Colors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedColors.length > 0 ? (
                          <div className="space-y-2">
                            {selectedColors.map(colorId => {
                              const color = colorPalettes.find(c => c.id === colorId);
                              return color ? (
                                <div key={colorId} className="flex items-center gap-2">
                                  <Check className="h-4 w-4 text-green-600" />
                                  <span>{color.name}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-500">No colors selected</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Brand Details Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Brand Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Company:</span> {brandDetails.companyName || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Industry:</span> {brandDetails.industry || "Not specified"}
                        </div>
                        {brandDetails.tagline && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Tagline:</span> {brandDetails.tagline}
                          </div>
                        )}
                        {brandDetails.description && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Description:</span> {brandDetails.description}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 7: Authentication */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Lock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Sign In to Continue</h3>
                  <p className="text-gray-600 mb-6">
                    {user ? "You're already signed in! Continue to payment." : "Please sign in to complete your order and track your project progress."}
                  </p>
                </div>

                {user ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="h-5 w-5 text-green-600" />
                          <span className="text-green-600 font-medium">Signed in as {user.email}</span>
                        </div>
                        <p className="text-gray-600">You can now proceed to payment to complete your order.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <p className="text-gray-600">Click the button below to sign in or create an account.</p>
                        <Button
                          onClick={() => setAuthModalOpen(true)}
                          className="w-full max-w-md"
                        >
                          Sign In / Sign Up
                        </Button>
                        <p className="text-xs text-gray-500">
                          Your progress will be saved and you can continue where you left off.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 8: Payment */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div className="text-center">
                  <CreditCard className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Ready for Payment</h3>
                  <p className="text-gray-600 mb-6">Complete your purchase to start your logo design project</p>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="text-3xl font-bold text-green-600">
                        {servicePackage.price} KWD
                      </div>
                      <p className="text-gray-600">
                        Click below to proceed to secure payment and complete your order.
                      </p>
                      <Button
                        onClick={() => setPaymentModalOpen(true)}
                        className="w-full max-w-md"
                        size="lg"
                      >
                        Proceed to Payment
                      </Button>
                      <p className="text-xs text-gray-500">
                        Secure payment powered by Tap Payments. Your information is protected.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex-1 text-center">
              <span className="text-sm text-gray-500">
                {currentStep === 7 && !user ? "Authentication required" :
                 currentStep === 8 ? "Ready for payment" :
                 `${steps[currentStep - 1]?.description}`}
              </span>
            </div>
            
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
              >
                {currentStep === 6 ? "Continue to Checkout" :
                 currentStep === 7 ? (user ? "Continue to Payment" : "Sign In Required") :
                 "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderData={collectOrderData()}
        servicePackage={servicePackage}
        onComplete={handlePaymentComplete}
        user={user || null}
      />
    </>
  );
}
