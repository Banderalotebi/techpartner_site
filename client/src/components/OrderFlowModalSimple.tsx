import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronRight } from "lucide-react";
import { ServicePackage } from "@shared/schema";

interface OrderFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicePackage: ServicePackage | null;
}

const steps = [
  { id: 1, title: "Package Selection", description: "Choose your design package" },
  { id: 2, title: "Brand Details", description: "Tell us about your brand" },
  { id: 3, title: "Review & Order", description: "Confirm and place your order" }
];

export default function OrderFlowModal({ isOpen, onClose, servicePackage }: OrderFlowModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [brandDetails, setBrandDetails] = useState({
    companyName: "",
    industry: "",
    description: ""
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
    setBrandDetails({
      companyName: "",
      industry: "",
      description: ""
    });
    onClose();
  };

  const handleBrandDetailsChange = (field: keyof typeof brandDetails, value: string) => {
    setBrandDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return brandDetails.companyName.trim() !== "";
      default:
        return true;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Logo Design Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
              <span className="text-sm text-gray-600">{steps[currentStep - 1]?.title}</span>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="w-full" />
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Package Selection</h3>
                  <p className="text-gray-600 mb-6">You've selected: {servicePackage?.name}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">{servicePackage?.name}</h4>
                  <p className="text-gray-600 mb-4">{servicePackage?.description}</p>
                  <div className="text-2xl font-bold text-[#01A1C1]">
                    {servicePackage?.price} SAR
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tell us about your brand</h3>
                  <p className="text-gray-600 mb-6">Share some details about your business to help us create the perfect logo.</p>
                </div>
                
                <div className="space-y-6">
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
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Brand Description</label>
                    <textarea 
                      value={brandDetails.description}
                      onChange={(e) => handleBrandDetailsChange('description', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                      placeholder="Describe your brand, values, and what makes you unique..."
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Review & Order</h3>
                  <p className="text-gray-600 mb-6">Review your order details before proceeding.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-4">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span>{servicePackage?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Company:</span>
                        <span>{brandDetails.companyName || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Industry:</span>
                        <span>{brandDetails.industry || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-[#01A1C1]">{servicePackage?.price} SAR</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-700">Your order has been prepared successfully!</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={currentStep === 1 ? handleClose : handleBack}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
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