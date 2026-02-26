import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertQuizResponse } from "@shared/schema";
import { insertQuizResponseSchema } from "@shared/schema";

interface BrandQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = insertQuizResponseSchema;
type FormData = z.infer<typeof formSchema>;

export default function BrandQuizModal({ isOpen, onClose }: BrandQuizModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    creatingFor: "",
    websiteGoal: "",
    industry: "",
    brandingNeeds: "",
    promotion: "",
    businessType: "",
    goal: "",
    audience: "",
    email: "",
  });
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: "",
      goal: "",
      audience: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertQuizResponse) => {
      const response = await apiRequest("POST", "/api/quiz-responses", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Quiz Completed!",
        description: "Thank you for completing our quiz! Check your email for personalized recommendations.",
      });
      
      // Show recommendations if available
      if (data.recommendations && data.recommendations.length > 0) {
        toast({
          title: "Recommendations Ready",
          description: `We recommend: ${data.recommendations.join(", ")}`,
        });
      }
      
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your quiz. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to submit quiz:", error);
    },
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = (data: FormData) => {
    const finalData = {
      ...data,
      businessType: formData.businessType || data.businessType,
      goal: formData.goal || data.goal,
      audience: formData.audience || data.audience,
    };
    mutation.mutate(finalData);
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      setCurrentStep(1);
      setFormData({
        creatingFor: "",
        websiteGoal: "",
        industry: "",
        brandingNeeds: "",
        promotion: "",
        businessType: "",
        goal: "",
        audience: "",
        email: "",
      });
      form.reset();
      onClose();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black mb-6">
              I am creating this website for
            </h2>
            <div className="space-y-4">
              {["Myself", "Someone else", "a business or project I run", "a client or business that I work for"].map((option) => (
                <div
                  key={option}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.creatingFor === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('creatingFor', option)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.creatingFor === option ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}></div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black mb-6">
              The primary goal of this website is to
            </h2>
            <div className="space-y-4">
              {[
                "promote my business",
                "Sell things online (eCommerce)",
                "Showcase work (Portfolio)",
                "Share ideas (Blog)",
                "Learning material (Educational)"
              ].map((option) => (
                <div
                  key={option}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.websiteGoal === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('websiteGoal', option)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.websiteGoal === option ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}></div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black mb-6">
              Which best describes your branding needs?
            </h2>
            <div className="space-y-4">
              {[
                "I want to create new branding from scratch",
                "I have existing branding that I would like to update or extend"
              ].map((option) => (
                <div
                  key={option}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.brandingNeeds === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('brandingNeeds', option)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.brandingNeeds === option ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}></div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <label className="block text-lg font-medium text-black mb-4">
                My business is in the _____ industry
              </label>
              <Select onValueChange={(value) => updateFormData('industry', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accounting">Accounting & Financial</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black mb-6">
              How will you promote your brand?
            </h2>
            <div className="space-y-4">
              {[
                "Primarily Online",
                "Primarily Offline", 
                "Both"
              ].map((option) => (
                <div
                  key={option}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.promotion === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('promotion', option)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.promotion === option ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}></div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-black mb-4">
                Colors and fonts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Brand guidelines",
                  "Business cards", 
                  "Website",
                  "Product packaging",
                  "Brochures",
                  "Social media",
                  "Stationery",
                  "Product labels",
                  "Signage",
                  "Other"
                ].map((item) => (
                  <div key={item} className="p-3 border border-gray-200 rounded-lg text-center cursor-pointer hover:border-gray-300">
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black mb-6">
              Your recommendation is based on these details:
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-3 text-sm text-gray-700">
                <div><strong>Creating for:</strong> {formData.creatingFor}</div>
                <div><strong>Website goal:</strong> {formData.websiteGoal}</div>
                <div><strong>Industry:</strong> {formData.industry}</div>
                <div><strong>Branding needs:</strong> {formData.brandingNeeds}</div>
                <div><strong>Promotion:</strong> {formData.promotion}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                { title: "Logo and brand identity pack", price: "from £489", description: "A logo plus digital and print essentials to kick-start your brand" },
                { title: "Business Card", price: "from £169", description: "A unique business card designed to build connections" },
                { title: "Brochure", price: "from £249", description: "A custom brochure designed for your business" }
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-black mb-2">{item.title}</h3>
                  <p className="text-blue-600 font-medium mb-3">{item.price}</p>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <Button className="w-full" style={{ backgroundColor: '#01a1c1' }}>
                    Get quote
                  </Button>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Questions? We've got the answers</p>
              <p className="text-lg font-medium">+44 20 3319 6464 Free design consultation</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-medium text-black">
            {currentStep === 5 ? "Your Recommendations" : "Brand Discovery Quiz"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {/* Progress indicator */}
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline"
              onClick={currentStep === 1 ? handleClose : handleBack}
              disabled={mutation.isPending}
            >
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>

            {currentStep < 5 ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !formData.creatingFor) ||
                  (currentStep === 2 && !formData.websiteGoal) ||
                  (currentStep === 3 && (!formData.brandingNeeds || !formData.industry)) ||
                  (currentStep === 4 && !formData.promotion)
                }
                style={{ backgroundColor: '#01a1c1' }}
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleClose}
                style={{ backgroundColor: '#01a1c1' }}
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
