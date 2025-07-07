import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Upload, Check } from "lucide-react";

interface WebDevelopmentQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicePackage?: any;
}

interface ProjectData {
  // Step 1: Project Info
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  preferredLanguage: 'ar' | 'en';
  projectType: 'website' | 'web-app' | 'e-commerce' | 'landing-page';
  hasDomain: boolean;
  domainName: string;

  // Step 2: Project Idea
  mainGoal: string;
  targetAudience: string;
  inspirationSites: string;
  projectScope: 'redesign' | 'new';
  successCriteria: string;

  // Step 3: Project Stack
  preferredTechStack: string;
  needsBackend: boolean;
  needsCMS: boolean;
  cmsChoice: string;
  needsAuth: boolean;
  integrations: string;

  // Step 4: Features & Requirements
  estimatedPages: string;
  needsForms: boolean;
  needsAdmin: boolean;
  needsMultiLanguage: boolean;
  accessibilityRequirements: string;

  // Step 5: Guidelines & Assets
  hasBrandGuidelines: boolean;
  designStyle: string;
  colorPreferences: string;
  hasAssets: boolean;

  // Step 6: User Flows & Pages
  hasSitemap: boolean;
  userFlow: string;
  needsWireframes: boolean;
  needsAnimations: boolean;
  animationDetails: string;

  // Step 7: Budget & Timeline
  budgetRange: '25000' | '35000' | '45000' | 'custom';
  launchDate: string;
  isUrgent: boolean;
  needsMaintenance: boolean;
}

const webDevPackages = [
  {
    id: 'starter',
    name: 'Starter Site',
    price: 25000,
    target: 'Small businesses / Startups',
    features: [
      'Custom UI design (Figma or Adobe XD)',
      '5 static pages (HTML/CSS/JS)',
      'Mobile responsive',
      'Contact form',
      'Hosting setup & deployment'
    ],
    useCase: 'Portfolio, brochure, personal brand'
  },
  {
    id: 'business',
    name: 'Business Pro',
    price: 35000,
    target: 'SMEs / Growing companies', 
    features: [
      'Everything in Starter Site',
      'Up to 10 pages',
      'CMS integration (WordPress, Sanity, or Strapi)',
      'Admin dashboard (basic)',
      'SEO optimization',
      'Custom animations or transitions'
    ],
    useCase: 'Service websites, marketing pages, blogs'
  },
  {
    id: 'premium',
    name: 'Premium Build',
    price: 45000,
    target: 'Corporates / High-end clients',
    features: [
      'Everything in Business Pro',
      'Full-stack web app',
      'Custom backend (Node.js / Express / DB)',
      'Login/Auth integration',
      'Multi-language support',
      'Advanced admin panel',
      'API integration',
      'Performance optimization'
    ],
    useCase: 'Complex platforms, SaaS apps, enterprise sites'
  }
];

export function WebDevelopmentQuestionnaireModal({ 
  isOpen, 
  onClose, 
  servicePackage 
}: WebDevelopmentQuestionnaireModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    preferredLanguage: 'en',
    projectType: 'website',
    hasDomain: false,
    domainName: '',
    mainGoal: '',
    targetAudience: '',
    inspirationSites: '',
    projectScope: 'new',
    successCriteria: '',
    preferredTechStack: '',
    needsBackend: false,
    needsCMS: false,
    cmsChoice: '',
    needsAuth: false,
    integrations: '',
    estimatedPages: '',
    needsForms: false,
    needsAdmin: false,
    needsMultiLanguage: false,
    accessibilityRequirements: '',
    hasBrandGuidelines: false,
    designStyle: '',
    colorPreferences: '',
    hasAssets: false,
    hasSitemap: false,
    userFlow: '',
    needsWireframes: false,
    needsAnimations: false,
    animationDetails: '',
    budgetRange: '25000',
    launchDate: '',
    isUrgent: false,
    needsMaintenance: false
  });

  const totalSteps = 8;

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

  const handleInputChange = (field: keyof ProjectData, value: any) => {
    setProjectData({
      ...projectData,
      [field]: value
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return projectData.companyName.trim() !== '' && 
               projectData.contactPerson.trim() !== '' && 
               projectData.email.trim() !== '';
      case 2:
        return projectData.mainGoal.trim() !== '' && 
               projectData.targetAudience.trim() !== '';
      case 7:
        return projectData.budgetRange !== '' && 
               projectData.launchDate !== '';
      default:
        return true;
    }
  };

  const getRecommendedPackage = () => {
    const { budgetRange, needsBackend, needsAuth, needsCMS, estimatedPages } = projectData;
    const pageCount = parseInt(estimatedPages) || 0;
    
    if (budgetRange === '45000' || needsAuth || needsBackend || pageCount > 10) {
      return webDevPackages[2]; // Premium
    } else if (budgetRange === '35000' || needsCMS || pageCount > 5) {
      return webDevPackages[1]; // Business
    } else {
      return webDevPackages[0]; // Starter
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Project Information';
      case 2: return 'Project Vision';
      case 3: return 'Technical Requirements';
      case 4: return 'Features & Functionality';
      case 5: return 'Design & Brand Assets';
      case 6: return 'User Experience & Flow';
      case 7: return 'Budget & Timeline';
      case 8: return 'Review & Submit';
      default: return 'Web Development Questionnaire';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company / Brand Name *</label>
                <input
                  type="text"
                  value={projectData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                  placeholder="Enter company or brand name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Contact Person *</label>
                <input
                  type="text"
                  value={projectData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={projectData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={projectData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                  placeholder="+966 50 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Language</label>
                <select
                  value={projectData.preferredLanguage}
                  onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Type</label>
                <select
                  value={projectData.projectType}
                  onChange={(e) => handleInputChange('projectType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                >
                  <option value="website">Website</option>
                  <option value="web-app">Web Application</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="landing-page">Landing Page</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hasDomain"
                  checked={projectData.hasDomain}
                  onChange={(e) => handleInputChange('hasDomain', e.target.checked)}
                  className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                />
                <label htmlFor="hasDomain" className="text-sm font-medium">I already have a domain</label>
              </div>
              
              {projectData.hasDomain && (
                <div>
                  <label className="block text-sm font-medium mb-2">Domain Name</label>
                  <input
                    type="text"
                    value={projectData.domainName}
                    onChange={(e) => handleInputChange('domainName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                    placeholder="example.com"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">What is the main goal of this project? *</label>
              <textarea
                value={projectData.mainGoal}
                onChange={(e) => handleInputChange('mainGoal', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent resize-none"
                placeholder="Describe the primary purpose and objectives of your website/application..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Who is your target audience? *</label>
              <textarea
                value={projectData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent resize-none"
                placeholder="Describe your ideal users, customers, or visitors..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Do you have examples or inspiration sites?</label>
              <textarea
                value={projectData.inspirationSites}
                onChange={(e) => handleInputChange('inspirationSites', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent resize-none"
                placeholder="Share URLs of websites you like or that inspire you..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Project Scope</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'new', label: 'Build from Scratch', desc: 'Complete new development' },
                  { value: 'redesign', label: 'Redesign Existing', desc: 'Update current website' }
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      projectData.projectScope === option.value
                        ? 'border-[#01A1C1] bg-[#01A1C1]/10'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => handleInputChange('projectScope', option.value)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{option.label}</h4>
                      {projectData.projectScope === option.value && (
                        <Check className="w-5 h-5 text-[#01A1C1]" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{option.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">What would success look like?</label>
              <textarea
                value={projectData.successCriteria}
                onChange={(e) => handleInputChange('successCriteria', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent resize-none"
                placeholder="How will you measure if this project is successful? (e.g., increased sales, more inquiries, better user engagement...)"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Do you have a preferred tech stack?</label>
              <input
                type="text"
                value={projectData.preferredTechStack}
                onChange={(e) => handleInputChange('preferredTechStack', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                placeholder="e.g., React, WordPress, Next.js, or leave blank for our recommendation"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="needsBackend"
                    checked={projectData.needsBackend}
                    onChange={(e) => handleInputChange('needsBackend', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="needsBackend" className="text-sm font-medium">Need a backend/database</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="needsCMS"
                    checked={projectData.needsCMS}
                    onChange={(e) => handleInputChange('needsCMS', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="needsCMS" className="text-sm font-medium">Need content management system</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="needsAuth"
                    checked={projectData.needsAuth}
                    onChange={(e) => handleInputChange('needsAuth', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="needsAuth" className="text-sm font-medium">Need user authentication/login</label>
                </div>
              </div>

              <div>
                {projectData.needsCMS && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred CMS</label>
                    <select
                      value={projectData.cmsChoice}
                      onChange={(e) => handleInputChange('cmsChoice', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                    >
                      <option value="">Choose CMS</option>
                      <option value="wordpress">WordPress</option>
                      <option value="sanity">Sanity</option>
                      <option value="strapi">Strapi</option>
                      <option value="contentful">Contentful</option>
                      <option value="other">Other / Your choice</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Any integrations needed?</label>
              <textarea
                value={projectData.integrations}
                onChange={(e) => handleInputChange('integrations', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent resize-none"
                placeholder="e.g., Payment gateways (Stripe, PayPal), Email services (Mailchimp), APIs, Social media, Analytics..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">How many pages do you estimate?</label>
                <input
                  type="number"
                  value={projectData.estimatedPages}
                  onChange={(e) => handleInputChange('estimatedPages', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                  placeholder="e.g., 5"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Accessibility Requirements</label>
                <input
                  type="text"
                  value={projectData.accessibilityRequirements}
                  onChange={(e) => handleInputChange('accessibilityRequirements', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                  placeholder="WCAG compliance, screen reader support, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="needsForms"
                    checked={projectData.needsForms}
                    onChange={(e) => handleInputChange('needsForms', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="needsForms" className="text-sm font-medium">Forms or contact submissions</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="needsAdmin"
                    checked={projectData.needsAdmin}
                    onChange={(e) => handleInputChange('needsAdmin', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="needsAdmin" className="text-sm font-medium">Admin or dashboard features</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="needsMultiLanguage"
                    checked={projectData.needsMultiLanguage}
                    onChange={(e) => handleInputChange('needsMultiLanguage', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="needsMultiLanguage" className="text-sm font-medium">Multi-language support</label>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasBrandGuidelines"
                    checked={projectData.hasBrandGuidelines}
                    onChange={(e) => handleInputChange('hasBrandGuidelines', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="hasBrandGuidelines" className="text-sm font-medium">I have brand guidelines or assets</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasAssets"
                    checked={projectData.hasAssets}
                    onChange={(e) => handleInputChange('hasAssets', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="hasAssets" className="text-sm font-medium">Logo and images are ready</label>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload brand guidelines, logos, or reference materials</p>
                <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG, AI files accepted</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preferred design style</label>
              <input
                type="text"
                value={projectData.designStyle}
                onChange={(e) => handleInputChange('designStyle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                placeholder="e.g., Modern and clean, Professional, Creative and bold, Minimalist..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color preferences</label>
              <input
                type="text"
                value={projectData.colorPreferences}
                onChange={(e) => handleInputChange('colorPreferences', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                placeholder="e.g., Blue and white, Corporate colors, Bright and vibrant, Earth tones..."
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasSitemap"
                    checked={projectData.hasSitemap}
                    onChange={(e) => handleInputChange('hasSitemap', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="hasSitemap" className="text-sm font-medium">I have a sitemap or flowchart</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="needsWireframes"
                    checked={projectData.needsWireframes}
                    onChange={(e) => handleInputChange('needsWireframes', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="needsWireframes" className="text-sm font-medium">I want help with wireframes</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="needsAnimations"
                    checked={projectData.needsAnimations}
                    onChange={(e) => handleInputChange('needsAnimations', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="needsAnimations" className="text-sm font-medium">I want animation or transition effects</label>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload sitemap, flowchart, or wireframes</p>
                <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG, Sketch files accepted</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Describe typical user flow</label>
              <textarea
                value={projectData.userFlow}
                onChange={(e) => handleInputChange('userFlow', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent resize-none"
                placeholder="Describe how users will navigate through your website. What's the primary path from landing to conversion?"
              />
            </div>

            {projectData.needsAnimations && (
              <div>
                <label className="block text-sm font-medium mb-2">Animation details</label>
                <textarea
                  value={projectData.animationDetails}
                  onChange={(e) => handleInputChange('animationDetails', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent resize-none"
                  placeholder="Describe what type of animations you want: hover effects, page transitions, loading animations, etc."
                />
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Budget Range *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {webDevPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      projectData.budgetRange === pkg.price.toString()
                        ? 'border-[#01A1C1] bg-[#01A1C1]/10'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => handleInputChange('budgetRange', pkg.price.toString())}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{pkg.name}</h4>
                      {projectData.budgetRange === pkg.price.toString() && (
                        <Check className="w-5 h-5 text-[#01A1C1]" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-[#01A1C1] mb-2">{pkg.price.toLocaleString()} SAR</p>
                    <p className="text-sm text-gray-600 mb-3">{pkg.target}</p>
                    <p className="text-xs text-gray-500">{pkg.useCase}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Launch Date *</label>
                <input
                  type="date"
                  value={projectData.launchDate}
                  onChange={(e) => handleInputChange('launchDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={projectData.isUrgent}
                    onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="isUrgent" className="text-sm font-medium">This is urgent</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="needsMaintenance"
                    checked={projectData.needsMaintenance}
                    onChange={(e) => handleInputChange('needsMaintenance', e.target.checked)}
                    className="w-4 h-4 text-[#01A1C1] focus:ring-[#01A1C1] border-gray-300 rounded"
                  />
                  <label htmlFor="needsMaintenance" className="text-sm font-medium">Need ongoing maintenance</label>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        const recommendedPackage = getRecommendedPackage();
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-4">🎯 Recommended Package</h4>
              <div className="bg-white p-4 rounded-lg border border-green-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-bold text-lg">{recommendedPackage.name}</h5>
                    <p className="text-sm text-gray-600">{recommendedPackage.target}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#01A1C1]">{recommendedPackage.price.toLocaleString()} SAR</p>
                    {projectData.isUrgent && <p className="text-sm text-orange-600">+Rush fee may apply</p>}
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  {recommendedPackage.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-4">📋 Project Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Company:</span>
                  <p className="text-blue-800">{projectData.companyName}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Project Type:</span>
                  <p className="text-blue-800 capitalize">{projectData.projectType.replace('-', ' ')}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Estimated Pages:</span>
                  <p className="text-blue-800">{projectData.estimatedPages || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Launch Date:</span>
                  <p className="text-blue-800">{projectData.launchDate || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Technical Needs:</span>
                  <p className="text-blue-800">
                    {[
                      projectData.needsBackend && 'Backend',
                      projectData.needsCMS && 'CMS',
                      projectData.needsAuth && 'Authentication',
                      projectData.needsMultiLanguage && 'Multi-language'
                    ].filter(Boolean).join(', ') || 'Basic website'}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Special Requirements:</span>
                  <p className="text-blue-800">
                    {[
                      projectData.isUrgent && 'Urgent',
                      projectData.needsMaintenance && 'Ongoing maintenance',
                      projectData.needsAnimations && 'Animations'
                    ].filter(Boolean).join(', ') || 'Standard requirements'}
                  </p>
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
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Web Development Questionnaire</DialogTitle>
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
            {currentStep === 8 && (
              <p className="text-gray-600 mt-2">
                Review your information and get your recommended package
              </p>
            )}
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
                    const recommendedPackage = getRecommendedPackage();
                    const successMessage = `✅ Web Development Project for ${projectData.companyName} submitted successfully!\n\n🎯 Recommended: ${recommendedPackage.name}\n💰 Budget: ${recommendedPackage.price.toLocaleString()} SAR\n🚀 Project Type: ${projectData.projectType.replace('-', ' ')}\n📅 Launch Date: ${projectData.launchDate}\n\n📧 Our development team will contact you within 24 hours with a detailed proposal and timeline!`;
                    
                    console.log('Submitting web development questionnaire:', projectData);
                    alert(successMessage);
                    onClose();
                  }}
                  className="bg-[#01A1C1] hover:bg-[#0891B2] text-white shadow-lg hover:shadow-xl"
                >
                  🚀 Submit Web Development Project
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}