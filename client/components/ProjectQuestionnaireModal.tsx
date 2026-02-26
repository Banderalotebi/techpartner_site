import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ServicePackage, InsertProjectBrief } from "@shared/schema";
import { insertProjectBriefSchema } from "@shared/schema";

interface ProjectQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: ServicePackage | null;
}

const formSchema = insertProjectBriefSchema.extend({
  deadline: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const designStyles = [
  { value: "modern", label: "Modern", icon: "🎨" },
  { value: "classic", label: "Classic", icon: "🏛️" },
  { value: "bold", label: "Bold", icon: "⚡" },
  { value: "playful", label: "Playful", icon: "🎪" },
];

export default function ProjectQuestionnaireModal({ 
  isOpen, 
  onClose, 
  selectedPackage 
}: ProjectQuestionnaireModalProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageId: selectedPackage?.id || 0,
      companyName: "",
      industry: "",
      description: "",
      designStyle: "",
      colors: "",
      budget: "",
      deadline: "",
      email: "",
      requirements: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertProjectBrief) => {
      const response = await apiRequest("POST", "/api/project-briefs", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Brief Submitted",
        description: "We'll contact you within 24 hours to discuss your project.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/project-briefs"] });
      form.reset();
      setSelectedStyle("");
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your project brief. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to submit project brief:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    if (!selectedPackage) {
      toast({
        title: "No Package Selected",
        description: "Please select a package before submitting.",
        variant: "destructive",
      });
      return;
    }

    const submitData: InsertProjectBrief = {
      ...data,
      packageId: selectedPackage.id,
      designStyle: selectedStyle || data.designStyle,
    };

    mutation.mutate(submitData);
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      form.reset();
      setSelectedStyle("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-medium text-black">
            Project Details
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {selectedPackage && (
              <div className="bg-warm-white p-4 rounded-lg">
                <h3 className="font-medium text-charcoal mb-2">Selected Package:</h3>
                <p className="text-lg font-semibold text-black">{selectedPackage.name}</p>
                <p className="text-coral font-medium">{selectedPackage.price.toLocaleString()} SAR</p>
              </div>
            )}

            {/* Project Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-charcoal">Tell us about your project</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal font-medium">Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal font-medium">Industry *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-charcoal font-medium">Project Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4} 
                        placeholder="Describe your project goals and vision..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Design Preferences */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-charcoal">Design Preferences</h3>
              
              <div>
                <label className="block text-charcoal font-medium mb-4">
                  Select mood/style that appeals to you
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {designStyles.map((style) => (
                    <div
                      key={style.value}
                      className={`relative cursor-pointer group border-2 rounded-lg p-4 transition-all ${
                        selectedStyle === style.value
                          ? "border-tech-blue bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedStyle(style.value)}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{style.icon}</div>
                        <p className="text-charcoal font-medium">{style.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal font-medium">Preferred Colors</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Blue, Green, Corporate colors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal font-medium">Budget Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1000-3000">1,000 - 3,000 SAR</SelectItem>
                          <SelectItem value="3000-6000">3,000 - 6,000 SAR</SelectItem>
                          <SelectItem value="6000-15000">6,000 - 15,000 SAR</SelectItem>
                          <SelectItem value="15000+">15,000+ SAR</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Project Timeline & Contact */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-charcoal">Timeline & Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal font-medium">Project Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal font-medium">Contact Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-charcoal font-medium">Additional Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3} 
                        placeholder="Any specific requirements, inspirations, or guidelines..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Upload Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-charcoal font-medium mb-3">Add inspiration files</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <div className="text-gray-500 mb-2">📁</div>
                    <p className="text-gray-600 text-sm">Drag & drop your files here</p>
                    <p className="text-gray-500 text-xs mt-2">or click to browse</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-charcoal font-medium mb-3">Add reference files</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <div className="text-gray-500 mb-2">📁</div>
                    <p className="text-gray-600 text-sm">Drag & drop your files here</p>
                    <p className="text-gray-500 text-xs mt-2">or click to browse</p>
                  </div>
                </div>
              </div>

              {/* Web Inspiration Link */}
              <div>
                <label className="block text-charcoal font-medium mb-3">Link to any inspiration on the Web</label>
                <input 
                  type="url" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/inspiration"
                />
              </div>

              {/* Print Options */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-charcoal mb-4">Print Options</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="techPrinter" className="rounded" />
                    <label htmlFor="techPrinter" className="text-charcoal">Print with Tech Printer</label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="notPrinting" className="rounded" defaultChecked />
                    <label htmlFor="notPrinting" className="text-charcoal">I am not printing with Tech Printer.</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Size</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Select size</option>
                      <option>A4</option>
                      <option>A5</option>
                      <option>Letter</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Orientation</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Select orientation</option>
                      <option>Portrait</option>
                      <option>Landscape</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Fold</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Select fold</option>
                      <option>No fold</option>
                      <option>Bi-fold</option>
                      <option>Tri-fold</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-tech-blue text-white hover:bg-blue-600"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Submitting..." : "Submit Project Brief"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
