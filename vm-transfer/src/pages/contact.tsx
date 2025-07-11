import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const contactInfo = [
  {
    icon: <Mail className="text-[#01A1C1]" size={24} />,
    title: "Email",
    details: "hello@techpartner.com",
    description: "Send us an email anytime!"
  },
  {
    icon: <Phone className="text-[#01A1C1]" size={24} />,
    title: "Phone",
    details: "+966 50 123 4567",
    description: "Call us for urgent matters"
  },
  {
    icon: <MapPin className="text-[#01A1C1]" size={24} />,
    title: "Location",
    details: "Riyadh, Saudi Arabia",
    description: "We're based in the heart of KSA"
  },
  {
    icon: <Clock className="text-[#01A1C1]" size={24} />,
    title: "Working Hours",
    details: "Sun - Thu: 9AM - 6PM",
    description: "Saudi Arabian timezone"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
    budget: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get In <span className="text-[#01A1C1]">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Ready to start your project? We'd love to hear from you. 
              Send us a message and we'll respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                      placeholder="+966 50 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Needed
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      <option value="logo-design">Logo & Brand Identity</option>
                      <option value="web-design">Web Design</option>
                      <option value="web-development">Web Development</option>
                      <option value="business-advertising">Business & Advertising</option>
                      <option value="art-illustration">Art & Illustration</option>
                      <option value="packaging-label">Packaging & Label</option>
                      <option value="print-design">Print Design</option>
                      <option value="social-media">Social Media Design</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under 5,000 SAR</option>
                      <option value="5k-15k">5,000 - 15,000 SAR</option>
                      <option value="15k-30k">15,000 - 30,000 SAR</option>
                      <option value="30k-50k">30,000 - 50,000 SAR</option>
                      <option value="over-50k">Over 50,000 SAR</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A1C1] focus:border-transparent"
                    placeholder="Tell us about your project, requirements, timeline, and any specific needs..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#01A1C1] text-white py-4 rounded-lg font-semibold hover:bg-[#0189A8] transition-colors flex items-center justify-center"
                >
                  <Send className="mr-2" size={20} />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Let's Start a Conversation</h2>
                <p className="text-gray-600 mb-6">
                  We're here to help you bring your ideas to life. Whether you have a specific project in mind 
                  or just want to explore possibilities, we'd love to hear from you.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What to expect:</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#01A1C1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Response within 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#01A1C1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Free consultation call</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#01A1C1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Detailed project proposal</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#01A1C1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Transparent pricing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Response</h3>
                <p className="text-gray-600 mb-4">
                  Need immediate assistance? Use our questionnaire system to get started right away.
                </p>
                <button className="bg-[#01A1C1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0189A8] transition-colors">
                  Start Project Questionnaire
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}