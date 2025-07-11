import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface WebDesignQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicePackage?: any;
}

type WebsitePurpose = 
  | 'promote-business'
  | 'advertise-inform'
  | 'sell-online'
  | 'e-commerce'
  | 'share-ideas'
  | 'blog'
  | 'showcase-work'
  | 'portfolio'
  | 'promote-product'
  | 'marketing-page'
  | 'get-online'
  | 'other';

interface QuestionnaireData {
  websitePurpose: WebsitePurpose | null;
  businessName: string;
  industry: string;
  businessDescription: string;
  designPreference: 'card-a' | 'card-b' | null;
  features?: string[];
}

export function WebDesignQuestionnaireModal({ 
  isOpen, 
  onClose, 
  servicePackage 
}: WebDesignQuestionnaireModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
    websitePurpose: null,
    businessName: "",
    industry: "",
    businessDescription: "",
    designPreference: null,
    features: [],
  });

  const totalSteps = 5;

  const websitePurposeOptions = [
    {
      id: 'promote-business' as WebsitePurpose,
      title: 'Promote my business',
      description: 'Create an online presence for your business'
    },
    {
      id: 'advertise-inform' as WebsitePurpose,
      title: 'Advertise or inform',
      description: 'Share information and advertise services'
    },
    {
      id: 'sell-online' as WebsitePurpose,
      title: 'Sell things online',
      description: 'Set up an online store to sell products'
    },
    {
      id: 'e-commerce' as WebsitePurpose,
      title: 'E-commerce',
      description: 'Full e-commerce platform with payment processing'
    },
    {
      id: 'share-ideas' as WebsitePurpose,
      title: 'Share ideas',
      description: 'Platform for sharing thoughts and concepts'
    },
    {
      id: 'blog' as WebsitePurpose,
      title: 'Blog',
      description: 'Create a blog or content publishing site'
    },
    {
      id: 'showcase-work' as WebsitePurpose,
      title: 'Showcase work',
      description: 'Display your work and achievements'
    },
    {
      id: 'portfolio' as WebsitePurpose,
      title: 'Portfolio',
      description: 'Professional portfolio website'
    },
    {
      id: 'promote-product' as WebsitePurpose,
      title: 'Promote a product or service',
      description: 'Marketing website for specific offerings'
    },
    {
      id: 'marketing-page' as WebsitePurpose,
      title: 'Marketing page',
      description: 'Landing page for marketing campaigns'
    },
    {
      id: 'get-online' as WebsitePurpose,
      title: 'Get online',
      description: 'Basic website to establish online presence'
    },
    {
      id: 'other' as WebsitePurpose,
      title: 'Other',
      description: 'Custom requirements or unique purpose'
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePurposeSelect = (purpose: WebsitePurpose) => {
    setQuestionnaireData({
      ...questionnaireData,
      websitePurpose: purpose
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return questionnaireData.websitePurpose !== null;
      case 2:
        return questionnaireData.businessName.trim() !== "" && 
               questionnaireData.industry !== "";
      case 3:
        return questionnaireData.designPreference !== null;
      default:
        return true;
    }
  };

  const handleInputChange = (field: keyof QuestionnaireData, value: string) => {
    setQuestionnaireData({
      ...questionnaireData,
      [field]: value
    });
  };

  const handleDesignPreferenceSelect = (preference: 'card-a' | 'card-b') => {
    setQuestionnaireData({
      ...questionnaireData,
      designPreference: preference
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'What is the primary goal of your website?';
      case 2:
        return 'Tell us about your business';
      case 3:
        return 'Design preferences';
      case 4:
        return 'Features & functionality';
      case 5:
        return 'Review & submit';
      default:
        return 'Web Design Questionnaire';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                The primary goal of this website is to
              </h3>
              <p className="text-gray-600">
                Select the option that best describes what you want to achieve with your website
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {websitePurposeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handlePurposeSelect(option.id)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md
                    ${questionnaireData.websitePurpose === option.id
                      ? 'border-[#01A1C1] bg-[#01A1C1]/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {option.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    {questionnaireData.websitePurpose === option.id && (
                      <Check className="w-5 h-5 text-[#01A1C1] ml-2 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-left mb-8">
              <p className="text-gray-600 text-lg mb-2">I am creating this website for <span className="text-[#01A1C1] font-medium">my self</span></p>
              <p className="text-gray-600 text-lg mb-6">
                The primary goal of this website is to <span className="text-[#01A1C1] font-medium">
                  {websitePurposeOptions.find(opt => opt.id === questionnaireData.websitePurpose)?.title?.toLowerCase() || 'promote my business'}
                </span>
              </p>
              <p className="text-gray-900 text-lg font-medium">
                For a website within the <span className="text-[#01A1C1]">accounting & financial</span> industry
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <select 
                  value={questionnaireData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent text-lg bg-white"
                  style={{ minHeight: '60px' }}
                >
                  <option value="">Select your industry</option>
                  <option value="accounting-finance">Accounting and Finance</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="legal">Legal Services</option>
                  <option value="retail">Retail</option>
                  <option value="education">Education</option>
                  <option value="food-beverage">Food & Beverage</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="consulting">Consulting</option>
                  <option value="creative">Creative & Design</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="construction">Construction</option>
                  <option value="transportation">Transportation</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="non-profit">Non-Profit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {questionnaireData.industry && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={questionnaireData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={questionnaireData.businessDescription}
                      onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                      placeholder="Briefly describe what your business does..."
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Design Preferences
              </h3>
              <p className="text-gray-600 text-lg">
                Choose the design direction that best matches your vision
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card A */}
              <button
                onClick={() => handleDesignPreferenceSelect('card-a')}
                className={`
                  group relative p-8 rounded-lg border-2 transition-all duration-200 hover:shadow-xl
                  ${questionnaireData.designPreference === 'card-a'
                    ? 'border-[#01A1C1] bg-[#01A1C1]/5 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="text-center space-y-6">
                  {/* Icon placeholder matching Figma */}
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2z"/>
                    </svg>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Card A</h4>
                    <p className="text-gray-600">
                      Clean and minimalist design with modern typography and spacious layouts. 
                      Perfect for professional services and corporate businesses.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500 font-medium">Features:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Minimalist layout</li>
                      <li>• Professional typography</li>
                      <li>• Clean navigation</li>
                      <li>• Corporate colors</li>
                    </ul>
                  </div>
                </div>
                
                {questionnaireData.designPreference === 'card-a' && (
                  <div className="absolute top-4 right-4">
                    <Check className="w-6 h-6 text-[#01A1C1]" />
                  </div>
                )}
              </button>

              {/* Card B */}
              <button
                onClick={() => handleDesignPreferenceSelect('card-b')}
                className={`
                  group relative p-8 rounded-lg border-2 transition-all duration-200 hover:shadow-xl
                  ${questionnaireData.designPreference === 'card-b'
                    ? 'border-[#01A1C1] bg-[#01A1C1]/5 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="text-center space-y-6">
                  {/* Icon placeholder matching Figma */}
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm3 3h8v2H8V8zm0 4h6v2H8v-2z"/>
                    </svg>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Card B</h4>
                    <p className="text-gray-600">
                      Creative and dynamic design with bold colors and engaging visuals. 
                      Ideal for creative agencies, startups, and innovative businesses.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500 font-medium">Features:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Creative layouts</li>
                      <li>• Bold typography</li>
                      <li>• Interactive elements</li>
                      <li>• Vibrant colors</li>
                    </ul>
                  </div>
                </div>
                
                {questionnaireData.designPreference === 'card-b' && (
                  <div className="absolute top-4 right-4">
                    <Check className="w-6 h-6 text-[#01A1C1]" />
                  </div>
                )}
              </button>
            </div>
            
            {questionnaireData.designPreference && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Great choice! This design direction will guide our team in creating your website.
                </p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Features & Functionality
              </h3>
              <p className="text-gray-600">
                What features do you need for your website?
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'contact-form', label: 'Contact Form', description: 'Allow visitors to contact you' },
                { id: 'online-booking', label: 'Online Booking', description: 'Schedule appointments online' },
                { id: 'e-commerce', label: 'E-commerce', description: 'Sell products online' },
                { id: 'blog', label: 'Blog', description: 'Content management system' },
                { id: 'gallery', label: 'Photo Gallery', description: 'Showcase your work' },
                { id: 'social-media', label: 'Social Media Integration', description: 'Connect your social accounts' },
                { id: 'analytics', label: 'Analytics', description: 'Track website performance' },
                { id: 'seo', label: 'SEO Optimization', description: 'Search engine optimization' }
              ].map((feature) => (
                <div
                  key={feature.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    (questionnaireData.features || []).includes(feature.id)
                      ? 'border-[#01A1C1] bg-[#01A1C1]/10'
                      : 'border-gray-200 hover:border-[#01A1C1]'
                  }`}
                  onClick={() => {
                    const currentFeatures = questionnaireData.features || [];
                    const newFeatures = currentFeatures.includes(feature.id)
                      ? currentFeatures.filter(f => f !== feature.id)
                      : [...currentFeatures, feature.id];
                    
                    setQuestionnaireData({
                      ...questionnaireData,
                      features: newFeatures
                    });
                  }}
                >
                  <h4 className="font-medium text-gray-900">{feature.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Review & Submit
              </h3>
              <p className="text-gray-600">
                Review your requirements and submit your web design project
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Project Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Website Purpose:</span>
                  <span className="font-medium">
                    {websitePurposeOptions.find(opt => opt.id === questionnaireData.websitePurpose)?.title || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Industry:</span>
                  <span className="font-medium">{questionnaireData.industry || 'Not selected'}</span>
                </div>
                {questionnaireData.businessName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Name:</span>
                    <span className="font-medium">{questionnaireData.businessName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Design Direction:</span>
                  <span className="font-medium">
                    {questionnaireData.designPreference === 'card-a' ? 'Card A - Minimalist & Professional' : 
                     questionnaireData.designPreference === 'card-b' ? 'Card B - Creative & Dynamic' : 'Not selected'}
                  </span>
                </div>
                {(questionnaireData.features || []).length > 0 && (
                  <div>
                    <span className="text-gray-600">Selected Features:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(questionnaireData.features || []).map(featureId => (
                        <span key={featureId} className="px-3 py-1 bg-[#01A1C1]/10 text-[#01A1C1] rounded-full text-sm">
                          {featureId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Package:</span>
                  <span className="font-medium">{servicePackage?.name}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Web Design Questionnaire</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>

          {/* Step Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {getStepTitle()}
            </h2>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onClose : handlePrevious}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentStep === 1 ? 'Cancel' : 'Previous'}</span>
            </Button>

            <div className="flex items-center space-x-2">
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2 bg-[#01A1C1] hover:bg-[#0891B2] text-white"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    // Handle final submission with better success message
                    const selectedFeatures = (questionnaireData.features || []).length;
                    const businessInfo = questionnaireData.businessName ? `for ${questionnaireData.businessName}` : '';
                    const successMessage = `✅ Web Design Project ${businessInfo} submitted successfully!\n\n🎯 Purpose: ${websitePurposeOptions.find(opt => opt.id === questionnaireData.websitePurpose)?.title}\n🎨 Design: ${questionnaireData.designPreference === 'card-a' ? 'Minimalist & Professional' : 'Creative & Dynamic'}\n⚡ Features: ${selectedFeatures} selected\n💰 Service: ${servicePackage?.name} - ${servicePackage?.price} SAR\n\n📧 Our team will contact you within 24 hours to begin your project!`;
                    
                    console.log('Submitting web design questionnaire:', questionnaireData);
                    alert(successMessage);
                    onClose();
                  }}
                  className="bg-[#01A1C1] hover:bg-[#0891B2] text-white shadow-lg hover:shadow-xl"
                >
                  🚀 Submit Web Design Project
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}