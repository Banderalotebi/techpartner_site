import React, { useState } from 'react';
import { X, Upload, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { ServicePackage } from '@shared/schema';

interface GeneralProjectQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicePackage: ServicePackage | null;
}

interface ProjectData {
  projectName: string;
  projectDescription: string;
  additionalRequirements: string;
  timeline: string;
  budget: string;
  contactMethod: 'email' | 'phone' | 'whatsapp';
  urgency: 'standard' | 'rush' | 'express';
  files: File[];
}

export function GeneralProjectQuestionnaireModal({ 
  isOpen, 
  onClose, 
  servicePackage 
}: GeneralProjectQuestionnaireModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    projectDescription: '',
    additionalRequirements: '',
    timeline: '',
    budget: '',
    contactMethod: 'email',
    urgency: 'standard',
    files: []
  });

  const totalSteps = 4;

  if (!isOpen || !servicePackage) return null;

  const handleInputChange = (field: keyof ProjectData, value: string) => {
    setProjectData({
      ...projectData,
      [field]: value
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProjectData({
      ...projectData,
      files: [...projectData.files, ...files]
    });
  };

  const removeFile = (index: number) => {
    const newFiles = projectData.files.filter((_, i) => i !== index);
    setProjectData({
      ...projectData,
      files: newFiles
    });
  };

  const handleSubmit = async () => {
    try {
      // Submit project data (replace with actual API call)
      const submissionData = {
        service: servicePackage,
        projectData
      };
      
      // Show success message with better styling
      const successMessage = `✅ Project "${projectData.projectName}" submitted successfully!\n\n📧 Our team will contact you via ${projectData.contactMethod} within 24 hours.\n💰 Total: ${servicePackage.price} SAR`;
      alert(successMessage);
      onClose();
    } catch (error) {
      alert('❌ Submission failed. Please try again or contact support.');
    }
  };

  const canSubmit = () => {
    return projectData.projectName.trim() !== '' && 
           projectData.projectDescription.trim() !== '';
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    'Project Details',
    'Requirements & Files',
    'Timeline & Budget',
    'Contact & Delivery'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{stepTitles[currentStep - 1]}</h2>
            <p className="text-gray-600 mt-1">Step {currentStep} of {totalSteps} - {servicePackage.name} project</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#01A1C1] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            {stepTitles.map((title, index) => (
              <span 
                key={index}
                className={`${currentStep > index ? 'text-[#01A1C1] font-medium' : ''}`}
              >
                {title}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Service & Price Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Selected Service</h3>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900">{servicePackage.name}</h4>
                <p className="text-gray-600 text-sm">{servicePackage.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#01A1C1]">{servicePackage.price} SAR</div>
                <div className="text-sm text-gray-500">Starting price</div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                  placeholder="Enter your project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={projectData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                  placeholder="Describe your project goals, target audience, and key requirements"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements
                </label>
                <textarea
                  value={projectData.additionalRequirements}
                  onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                  placeholder="Any specific requirements, style preferences, or technical specifications"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Uploads
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#01A1C1] transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload inspiration files, logos, or reference materials
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                {projectData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {projectData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Timeline
                </label>
                <select
                  value={projectData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                >
                  <option value="">Select timeline</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="2+ months">2+ months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  value={projectData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  <option value="Under 5,000 SAR">Under 5,000 SAR</option>
                  <option value="5,000 - 15,000 SAR">5,000 - 15,000 SAR</option>
                  <option value="15,000 - 30,000 SAR">15,000 - 30,000 SAR</option>
                  <option value="30,000+ SAR">30,000+ SAR</option>
                  <option value="To be discussed">To be discussed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Urgency
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'standard', label: 'Standard', desc: 'Normal timeline' },
                    { value: 'rush', label: 'Rush', desc: '+25% fee' },
                    { value: 'express', label: 'Express', desc: '+50% fee' }
                  ].map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleInputChange('urgency', option.value)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        projectData.urgency === option.value
                          ? 'border-[#01A1C1] bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'email', label: 'Email', icon: '📧' },
                    { value: 'phone', label: 'Phone', icon: '📞' },
                    { value: 'whatsapp', label: 'WhatsApp', icon: '💬' }
                  ].map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleInputChange('contactMethod', option.value)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        projectData.contactMethod === option.value
                          ? 'border-[#01A1C1] bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Summary */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-[#01A1C1]">Project Summary</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Project:</span> {projectData.projectName || 'Not specified'}</div>
                  <div><span className="font-medium">Service:</span> {servicePackage.name}</div>
                  <div><span className="font-medium">Timeline:</span> {projectData.timeline || 'Not specified'}</div>
                  <div><span className="font-medium">Budget:</span> {projectData.budget || 'Not specified'}</div>
                  <div><span className="font-medium">Urgency:</span> {projectData.urgency}</div>
                  <div><span className="font-medium">Contact:</span> {projectData.contactMethod}</div>
                  <div><span className="font-medium">Files:</span> {projectData.files.length} uploaded</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && (!projectData.projectName.trim() || !projectData.projectDescription.trim())}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  (currentStep === 1 && (!projectData.projectName.trim() || !projectData.projectDescription.trim()))
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#01A1C1] text-white hover:bg-[#0891B2]'
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  !canSubmit()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Submit Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralProjectQuestionnaireModal;
